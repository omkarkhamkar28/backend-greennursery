const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, path.join(__dirname, "../upload/"));
    },
    filename: (req, file, cb) => {
        const notes = req.body.notestitle || "notestitle";

        const filename = notes + "_" + file.originalname;
        cb(null, filename);
    },
});

// Create multer object
const upload = multer({ storage: storage });

module.exports = upload;
