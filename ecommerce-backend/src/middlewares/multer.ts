import multer from 'multer';

const storage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, "uploads/");
    },
    filename: function (req, file, callback) {
            console.log("filessss", file);
            // return;    // if want to change the name of file uncomment below code
            // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            // let myfilename = Date.now() + file.fieldname + "-" + file.originalname;
            // req.body.myfilename = myfilename;
            callback(null, file.originalname);
    },
});



export const singleupload = multer({storage}).single("photo");