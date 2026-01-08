const multer = require("multer");

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./upload"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage: productStorage });

const profileStorage = multer.memoryStorage();
const ProductImageUpload = multer({ storage: profileStorage });

module.exports = { upload, ProductImageUpload };
