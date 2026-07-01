//========== importing modules or packages
const app=require('./app');
const dotenv=require('dotenv');
dotenv.config({path:'./Config/conf.env'});
const connectDB = require("./Config/db");

//========declaring our variables 
const port=process.env.PORT;

//==== starting DB
connectDB();

//===== starting our server
app.listen(port,()=>{
    console.log(' \n App is running on http://127.0.0.1:'+port +'\n');  
})