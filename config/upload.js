const multer = require('multer');
const fs = require('fs');

module.exports = {
    uploadImage: (target) => {

        const images = ['jpg', 'png', 'jpeg', 'gif']

        const extension = (file) => {
            let split = file.originalname.split('.')
            return split[split.length - 1]
        }

        const fileFilter = (req, file, cb) => {
            let ext = extension(file);
            images.findIndex(i => i === ext) >= 0 ? cb(null, true) : cb(null, false);
        }

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                let dir = `./public/images/${target}`
                if (fs.existsSync(dir)) {
                    cb(null, dir)
                } else {
                    fs.mkdir(dir, { recursive: true }, (error) => cb(error, dir))
                }
            },
            filename: (req, file, cb) => {
                let split = file.originalname.split('.');
                let ext = split[split.length - 1];
                cb(null, `IMG-${Date.now()}.${ext}`)
            }
        })

        return multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 5 } })
    }
}