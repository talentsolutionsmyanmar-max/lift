'use strict';
const {capabilities}=require('../lib/community-availability.cjs');
function makeHandler({env=()=>process.env}={}){return (req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({ok:false});}
 return res.status(200).json(capabilities(env()));
};}
module.exports=makeHandler();module.exports.makeHandler=makeHandler;
