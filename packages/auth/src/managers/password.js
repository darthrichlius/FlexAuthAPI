const bcrypt=require("bcryptjs"),verify=async(...a)=>await bcrypt.compare(...a),hash=async(a,t=10)=>{const s=await bcrypt.genSalt(t);return await bcrypt.hash(a,s)};module.exports={hash,verify};
