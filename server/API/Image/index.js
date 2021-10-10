import express from "express";
import AWS from "aws-sdk";
import multer from "multer";
import {ImageModel} from "../../database/allModels";
import {s3Upload} from "../../Utils/AWS/s3";
const Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage});

const s3Bucket = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    region: "ap-south-1"
});



/*
Route            /
Des              Uploading given image to S3 bucket , and then saving the file to mongodb
Params           None
Access           Public
Method           POST
*/
Router.post("/", upload.single("file") ,async(req,res)=> {
    try {
   const file = req.file;
  
   //S3 bucket options
   const bucketOptions = {
     Bucket: "zomato02",
     Key: file.originalname,
     Body: file.buffer,
     ContentType: file.mimetype,
     ACL: "public-read"
   };


   const uploadImage = await s3Upload(bucketOptions);
  
   return res.status(200).json({ uploadImage });
  
    } catch (error) {
  return res.status(500).json({error: error.message});
    }
  });
  



export default Router;