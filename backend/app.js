//======= declaring the module and packages 
const express=require('express');
const app=express();
const cors=require('cors');
const helmet=require('helmet');
const morgan=require('morgan');
const dotenv=require('dotenv');
dotenv.config({path:'./Config/conf.env'});

//############### declaring the differents principales middlewares
//==== track request time
const requestTime= (req,res,next)=>{
   req.requestTime=new Date();
   next();
}

//====== the middlewares 
app.use(cors());
app.use(helmet());
app.use(requestTime);

//=========== gerer les modes de developemenet
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}


//======== for routers


//======= exporting my app 
module.exports= app;