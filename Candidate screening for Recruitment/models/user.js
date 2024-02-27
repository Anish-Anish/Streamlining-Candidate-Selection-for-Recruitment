const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: [true, "Firstname is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    phone: {
        type: String, 
        required: [true, "Phone is required"]
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    college: {
        type: String,
        required: [true, "College is required"]
    },
    carrierobj: {
        type: String,
        required: [true, "Career Objectives is required"]
    },
    'class-12': {
        type: String,
        required: [true, "Class-12% is required"]
    },
    cgpa: {
        type: String,
        required: [true, "Current CGPA is required"]
    },
    programming: {
        type: String,
        required: [true, "Programming language Known is required"]
    },
    aoi: {
        type: String,
        required: [true, "Area of Interest is required"]
    },
    Certification_Interships: {
        type: String,
        required: [true, "Certification_Interships is required"]
    },
    portfoliolink: {
        type: String,
       
    },
    githubLink: {
        type: String,
      
    },
    projecttitle: {
        type: String,
        required: [true, "Project Title is required"]
    },
    techUsed: {
        type: String,
        required: [true, "Tech used in projects is required"]
    },
    upload: {
        type: String, 
       
    }
});

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
