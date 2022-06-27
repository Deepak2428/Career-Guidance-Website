const express=require("express");
const bodyParser=require("body-parser");
const path=require('path');
const app=express();
const mysql=require("mysql");
const nodemailer=require("nodemailer");
const session=require('express-session');

var signupstatus="";
var signinstatus="";

app.set("view engine","ejs");

app.use(session({secret:'session'}));

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(request,response)
{
    console.log(request.session.email);
    response.render('index.ejs',{username:request.session.email});
})

app.get("/11.ejs",function(request,response)
{
    response.render('11.ejs',{username:request.session.email});
})

app.get("/college.ejs",function(request,response)
{
    response.render('college.ejs',{username:request.session.email});
})

app.get("/login.ejs",function(request,response)
{
    response.render("login",{status:signupstatus,loginstatus:signinstatus});
})

app.get("/index.ejs",function(request,response)
{
    console.log(request.session.email);
    response.render('index.ejs',{username:request.session.email});
})


app.post("/login",function(request,response)
{
    var username=request.body.username;
    var password=request.body.password;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Carrer-guidance"
      });
    
    con.connect(function(err) {
        if (err) throw err;
    console.log("Connected!");
    var sql="SELECT * FROM `sign_up` WHERE Email='"+username+"'";
    con.query(sql,function(error,result,feild)
    {
        if(error)
            throw error;
        console.log(result);
        if(result.length==0)
        {
            signinstatus="nouser";
            response.redirect("/login.ejs");
        }
        else if(result[0].Password!=password)
        {
            signinstatus="wrongpass";
            response.redirect("/login.ejs");
        }
        else
        {
            response.redirect("/");
        }
    })

    });
    request.session.email=request.body.username;

})

app.post("/forgotPass",function(req,res)
{
    var username=req.body.recovery_username;
    console.log(username);

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Carrer-guidance"
      });
    
    con.connect(function(err) {
        if (err) throw err;
    var sql="SELECT * FROM `sign_up` WHERE Email='"+username+"'";
    con.query(sql,function(error,result,feild)
    {
        if(error)
            throw error;
        console.log(result);
        if(result.length==0)
        {
            signinstatus="nouser";
            res.redirect("/login.ejs");
        }
        else
        {
            signinstatus="recover";
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                host: "smtp.gmail.com",
                auth: {
                  user: 'shubham.godiyal2001@gmail.com',
                  pass: 'Freestyle_f2k'
                }
              });
              var mailOptions = {
                from: 'shubham.godiyal2001@gmail.com',
                to: username,
                subject: 'Password recovery',
                text: 'Hi, your login Password is '+result[0].Password+'.'
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            res.redirect("/login.ejs");
        }
    })

})
})

app.post("/signup",function(request,response)
{
    var fname=request.body.fname;
    var lname=request.body.lname;
    var email=request.body.email;
    var number=request.body.number;
    var regpassword=request.body.regpassword;
    var confirm_password=request.body.confirmpassword;

    if(regpassword!=confirm_password)
    {
            signupstatus="wrongPass";
            response.redirect("/login.ejs");
    }

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Carrer-guidance"
      });
    
    con.connect(function(err) {
    
    if (err) throw err;
    console.log("Connected!");
    var sql="SELECT * FROM `sign_up` WHERE Email='"+email+"'";
    con.query(sql,function(error,result,feild)
    {
        if(error)
            throw error;
        console.log(result);
        if(result.length==1)
        {
            signupstatus="alreadyexists";
            response.redirect("/login.ejs");
        }
        else if(result.length==0)
        {
            signupstatus="success";
            sql="INSERT INTO `sign_up` (`First_Name`, `Last_Name`, `Email`, `Contact`, `Password`, `Re-Password`) VALUES ('"+fname+"', '"+lname+"', '"+email+"', '"+number+"', '"+regpassword+"', '"+confirm_password+"');"
            con.query(sql,function(error,result)
            {
                if(error) throw error;
            });
            response.redirect("/login.ejs");
        }
    })
    });
})

app.get("/logout",function(request,response)
{
    request.session.destroy();
    response.redirect("/index.ejs");
})

app.listen(3000,function()
{
    console.log("server started at 3000");
})