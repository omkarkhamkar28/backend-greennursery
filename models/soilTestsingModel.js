const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            index: true
        },

        soilTestingName: {
            type: String,
        },

        soil: {
            soilType: String,          // मातीचा प्रकार  
            ph: Number,                //  pH
            n: Number,                 // Nitrogen
            p: Number,                 // Phosphorus
            k: Number,                 // Potassium
            organicCarbon: Number,     // सेंद्रिय कर्ब
            moisture: Number,          // मातीतील ओलावा (%)
            soilTemperature: Number    // मातीचे तापमान
        },

        crop: {
            name: String,              // पीक नाव
            variety: String,           // पीक वाण / type
            category: String,          // पीक प्रकार (भाजी / फळ / ऊस)
            sowingDate: Date,          // लागवड तारीख
            cropDurationDays: Number,  // पीक कालावधी (दिवस)
            expectedHarvestDate: Date, // अपेक्षित काढणी तारीख
        },

        weather: {
            temperature: String,       // तापमान (°C)
            rainfall: String,          // पर्जन्यमान (mm)
            humidity: String,          // आर्द्रता (%)
            windSpeed: String,         // वाऱ्याचा वेग
            condition: String,         // हवामान स्थिती (Sunny / Rainy)
            locationName: String       // ठिकाणाचे नाव
        },

        manual: {
            soilType: String,            // मातीचा प्रकार
            cropName: String,            // पीक नाव
            variety: String,             // पीक वाण / type 
            category: String,            // पीक प्रकार (भाजी / फळ / ऊस)
            plantingDate: Date,          // लागवड तारीख
            cropDurationDays: Number,    // पीक कालावधी (दिवस)
            lastIrrigationDate: Date     // मागील पाणी देण्याची तारीख
        }

    },
    { timestamps: true }
);

// scheduleSchema.index(
//     { user_id: 1, soilTestingName: 1 },
//     { unique: true }
// );


// Create model
const Schedule = mongoose.model("schedule", scheduleSchema);

module.exports = Schedule;
