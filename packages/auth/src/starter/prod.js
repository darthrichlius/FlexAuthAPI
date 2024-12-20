const http=require("http"),appDebugger=require("../utils/debugger");module.exports=e=>{const r=http.createServer(e);return appDebugger.info("HTTP server created..."),r};
