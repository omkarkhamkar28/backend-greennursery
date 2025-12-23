const Schedule = require("../models/soilTestsingModel");
const mongoose = require("mongoose");

const createSoilTestingController = async (req, res) => {
  try {
    const data = {
      ...req.body 
    };

    const schedule = new Schedule(data);
    await schedule.save();

    res.status(201).send({
      success: true,
      message: "Soil testing created successfully",
      schedule,
      _id: schedule._id 
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while creating soil testing",
      error: error.message
    });
  }
};
 

const getAllSoilTestingController = async (req, res) => {
   try {
     const schedules = await Schedule.find({})
      .populate("user_id", "name email")  
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "सर्व farmers चे schedules मिळाले",
      count: schedules.length,
      schedules
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Admin schedule fetch error",
      error: error.message
    });
  }
};


const getMySoilTestingController = async (req, res) => {
  try {
    const schedules = await Schedule.find({
      user_id: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      count: schedules.length,
      schedules
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching soil testing data",
      error: error.message
    });
  }
};

 const getSingleSoilTestingController = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).send({
        success: false,
        message: "Soil testing not found"
      });
    }

    res.status(200).send({
      success: true,
      schedule
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching soil testing",
      error: error.message
    });
  }
};

 const updateSoilTestingController = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).send({
        success: false,
        message: "Soil testing not found"
      });
    }

    res.status(200).send({
      success: true,
      message: "Soil testing updated successfully",
      schedule
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating soil testing",
      error: error.message
    });
  }
};

const deleteSoilTestingController = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
      return res.status(404).send({
        success: false,
        message: "Soil testing not found"
      });
    }

    res.status(200).send({
      success: true,
      message: "Soil testing deleted successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting soil testing",
      error: error.message
    });
  }
};

  

module.exports = {
  createSoilTestingController,
  getMySoilTestingController,
  getSingleSoilTestingController,
  updateSoilTestingController,
  deleteSoilTestingController,
  getAllSoilTestingController
 };
