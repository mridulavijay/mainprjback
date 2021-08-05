const express=require("express");
const app=express();
const adminrouter=express.Router();
const multer=require('multer');
const Trainerdata = require("../model/Trainerdata");
const nodemailer = require('nodemailer');
const emp = ['Internal', 'Empanelled','Industry Expert'];


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tmsadmn@gmail.com',
    pass: 'ICTkerala@12'
  }
});

app.use(express.urlencoded({extended:true}));

function router(tokverify){
    
    adminrouter.get('/requests',tokverify,function(req,res){
        console.log("Request page");
        Trainerdata.find({"approved":false})
        .then(function(trainers){
            res.send(trainers);
          })

      });

   
    adminrouter.get('/trainer/:id',function(req,res){
        const id = req.params.id;
        
      Trainerdata.findOne({_id:id}) 
        
       .then(function(trainers){
        
           res.send(trainers);
        })

     });
     adminrouter.get('/calender/:email',function(req,res){
      const emailc = req.params.email;
     if(emailc=="tmsadmn@gmail.com"){
      Trainerdata.find() 
      
     .then(function(trainers){
       res.send(trainers);})
     }
     else{
    Trainerdata.findOne({email:emailc}) 
      
     .then(function(trainers){
     
         res.send(trainers);
      })
    }
   });
     
    adminrouter.get('/requests/accept/:id',tokverify,function(req,res){
        
     const id = req.params.id;
     
        var empdetails=emp[Math.floor(Math.random() * emp.length)];
         
       Trainerdata.findByIdAndUpdate(id,{$set:{"approved":true,
       "employment" :emp[Math.floor(Math.random() * emp.length)]} 
       
       })
        .then(function(trainers){
          var mailOptions = {
            from: 'tmsadmn@gmail.com',
             to: trainers.email,
            subject: 'Selected as a Trainer at ICT',
           
            html:`<p>'Congratulations!! you have been selected as a trainer at ICT.Please find the details below:<br>
            Type of employment:${empdetails},Trainer ID:${trainers.ID}</p>`
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
                 res.send(trainers);
               })
     
         });
 
 
    //  adminrouter.get('/requests/delete',function(req,res){
    //            const id = req.params.id;
    //     Trainerdata.deleteOne({_id:id},(err,resp)=>{
    //         if(err){
    //             console.log(err);
    //         }
    //         else{

    //           var mailOptions = {
    //             from: 'tmsadmn@gmail.com',
    //              to: req.body.email,
    //             subject: 'Unfortunately you are not selected',
    //             text: 'We are sorry that we cannot hire you at the moment.'
    //           };
    //           transporter.sendMail(mailOptions, function(error, info){
    //             if (error) {
    //               console.log(error);
    //             } else {
    //               console.log('Email sent: ' + info.response);
    //             }
    //           });

    //         }
    //     })
 
    //  });
    
    
    adminrouter.delete('/requests/delete/:id',tokverify,function(req,res){
      const id = req.params.id;
        
      
          Trainerdata.findOne({_id:id}) 

          .then(function(trainers){
          var mailOptions = {
            from: 'tmsadmn@gmail.com',
             to: trainers.email,
            subject: 'Unfortunately you are not selected',
            text: 'We are sorry that we cannot hire you at the moment.'
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } 
            else {
          console.log('Email sent: ' + info.response);}
        })
        });
        Trainerdata.deleteOne({_id:id},(err,resp)=>{
          if(err){
              console.log(err);
          }
          else{
            console.log("deleted successfully");
          }
      });

    
    res.send();
        })
 
     
    
     adminrouter.put('/allocation',tokverify,function(req,res){
      
          
        Trainerdata.findOneAndUpdate({"email":req.body.trainer.email},{$set:{"startdate":req.body.trainer.startdate,
          "enddate":req.body.trainer.enddate,
          "time":req.body.trainer.time,
          "coursename":req.body.trainer.coursename,
          "courseid":req.body.trainer.courseid,
          "batchid":req.body.trainer.batchid,
          "meetingvenue":req.body.trainer.meetingvenue} 
        
        })
         .then(function(trainers){
         
           var mailOptions = {
             from: 'tmsadmn@gmail.com',
              to: trainers.email,
             subject: 'Trainer Allocation Details',
            
             html:`<p>'Your allocation is complete!!Please find the details below:<br>
             StartDate:${req.body.trainer.startdate},Enddate:${req.body.trainer.enddate},Coursename:${req.body.trainer.coursename},CourseID:${req.body.trainer.courseid},BatchID:${req.body.trainer.batchid},meetingvenue:${req.body.trainer.meetingvenue}</p>`
           };
           transporter.sendMail(mailOptions, function(error, info){
             if (error) {
               console.log(error);
             } else {
               console.log('Email sent: ' + info.response);
             }
           });
                  res.send();
                })
      
          });   
    
         // Admin Trainer Profiles
    
        adminrouter.get('/trainerprofiles',tokverify,function(req,res){
          console.log("Trainer Profiles Page");
          Trainerdata.find({"approved":true})
          .then(function(trainers){
              res.send(trainers);
            })
  
        });
  

        adminrouter.delete('/trainerprofiles/delete/:id',tokverify,function(req,res){
          const id = req.params.id;
          Trainerdata.deleteOne({_id:id},(err,resp)=>{
       if(err){
           console.log(err);
       }
       else{
         console.log("deleted successfully");
         
         }
       
   })
   res.send();
});
  
  adminrouter.get('/trainerprofiles/:id',tokverify,(req,res)=>{
  const id=req.params.id;
  
  Trainerdata.findOne({$and:[{_id:id},{"approved":true}]})
  .then(function(trainer){
    res.send(trainer);
  })
}
)


adminrouter.put('/trainerprofiles/edit',tokverify,function(req,res){
 coursedata='';
 objcourse=JSON.parse(req.body.ictakcourses);
                for(i=0;i<objcourse.length;i++){
                    if(i==0){
                    coursedata=coursedata.concat(objcourse[i].name)}
                    else{
                        coursedata=coursedata.concat(',',objcourse[i].name);
                    }
                }
  var item = {
    name:req.body.name,
    phone:req.body.phone,
    address:req.body.address,
  qualification:req.body.qualification,
  skillset:req.body.skillset,
   company:req.body.company,
  designation:req.body.designation,
   ictakcourses:coursedata,
  approved:true,
  employment:req.body.employment
}

  Trainerdata.findOneAndUpdate({"email":req.body.email},item,(err,resp)=>{
if(err){
   console.log(err);
}
else{
 console.log("Updated the profile successfully");
 
 }
res.send();
})

});


//   Search
 
  adminrouter.put('/trainerprofiles/search',tokverify,function(req,res){

  var regex = new RegExp(req.body.search.text,'i');
  Trainerdata.find({ $and:[{$or: [{name:regex}, {skillset:regex},{ictakcourses:regex},{employment:regex}]},{"approved":true}] })
  
  .then(function(trainers){
    res.send(trainers);
  })

 });  
//  adminrouter.get('/trainerprofiles/search/:name',tokverify,function(req,res){

//   var regex = new RegExp(req.params.name,'i');
//   Trainerdata.find({name:regex})
//   .then(function(trainers){
//     res.send(trainers);
//   })

//  });  
 
//  adminrouter.get('/trainerprofiles/search/:skillset',tokverify,function(req,res){

//   var regex = new RegExp(req.params.skillset,'i');
//   Trainerdata.find({skillset:regex})
//   .then(function(trainers){
//     res.send(trainers);
//   })

//  });  
 
//  adminrouter.get('/trainerprofiles/search/:coursedata',tokverify,function(req,res){

//   var regex = new RegExp(req.params.coursedata,'i');
//   Trainerdata.find({coursedata:regex})
//   .then(function(trainers){
//     res.send(trainers);
//   })

//  });  
    
//  adminrouter.get('/trainerprofiles/search/:employment',tokverify,function(req,res){

//   var regex = new RegExp(req.params.employment,'i');
//   Trainerdata.find({employment:regex})
//   .then(function(trainers){
//     res.send(trainers);
//   })

//  });  
    
  
    
    
return adminrouter;
}
module.exports=router;
