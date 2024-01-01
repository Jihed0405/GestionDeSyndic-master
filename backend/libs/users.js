const path = require('path')
const multer= require('multer');

let storage = multer.diskStorage({
    destination:function(res,file,cb) {
    cb(null,'users/avatars')
    },
    filename:function(res,file,cb) {
        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname))
    }

} );
const userUpload = multer({storage:storage}).single("avatar")
module.exports =userUpload;