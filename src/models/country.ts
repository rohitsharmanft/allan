import mongoose from "mongoose";


const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    unique: true,
  },
  region: {
    type: String,
    required: true, // Optional: Region name, could be 'Southern Africa', 'Northern Africa', etc.
  },
});

// Create a model based on the schema
const Country = mongoose.model("Country", countrySchema);

export default Country;
