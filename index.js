const { application } = require("express");
const express = require("express");
// const router = express.Router();
const cloudinary = require("cloudinary").v2;
require('./utils/cloudinary')
const fs = require("fs")
const multer = require("multer")
const streamifier = require('streamifier')
const storage = multer.memoryStorage();
const uploads = multer({storage});

const app = express();
app.use(express.json());

app.post("/resize", uploads.single("image"), async(req, res)=>{
    console.log("File", req.file);
    res.send("Image Received successfully")

    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result.url);
    }
    upload(req);
    console.log("File Uploaded successfully");
} )


app.listen(6000, ()=>{
    console.log("Server Started on port no 6000");
})