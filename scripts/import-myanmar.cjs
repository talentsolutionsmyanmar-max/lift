// Import reviewed DATA only; never execute a response from another chat.
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const file=process.argv[2];if(!file)throw Error('Pass a reviewed JSON file.');
const input=JSON.parse(fs.readFileSync(file,'utf8'));
const inventory=JSON.parse(fs.readFileSync(path.join(root,'docs/english-copy-inventory.json'),'utf8'));
const output={};
for(const key of inventory){
 const value=Object.prototype.hasOwnProperty.call(input,key)?input[key]:undefined;
 if(typeof value!=='string'||!value.trim()||/[<>]/.test(value))throw Error('Invalid or missing text: '+key);
 if(JSON.stringify((key.match(/\{\w+\}/g)||[]).sort())!==JSON.stringify((value.match(/\{\w+\}/g)||[]).sort()))throw Error('Placeholder mismatch: '+key);
 output[key]=value;
}
fs.writeFileSync(path.join(root,'dist/myanmar.js'),'/* CCO-reviewed static wording; provenance: docs/cco-review-provenance.json. */\nwindow.LiftMyanmar='+JSON.stringify(output,null,2)+';\n');
console.log('Imported '+Object.keys(output).length+' reviewed entries.');
