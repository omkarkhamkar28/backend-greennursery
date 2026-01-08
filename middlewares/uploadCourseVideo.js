const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, path.join(__dirname, "../uploadVideos/"));
    },
    filename: (req, file, cb) => {
        const notes = req.body.videotitle || "videotitle";
        const course = req.body.courseName || "course";

        const filename = notes + "_" + course + "_techready.mp4";
        cb(null, filename);
    },
});

// Create multer object
const uploadVideos = multer({ storage: storage });

module.exports = uploadVideos;
