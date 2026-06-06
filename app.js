const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

const path = require("path");

const userSchema = require("./models/user")

const bcrypt = require ("bcrypt");

const jwt = require("jsonwebtoken");

app.use(express.json());
app.set('view engine','ejs');
app.use(express.urlencoded({extended :true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser())


app.get('/',(req,res)=>


{
    res.render('index');
    
})
app.post('/create',  (req,res)=>
{  
    
    
    let{username,email,password,age}=req.body;


             bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(password, salt, async function(err, hash) {

                  let createdUser= await userSchema.create(
        {
            username,
            email,
            password:hash,
            age
        }
    )

    let token = jwt.sign({email},"secret");
    res.cookie('token',token);
    res.send(createdUser);
    
              
             });
                 });
  
})


app.get('/logout',(req,res)=>
{
        res.cookie('token',"");
        res.redirect("/");
});

app.get('/login',(req,res)=>
{
 res.render('login');
})

app.post('/login',async(req,res)=>{
   let user = await userSchema.findOne({email:req.body.email});

   if (!user)
   {
    return res.send("Email or password is incorrect");
   }
  bcrypt.compare(req.body.password, user.password, function(err, result) {
        
    if(result)
        {    
            let token = jwt.sign({email:user.email},"secret");
            res.cookie("token",token);                  
            res.send("You are logged in");
        }
    else return res.send("Email or passeord is incorrect");
   
});
});

app.listen(3000,()=>
{
    console.log("Server is running on port 3000");
})