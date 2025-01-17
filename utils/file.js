const fs=require("fs");

exports.deleteFile=(filePath)=>{
//basically it will delete the file from the file system
  fs.unlink(filePath,(error)=>{
    if(error){
      throw error;
    }
  });
};