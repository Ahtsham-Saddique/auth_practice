const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

const path = require("path");

const userSchema = require("./models/user")

const bcrypt = require ("bcrypt");

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
    res.send(createdUser);
    
              
             });
                 });
  
})
app.listen(3000,()=>
{
    console.log("Server is running on port 3000");
})