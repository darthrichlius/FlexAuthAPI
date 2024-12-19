const winston=require("winston");module.exports=(e,n,s,r)=>{winston.error(e.message,e),s.status(500).send("Unexpected error")};
