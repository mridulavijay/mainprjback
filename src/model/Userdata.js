const mongoose=require('mongoose');
mongoose.connect("mongodb+srv://userone:userone@fsdfiles.ev4q3.mongodb.net/TrainerManagementSystem",{
   useNewUrlParser:true,
  useUnifiedTopology:true
});
//mongoose.connect("mongodb://localhost:27017/librarycase")
const Schema=mongoose.Schema;
const UserSchema= new Schema({
    
    password:String,
    email:String,
    userCategory:String
});
var Userdata=mongoose.model("userdata",UserSchema);
module.exports=Userdata;