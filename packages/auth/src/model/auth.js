const Joi=require("joi"),{userSchema}=require("./user");module.exports={loginSchema:Joi.object({username:userSchema.email.required(),password:userSchema.password.required()})};
