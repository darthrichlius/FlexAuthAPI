const{api:apiRouter,auth:authRouter,user:userRouter}=require("../routes");module.exports=u=>{u.use("/api/auth",authRouter),u.use("/api/users",userRouter),u.use("/api",apiRouter)};
