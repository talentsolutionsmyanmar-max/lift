'use strict';
function capabilities(config){
 const receiptsOpen=typeof config?.COMMUNITY_RECEIPT_SECRET==='string'&&config.COMMUNITY_RECEIPT_SECRET.length>=32;
 return {submissionsOpen:receiptsOpen&&config.COMMUNITY_INTAKE_ENABLED==='true'&&config.COMMUNITY_REVIEW_READY==='v1',receiptsOpen};
}
function allowed(config,action){const c=capabilities(config);return action==='submit'?c.submissionsOpen:['status','withdraw'].includes(action)&&c.receiptsOpen;}
module.exports={capabilities,allowed};
