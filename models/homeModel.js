const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
 
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
});


module.exports = mongoose.model('Home',homeSchema);
