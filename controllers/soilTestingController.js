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
    const { id } = req.params;

    const updateData = {};

    // simple field
    if (req.body.soilTestingName)
      updateData.soilTestingName = req.body.soilTestingName;

    // SOIL
    if (req.body.soil) {
      Object.keys(req.body.soil).forEach((key) => {
        updateData[`soil.${key}`] = req.body.soil[key];
      });
    }

    // CROP
    if (req.body.crop) {
      Object.keys(req.body.crop).forEach((key) => {
        updateData[`crop.${key}`] = req.body.crop[key];
      });
    }

    // WEATHER
    if (req.body.weather) {
      Object.keys(req.body.weather).forEach((key) => {
        updateData[`weather.${key}`] = req.body.weather[key];
      });
    }

    // MANUAL
    if (req.body.manual) {
      Object.keys(req.body.manual).forEach((key) => {
        updateData[`manual.${key}`] = req.body.manual[key];
      });
    }

    const schedule = await Schedule.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Schedule updated successfully",
      schedule
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Update failed",
      error
    });
  }
};

const updateSingleSectionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { section, data } = req.body;

    // section = soil | crop | weather | manual
    if (!section || !data) {
      return res.status(400).json({
        success: false,
        message: "Section & data required"
      });
    }

    const updateObj = {};

    Object.keys(data).forEach((key) => {
      updateObj[`${section}.${key}`] = data[key];
    });

    const schedule = await Schedule.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `${section} updated successfully`,
      schedule
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Section update failed"
    });
  }
};

const updateSingleFieldController = async (req, res) => {
  try {
    const { id } = req.params;
    const { path, value } = req.body;

    // path example: "soil.ph" OR "crop.name"
    if (!path) {
      return res.status(400).json({
        success: false,
        message: "Path is required"
      });
    }

    const updateObj = {
      [path]: value
    };

    const schedule = await Schedule.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Single field updated",
      schedule
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Single update failed"
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
  getAllSoilTestingController,
  updateSingleSectionController,
  updateSingleFieldController
 };
