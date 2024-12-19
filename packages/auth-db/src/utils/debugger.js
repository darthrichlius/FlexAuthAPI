const{appDebugger}=require("@app/lib/utils"),{APP_DEBUG_PREFIX}=require("../config/env");module.exports={info:appDebugger(`${APP_DEBUG_PREFIX}:info`),error:appDebugger(`${APP_DEBUG_PREFIX}:error`)};
