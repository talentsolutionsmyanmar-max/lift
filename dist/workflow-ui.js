'use strict';
function workflowText(key){return window.LiftWorkflowCopy[LiftI18n.locale==='my'?'my':'en'][key];}
// Canonical tools remain on their own routes; group pages contain links only.
function workflowLinks(items){return `<div class="companion-secondary">${items.map(([path,symbol,label])=>`<a href="#${path}">${icon(symbol)}<span>${escapeText(label)}</span>${icon('arrow')}</a>`).join('')}</div>`;}
function lifePage(){return heading('One thing at a time','Everyday life','')+workflowLinks([['daily','people',everydayLabel('title')],['spending','money',spendingLabel('title')],['dates','steps',dateLabel('open')],['language','globe',phaseOneTools.title],['prepare','people',LiftI18n.t('Prepare a conversation')],['resources','book',LiftI18n.t('Useful information')]]);}
function minePage(){return heading('One thing at a time',workflowText('navMine'),workflowText('mineIntro'))+workflowLinks([['steps','steps',LiftI18n.t('My next steps')],['receipts','lock',LiftCommunityIntakeCopy[LiftI18n.locale==='my'?'my':'en'].check],['privacy','shield',LiftI18n.t('My privacy')]]);}
function workflowNavigation(){for(const nav of document.querySelectorAll('.nav-list,.mobile-nav')){const mobile=nav.classList.contains('mobile-nav');nav.innerHTML=LiftWorkflow.navigation.map(item=>`<a href="#${item.route}" data-route="${item.route}" ${mobile?'':'class="nav-link"'}><span data-icon="${item.icon}"></span><span>${escapeText(workflowText(item.copy))}</span>${!mobile&&item.route==='mine'?'<span class="nav-count" id="nav-count">0</span>':''}</a>`).join('');}}
const workflowBaseRoute=route;
route=function(){workflowBaseRoute();workflowNavigation();document.getElementById('nav-count').textContent=state.plan?String(totalTasks()-progress()):'0';paintIcons();const group=LiftWorkflow.group(document.body.dataset.route);for(const el of document.querySelectorAll('[data-route]')){const active=el.dataset.route===group;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');}};
workflowNavigation();route();
// Reserve the actual wrapped navigation height, including enlarged Myanmar text.
function reserveWorkflowNavigation(){const nav=document.querySelector('.mobile-nav');if(nav)document.documentElement.style.setProperty('--workflow-nav-space',Math.ceil(nav.getBoundingClientRect().height+24)+'px');}
if(typeof ResizeObserver!=='undefined'){const workflowNavObserver=new ResizeObserver(reserveWorkflowNavigation);const workflowNav=document.querySelector('.mobile-nav');if(workflowNav)workflowNavObserver.observe(workflowNav);}
reserveWorkflowNavigation();
