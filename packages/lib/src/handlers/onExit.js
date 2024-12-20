const winston=require("winston");module.exports=async(n,o)=>{winston.info("Server is shutting down, cleaning up..."),await o(),winston.info(`Goodbye with code: ${n}`)};
