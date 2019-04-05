
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
var multer = require('multer');

// Header Background
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './dist/assets/images/uploads/HeaderBg')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
});
var upload = multer({storage: storage});

var addImageToDB = function(image, type){
    var jsonimagesdb = fs.readFileSync("./dist/assets/images/imagesDB.json");
    var parsedImageDB = JSON.parse(jsonimagesdb);
    var imagesArrays = parsedImageDB.imagesDB;
    let kidsarray = imagesArrays[0];
    let headerlogoarray = imagesArrays[1];
    let mainbgarray = imagesArrays[2];
    let playerbgarray = imagesArrays[3];
    let footerchannelarray = imagesArrays[4];
    let newobject = '{"name":"newImage","image":"'
    if(type === 'HeaderBackground'){
        newobject += image +'","url":"http://switchmagic.com:4113/images/HeaderBg/' + image +'"}'
        kidsarray.push(JSON.parse(newobject));
    }
    else if(type === 'HeaderLogo'){
        newobject += image +'","url":"http://switchmagic.com:4113/images/HeaderLogo/' + image +'"}'
        headerlogoarray.push(JSON.parse(newobject));
    }
    let newImagesObject = {imagesDB:[kidsarray,headerlogoarray,mainbgarray,playerbgarray,footerchannelarray]};
    fs.writeFile( "./dist/assets/images/imagesDB.json", JSON.stringify(newImagesObject), "utf8");

}
router.post('/imageupload/HeaderBackground', upload.single('image'),  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    addImageToDB(req.file.originalname,req.body.type);
     res.send({ message: 'File Saved!', thereq: req.file });
});

module.exports = router;


/* GET api listing. */
// router.get('/', (req, res) => {
//     res.send('api works');
// });

// router.post('/files', (req, res) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.send({ message: 'File Saved!' });
// });

// router.post('/updateelement',  (req, res) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     let newElementsObject = {pageElements:req.body.pageElements};
//     fs.writeFile( "./dist/assets/elements/elements.json", JSON.stringify(newElementsObject), "utf8");
//     res.send(newElementsObject.pageElements);
// });