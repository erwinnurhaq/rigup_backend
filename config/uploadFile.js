const multer = require('multer');
const fs = require('fs');

module.exports = {
	uploadFile(destination, fileNamePrefix) {
		let defaultPath = './public';

		const storage = multer.diskStorage({
			destination: (req, file, cb) => {
				const dir = defaultPath + destination;
				if (fs.existsSync(dir)) {
					console.log(dir, 'exists');
					cb(null, dir);
				} else {
					fs.mkdir(dir, { recursive: true }, (err) => cb(err, dir));
					console.log(dir, 'make');
				}
			},
			filename: (req, file, cb) => {
				console.log('file', file);
				let originalname = file.originalname;
				console.log('originalname', originalname);
				let ext = originalname.split('.');
				console.log('ext', ext);
				let filename = fileNamePrefix + Date.now() + '.' + ext[ext.length - 1];
				console.log('filename', filename);
				cb(null, filename);
			}
		});

		const fileFilter = (req, file, cb) => {
			const ext = /\.(jpg|jpeg|png|gif|pdf|doc|docx|xlsx|mp4|mp3)$/;
			if (!file.originalname.match(ext)) {
				return cb(new Error('Only selected file type are allowed'), false);
			}
			cb(null, true);
		};

		return multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 10 } });
	}
};
