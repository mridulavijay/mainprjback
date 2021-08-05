const mongoose=require('mongoose');
mongoose.connect("mongodb+srv://userone:userone@fsdfiles.ev4q3.mongodb.net/TrainerManagementSystem",{
   useNewUrlParser:true,
  useUnifiedTopology:true
});
//mongoose.connect("mongodb://localhost:27017/librarycase")
const Schema=mongoose.Schema;
const TrainerSchema= new Schema({
    name:String,
    email:String,
    phone:String,
    address:String,
    qualification:String,
    skillset:String,
    company:String,
    designation:String,
    ictakcourses:String,
    photo:String,
    ID:String,
    approved:Boolean,
    employment:String,
    startdate:Date,
    enddate:Date,
    time:String,
    coursename:String,
    courseid:String,
    batchid:String,
    meetingvenue:String
    
});
var Trainerdata=mongoose.model("trainerdata",TrainerSchema);
module.exports=Trainerdata;