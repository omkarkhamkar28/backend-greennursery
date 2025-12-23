const express = require("express");
const router = express.Router();
const { requireSignIn } = require("../middlewares/authMiddlewares");
const { createSoilTestingController, getMySoilTestingController,
    getSingleSoilTestingController, updateSoilTestingController,
    deleteSoilTestingController, getAllSoilTestingController
} = require("../controllers/soilTestingController");



router.post("/create", createSoilTestingController);

router.get("/views", getAllSoilTestingController);

router.get("/views/:id", requireSignIn, getMySoilTestingController);

router.get("/view/:id", getSingleSoilTestingController);

router.put("/update/:id", requireSignIn, updateSoilTestingController);

router.delete("/delete/:id", requireSignIn, deleteSoilTestingController);


module.exports = router;
