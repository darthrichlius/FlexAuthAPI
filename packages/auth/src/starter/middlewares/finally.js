const{reqError:reqErrorMiddleware}=require("@app/lib/api/middlewares");module.exports=r=>{r.use(reqErrorMiddleware)};
