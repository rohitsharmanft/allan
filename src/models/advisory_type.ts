import mongoose from "mongoose";

const advisoryTypeSchema=new mongoose.Schema({
    image:{
        type:String,
        default:null
    },
    name:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        enum:["Client","Member"],
        required:true,

    }
},{timestamps:true})

const AdvisoryType = mongoose.model("AdvisoryType",advisoryTypeSchema);
export default AdvisoryType;