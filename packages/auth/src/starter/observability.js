const Sentry=require("@sentry/node");module.exports=r=>{Sentry.setupExpressErrorHandler(r),r.get("/__test__/debug-sentry",function(t,n){throw new Error("My first Sentry error!")})};
