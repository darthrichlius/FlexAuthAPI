const express=require("express"),helmet=require("helmet");module.exports=e=>{e.use(helmet()),e.use(express.json()),e.use(express.urlencoded({extended:!0}))};
