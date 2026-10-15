'use strict';
const blob=require('@vercel/blob');
function makeStore(sdk=blob){
 async function read(path){let result;try{result=await sdk.get(path,{access:'private',useCache:false});}catch(error){if(error instanceof sdk.BlobNotFoundError)return null;throw error;}
  if(!result)return null;if(result.statusCode!==200||result.blob.size>16000||!result.blob.etag||!String(result.blob.contentType).startsWith('application/json'))throw Error('Invalid storage response');
  const text=await new Response(result.stream).text();if(Buffer.byteLength(text)>16000)throw Error('Stored record too large');return {value:JSON.parse(text),etag:result.blob.etag};
 }
 const options={access:'private',addRandomSuffix:false,contentType:'application/json',cacheControlMaxAge:60};
 async function create(path,value){await sdk.put(path,JSON.stringify(value),{...options,allowOverwrite:false});}
 async function replace(path,value,etag){try{await sdk.put(path,JSON.stringify(value),{...options,allowOverwrite:true,ifMatch:etag});}catch(error){if(error instanceof sdk.BlobPreconditionFailedError)throw Object.assign(Error('Concurrent change'),{code:'CONFLICT'});throw error;}}
 async function remove(path,etag){try{await sdk.del(path,{ifMatch:etag});}catch(error){if(error instanceof sdk.BlobPreconditionFailedError)throw Object.assign(Error('Concurrent change'),{code:'CONFLICT'});throw error;}}
 return {read,create,replace,remove};
}
module.exports={makeStore};
