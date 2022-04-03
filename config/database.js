const mongoose = require('mongoose'); // exporting mongoose package 
const {MONGO_URI} = process.env;

//exporting the function for connection to the database
exports.connect = () => {
    //connecting to database 
    mongoose.connect(MONGO_URI, {
        useNewUrlParser : true, 
        useUnifiedTopology: true, 
    })
    .then(() => {
        console.log("Successfully connected to the database")
    })
    .catch((err) => {
        console.log("Failed to connect!!");
        console.log(err);
        process.exit(1);
    });
};