'use strict';
function communityWallLabel(key){return window.LiftCommunityWallCopy[LiftI18n.locale==='my'?'my':'en'][key];}
const communityWallBasePage=communityPage;
communityPage=function(){let html=communityWallBasePage();if(communityPreview){const external=communityWallLabel('external');html=html.replace('<div class="community-actions">','<div class="community-actions"><details class="community-external"><summary>'+escapeText(external)+'</summary><p>'+escapeText(communityWallLabel('externalHelp'))+'</p>');html=html.replace('<button type="button" class="text-button" data-community-action="edit">','</details><button type="button" class="text-button" data-community-action="edit">');html=html.replace('<p>'+communityLabel('shareHelp')+'</p>','<p>'+escapeText(communityWallLabel('sendHelp'))+'</p>');}return html;};
// Private everyday checklists use their existing external copy/download/share flow.
// Community composition starts explicitly on #community.
