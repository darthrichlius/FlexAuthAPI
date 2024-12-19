const winston=require("winston");module.exports=e=>{console.error("UncaughtException: check log for further details"),winston.error(e.message,e),process.exit(1)};
