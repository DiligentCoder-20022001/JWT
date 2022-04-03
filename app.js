require('dotenv').config();
require('./config/database').connect();
const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('./model/user');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const app = express();
app.use(express.json());
app.post('/welcome', auth, (req, res) => {
    res.status(200).send("Welcome :))")
})
//controllers logic 
app.post("/register", async(req, res) => {
    //register logic 
    try
    {
        const {first_name, last_name, email, password} = req.body; 
        //validation 
        if(!(email && password && first_name && last_name)){
            res.status(400).send("All input is required");
        }
        //check if user exists already or not 
        const oldUser = await User.findOne({email});
        if(oldUser)
        {
            return res.status(409).send("User already exists, please login");
        }
        //encrypt user password 
        var encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            first_name, 
            last_name, 
            email : email.toLowerCase(),
            password : encryptedPassword
        }); 

        //generate token 
        const token = jwt.sign(
            {user_id : user._id, email},
            process.env.TOKEN_KEY, 
            {
                expiresIn : "2h",
            }
        );

        //save the user token 
        user.token = token;
        res.status(200).json(user);
    }
    catch(err)
    {
        console.log(err);
    }
});
app.post("/login", async (req, res) => {
    //login logic 
    try{
        const {email, password} = req.body; 
        if(!(email && password)){
            res.status(400).send("All inputs are necessary");
        }
        //validate if user exists in the database
        const user = await User.findOne({email}); 
        if(user && (await bcrypt.compare(password, user.password))){
            //create token 
            const token = jwt.sign(
                {user_id: user._id, email}, 
                process.env.TOKEN_KEY, 
                {
                    expiresIn : "2h",
                }
            );
            user.token = token;
            res.status(200).json(user);
        }
        res.status(400).send("Invalid credentials");
    }
    catch(err){
        console.log(err);
    }
});


module.exports = app;   