var express = require('express');
  var app = express();
  var http = require('http');
  var httpServer = http.Server(app);
  var bodyParser=require('body-parser');
  var mongoose=require('mongoose');
  var multer=require('multer');
  var fs=require('fs');
  var msg="";
  var error="";

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
 mongoose.connect('mongodb://localhost/dummy');
  var Schema=new mongoose.Schema({
        fname:{type:String},
        lname:{type:String},
        email:{type:String},
        pass:{type:String},
        user:{type:String},
        file:{type:String},
        addr:{ type : Array , "default" : [] },
        files:{type:Array,"default":[]}
      });



  var enter=mongoose.model('xfile',Schema);

      



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/public/img')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'-'+file.originalname )
  }
});

var upload = multer({
  storage : storage
})


app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});


app.post('/',function(req,res){

  enter.find({},function(err,docs){
    if(err) return console.error(err);
           var t=JSON.stringify(docs);
          res.send(t);

  });

})





app.get('/edit_show',function(req,res){
  enter.find({_id:req.query.id},function (err,docs){
    if(err) return console.error(err);
    var t=JSON.stringify(docs);
    console.log('edit clicked');
    res.send(t);

  });
});




app.get('/delete',function(req,res){
   enter.find({_id:req.query.id}).remove().exec();
   res.send('deleted');

});


/*user Registration*/
app.post('/user-validate',function(req,res){
 
  enter.find({user : req.body.user}, function (err, docs) {
        if (docs.length){
           
            error+="username already exists";
            res.send('alredy-exist');
        }else{
          error="";
            res.send('');
              

           
        }
    });
});

/*User Login*/

app.post('/login',function(req,res){
  enter.find({user:req.body.user,pass:req.body.pass},function (err,docs){
   if(docs.length){
        res.send(JSON.stringify(docs));
   } else {
    res.send('soory');

   }

  });
});



app.post('/log', upload.fields([{name:'file'},{name:'gallery'}]) , function(req, res){
   var file;
   var etc=[];
  //var file='img/'+req.files.file.filename;
  //console.log(req.files.file);
  var m=req.files.file;
  //console.log(m);
  //var o=0;
  /*m.forEach(function(file){
    //console.log(file.filename);

    file="img/"+file.filename;
    console.log(o++);
    //console.log(file);
  });*/

  //console.log(m.file.filename);
  //var data=req.body;
  //console.log(req.body);
  //console.log(req.files);
  //console.log(req.files.file);
  //console.log(req.files.gallery.length);

  m.forEach(function(file){
       etc.push(file.filename);
  });
  //console.log(etc[0]);
  file="img/"+etc[0];



  filler=req.files.gallery;
  var files=[];
   filler.forEach (function(file){
    files.push('img/'+file.filename);
   });
//console.log(files);


  var data=req.body;
  var fname=data.fname;
  var lname=data.lname;
  var  email=data.email;
  var  user=data.user;
  var pass=data.pass;
  var addr=data.addr;

  
    var t=[];
    if(fname==""){
          error+="fname is empty";
    } else {
        msg+="&nbsp;First Name is&nbsp; "+fname;
    }
    if(lname==""){
          error+="lname is empty";
    } else {
        msg+="&nbsp;Last Name is&nbsp; "+lname;
    }
    if(!isEmail(email)){
      error+="email is empty";

    } else {
      msg+="&nbsp;email is&nbsp; "+email;
    }
    if(user==""){
         error+="user value is empty";
    } else {
       msg+=" &nbsp;user is &nbsp; "+user;
    }
    if(pass==""&&pass.length<8){
      error+="password is invalid";

    } else {
      msg+="&nbsp;password is&nbsp; "+pass;

    }
   if(error.length>0){
    res.send('Errors are '+error);
   } else{
    
     var data={};
     data.fname=fname;
     data.lname=lname;
     data.email=email;
     data.pass=pass;
     data.user=user;
     data.file=file;
     data.addr=addr;

      var light=new enter({
        fname:fname,
        lname:lname,
        email:email,
        pass:pass,
        user:user,
        file:file,
        addr:addr,
        files:files
      });
    

      
      light.save(function(err,light){
        if(err) return console.error(err);
       
        
          enter.find({},function(err,light){
        if(err) return console.error(err);
    
       
            var t=JSON.stringify(light);
          res.send(t);
        
      });

       
      });


      


    

   }

     function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }


 

   
});


app.post('/edit', upload.fields([{name:'file'},{name:'gallery'}])  , function(req, res){
    //console.log(req.body); 
    //console.log(req.file);
    var data=req.body;
    

        
  var data=req.body;
  var fname=data.fname;
  var lname=data.lname;
  var  email=data.email;
  var  user=data.user;
  var pass=data.pass;
  var addr=data.addr;
      var t=[];
    if(fname==""){
          error+="fname is empty";
    } else {
        msg+="&nbsp;First Name is&nbsp; "+fname;
    }
    if(lname==""){
          error+="lname is empty";
    } else {
        msg+="&nbsp;Last Name is&nbsp; "+lname;
    }
    if(!isEmail(email)){
      error+="email is empty";

    } else {
      msg+="&nbsp;email is&nbsp; "+email;
    }
    if(user==""){
         error+="user value is empty";
    } else {
       msg+=" &nbsp;user is &nbsp; "+user;
    }
    if(pass==""&&pass.length<8){
      error+="password is invalid";

    } else {
      msg+="&nbsp;password is&nbsp; "+pass;

    }
   if(error.length>0){
    res.send('Errors are '+error);
   } else{
     var obj=req.files;
     //var x=[];
     //x.push(req.files);
     //console.log(x.length);
     console.log(Object.keys(obj).length);
  

           /*obj.forEach(function(data){
            x.push('1');

           })
           console.log(x);*/


          if(Object.keys(req.files).length>0){
            console.log('hello');






       /**/



       
                 var file;  

                 if(req.files.file!=undefined&&req.files.gallery!=undefined){
                   /*on upload both gallery and file*/
                   var file;
                   var etc=[];
                
                    var m=req.files.file;
                  
                  m.forEach(function(file){
                       etc.push(file.filename);
                  });
                
                  file="img/"+etc[0];

                var filler=req.files.gallery;
                  var files=[];
                   filler.forEach (function(file){
                    files.push('img/'+file.filename);
                   });



                enter.update({user:data.user},{
                fname:data.fname,
                lname:data.lname,
                pass:data.pass,
                email:data.email,
                addr:addr,
                file:file,
                files:files
              },function (err,effect,resp){
                if(err)console.log('1');
               

              });   
           





                 } else {
                  if(req.files.file!=undefined){
                    /*on uplooad only file*/


                     var file;
                   var etc=[];
                
                    var m=req.files.file;
                    m.forEach(function(file){
                       etc.push(file.filename);
                  });
                
                  file="img/"+etc[0];
                enter.update({user:data.user},{
                fname:data.fname,
                lname:data.lname,
                pass:data.pass,
                email:data.email,
                addr:addr,
                file:file,
                
              },function (err,effect,resp){
                if(err)console.log('1');
               

              });   
           


                  } else {


                var filler=req.files.gallery;
                  var files=[];
                   filler.forEach (function(file){
                    files.push('img/'+file.filename);
                   });


                enter.update({user:data.user},{
                fname:data.fname,
                lname:data.lname,
                pass:data.pass,
                email:data.email,
                addr:addr,
                files:files,
                
              },function (err,effect,resp){
                if(err)console.log('1');
               

              });   
           

                    /*on upload gallery*/

                  }



                 }


       
/**/
           



    } else {
      console.log('hu');
       
       enter.update({user:data.user},{
          fname:data.fname,
          lname:data.lname,
          pass:data.pass,
          email:data.email,
          addr:data.addr
          
        },function (err,effect,resp){
          if(err)console.log('3');
        
        });






    }
      
    

    

   }

     function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }


  


   
});



app.listen(5000);