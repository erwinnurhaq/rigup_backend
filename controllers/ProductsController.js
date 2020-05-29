const db = require('../config/database');
const fs = require('fs');
const util = require('util');
const dbquery = util.promisify(db.query).bind(db);
const { uploadFile } = require('../config/uploadFile');

const sortProduct = [
	{ id: 1, name: `id desc` },
	{ id: 2, name: 'name' },
	{ id: 3, name: 'name desc' },
	{ id: 4, name: 'price' },
	{ id: 5, name: 'price desc' },
	{ id: 6, name: 'stock' },
	{ id: 7, name: 'stock desc' },
	{ id: 8, name: 'brandId' }
]

module.exports = {
	getProducts: async (req, res) => {
		try {
			console.log(req.query)
			let query;
			let order = req.query.sort ? sortProduct.filter(i => i.id === parseInt(req.query.sort))[0].name : 'id desc'
			console.log(req.query.search)
			let search = req.query.search ? req.query.search.replace(/[^0-9a-zA-Z\s-]/gi, '') : null
			let filter = req.query.filter && parseInt(req.query.filter) > 0 ? db.escape(parseInt(req.query.filter)) : null
			if(!search && !filter){
				query = `select * from product_complete_fix
						where mainParentId is null order by ${order}
						${req.query.limit ? `limit ? offset ?` : ''}`;
			} else if(search && !filter){
				query =`select p.*, cl.id as categoryId, cl.category, cl.mainParentId, img.image from
						(select id, brandId, name, description, weight, wattage, price, stock, brand from product_complete_fix
						where name like '%${search}%'
						or brand like '%${search}%'
						or category like '%${search}%'
						group by id) p
						join product_cats pc on p.id = pc.productId
						join category_leaf cl on cl.id = pc.categoryId
						join (select pi.productId, pi.image
							from (select min(id) as id from product_images group by productId) i
							join product_images pi on pi.id = i.id) img on img.productId = p.id
						order by p.${order}
						${req.query.limit ? `limit ? offset ?` : ''}`;
			} else if(search && filter){
				query =`select p.*, cl.id as categoryId, cl.category, cl.mainParentId, img.image from
						(select id, brandId, name, description, weight, wattage, price, stock, brand from product_complete_fix
						where name like '%${search}%'
						or brand like '%${search}%'
						or category like '%${search}%'
						group by id) p
						join product_cats pc on p.id = pc.productId
						join category_leaf cl on cl.id = pc.categoryId
						join (select pi.productId, pi.image
							from (select min(id) as id from product_images group by productId) i
							join product_images pi on pi.id = i.id) img on img.productId = p.id
						where categoryId = ${filter} or mainParentId = ${filter}
						order by p.${order}
						${req.query.limit ? `limit ? offset ?` : ''}`;
			}

			const result = await dbquery(query, [
				parseInt(req.query.limit),
				parseInt(req.query.offset)
			]);

			query = `select * from product_cats_complete
                    where productId in (?)`;
			const productCats = await dbquery(query, [result.map((i) => i.id)]);

			result.forEach((p) => {
				if (p.image === null) {
					p.image = `/images/products/default.png`
				}
				var x = productCats.filter((i) => i.productId === p.id);
				p.categories = x
					.map((i) => {
						return { categoryId: i.categoryId, category: i.category };
					})
					.sort((a, b) => a.categoryId - b.categoryId);
			});

			if (result.length === 0) {
				return res.status(404).send({ message: 'product not found' })
			}
			res.status(200).send(result);
		} catch (error) {
			res.status(500).send(error);
		}
	},

	getUncategorizedProduct: async (req, res) => {
		try {
			const query = `select p.*, b.brand from products p
                            left join product_cats pc on p.id = pc.productId
                            join brands b on b.id = p.brandId
                            where pc.id is null`;
			let result = await dbquery(query);
			res.status(200).send(result);
		} catch (error) {
			res.status(500).send(error);
		}
	},

	getProductByCategoryId: async (req, res) => {
		try {
			let order = req.query.sort ? sortProduct.filter(i => i.id === parseInt(req.query.sort))[0].name : 'id desc'
			let cat = parseInt(req.params.categoryId)
			let query = `select * from product_complete_fix
						${cat !== 0
							? `where categoryId = ${db.escape(cat)}` 
							: `where mainParentId is null`
						}
						order by ${order}
						${req.query.limit ? `limit ? offset ?` : '' }`
			const result = await dbquery(query, [
				parseInt(req.query.limit),
				parseInt(req.query.offset)
			]);

			if (result.length === 0) {
				return res.status(404).send({ message: 'product not found' });
			}

			query = `select * from product_cats_complete
                    where productId in (?)`;
			const productCats = await dbquery(query, [result.map((i) => i.id)]);

			result.forEach((p) => {
				if (p.imageId === null) {
					p.image = `/images/products/default.png`
				}
				var x = productCats.filter((i) => i.productId === p.id);
				p.categories = x
					.map((i) => {
						return { categoryId: i.categoryId, category: i.category };
					})
					.sort((a, b) => a.categoryId - b.categoryId);
			});
			res.status(200).send(result);
		} catch (error) {
			res.status(500).send(error);
		}
	},

	getCountProductByCategoryId: async (req, res) => {
		try {
			let cat = parseInt(req.params.categoryId)
			let query = `select count(p.id) as count from products p
                        ${cat !== 0 ? `join product_cats pc on pc.productId = p.id
						join brands b on b.id = p.brandId
						where pc.categoryId = ${db.escape(cat)}` : ''}`;
			const result = await dbquery(query);
			if (result.length === 0) {
				return res.status(404).send({ message: 'product not found' });
			}
			res.status(200).send(result[0]);
		} catch (error) {
			res.status(500).send(error);
		}
	},

	getProductDetailById: async (req, res) => {
		try {
			let query = `select p.*, b.brand from products p
                        join brands b on b.id = p.brandId
                        where p.id = ?`;
			const result = await dbquery(query, [req.params.id]);

			if (result.length === 0) {
				return res.status(404).send({ message: 'product not found' });
			}

			query = `select id, image from product_images where productId = ?`;
			const images = await dbquery(query, [result[0].id]);

			query = `select categoryId, category from product_cats_complete
                    where productId = ?`;
			const productCats = await dbquery(query, [result[0].id]);

			if (images.length === 0) {
				result[0].images = [{ id: null, image: `/images/products/default.png` }]
			} else {
				result[0].images = images
			}
			result[0].categories = productCats.sort((a, b) => a.categoryId - b.categoryId);
			res.status(200).send(result[0]);
		} catch (error) {
			res.status(500).send(error);
		}
	},

	addProduct: async (req, res) => {
		const path = '/images/products';
		let images = [];
		const upload = util.promisify(uploadFile(path, 'IMG').fields([{ name: 'image' }]));

		try {
			await upload(req, res);
			if (req.files.image) {
				images = req.files.image.map((i) => `${path}/${i.filename}`);
			}

			const data = JSON.parse(req.body.data);
			let query = `INSERT INTO products SET ?`;
			const result = await dbquery(query, { ...data.newProduct });

			if (req.files.image) {
				let img = images.map((i) => [result.insertId, i]);
				console.log(img)
				query = `INSERT INTO product_images (productId,image) VALUES ?`;
				await dbquery(query, [img]);
			}

			let productCat = data.newCategories.sort((a, b) => b - a).map((i) => [result.insertId, i]);
			query = `INSERT INTO product_cats (productId,categoryId) VALUES ?`;
			await dbquery(query, [productCat]);

			res.status(200).send(result);
		} catch (error) {
			if (images.length !== 0) {
				images.forEach((i) => {
					fs.unlinkSync('./public' + i);
				});
			}
			res.status(500).send(error);
		}
	},

	editProductById: async (req, res) => {
		const path = '/images/products';
		let images = [];
		const upload = util.promisify(uploadFile(path, 'IMG').fields([{ name: 'image' }]));
		let query;
		try {
			await upload(req, res);
			const id = parseInt(req.params.id);
			const data = JSON.parse(req.body.data);
			const deleteImage = JSON.parse(req.body.deleteImage)

			if (req.files.image) {
				images = req.files.image.map((i) => `${path}/${i.filename}`);
				let arr = images.map((i) => [id, i]);
				query = `INSERT INTO product_images (productId,image) VALUES ?`;
				await dbquery(query, [arr]);
			}
			if (deleteImage.length !== 0) {
				deleteImage.forEach(i => {
					fs.unlinkSync('./public' + i.image)
					console.log('delete: ', './public' + i.image)
				})
				let imageId = deleteImage.map(i => i.id)
				console.log('imageId:', imageId)
				query = `DELETE FROM product_images WHERE id in (?)`
				await dbquery(query, [imageId])
				console.log('delete done')
			}

			console.log('dataNewProduct: ', data.newProduct)
			query = `UPDATE products SET ? WHERE id = ${db.escape(id)}`;
			const result = await dbquery(query, data.newProduct);

			query = `DELETE FROM product_cats WHERE productId = ?`;
			await dbquery(query, [id]);

			let productCat = data.newCategories.sort((a, b) => b - a).map((i) => [id, i]);
			console.log('productCat', productCat)
			query = `INSERT INTO product_cats (productId,categoryId) VALUES ?`;
			await dbquery(query, [productCat]);
			res.status(200).send(result);

		} catch (error) {
			if (images.length !== 0) {
				images.forEach((i) => {
					fs.unlinkSync('./public' + i);
				});
			}
			res.status(500).send(error);
		}
	},

	deleteProductById: async (req, res) => {
		try {
			let query = `DELETE FROM products WHERE id = ?`;
			const result = await dbquery(query, [req.params.id]);
			if (result.affectedRows === 0) {
				return res.status(404).send({ message: 'product id not found' });
			}
			console.log(result)
			query = `DELETE FROM product_cats WHERE productId = ?`;
			await dbquery(query, [req.params.id])

			query = `SELECT * FROM product_images WHERE productId = ?`;
			let selected = await dbquery(query, [req.params.id])
			console.log(selected)
			selected.forEach(i => {
				fs.unlinkSync('./public' + i.image)
				console.log('./public' + i.image)
			})

			query = `DELETE FROM product_images WHERE productId = ?`;
			await dbquery(query, [req.params.id])
			res.status(200).send(result);
		} catch (error) {
			res.status(500).send(error);
		}
	}
};
