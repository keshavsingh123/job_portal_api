import mongoose from "mongoose";

let jobSchema = new mongoose.Schema({
    company:{
        type:String,
        requires:[true,"company name is required"]
    },
    position:{
        type:String,
        requires:[true,"job position name is required"],
        maxlength:100
    },
    status:{
        type:String,
        enum:['pending','failed','interview'],
        default:'pending'
    },
    workType:{
        type:String,
        enum:['full-time','part-time','contact','internship'],
        default:'full-time'
    },
    workLocation:{
        type:String,
        default:'mumbai',
        required:[true,"location is required"]
    },
    createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
    }

},
{timeStamps:true})

export default mongoose.model('Job',jobSchema)