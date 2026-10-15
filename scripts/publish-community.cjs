// Explicit local team operation. This does not deploy the site.
const fs=require('node:fs');const {validate}=require('../lib/community-publication.cjs');
const input=process.argv[2];if(!input)throw Error('Usage: node scripts/publish-community.cjs <reviewed-posts.json>');
const posts=JSON.parse(fs.readFileSync(input));if(!Array.isArray(posts)||posts.length>100)throw Error('Expected up to 100 reviewed posts');
const approved=posts.map(p=>validate(p));if(new Set(approved.map(p=>p.id)).size!==approved.length)throw Error('Duplicate post identifiers');
fs.writeFileSync('dist/community-data.js',"'use strict';\nwindow.LiftCommunityPosts="+JSON.stringify(approved).replace(/</g,'\\u003c')+';\n');
console.log('Prepared '+approved.length+' reviewed posts. No deployment or messages sent.');
