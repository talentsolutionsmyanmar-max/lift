(function (root) {
  'use strict';
  const dates = root.LiftDates || (typeof require === 'function' ? require('./dates.js') : null);
  const family = root.LiftFamily || (typeof require === 'function' ? require('./family.js') : null);
  const planKeys = ['work', 'skills', 'support', 'stability', 'assets'];
  const text = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
  const indices = (values, limit) => Array.isArray(values) ? [...new Set(values.filter(n => Number.isInteger(n) && n >= 0 && n < limit))] : [];
  function empty() { return {family:{topics:['start'],ready:[]},dates:[],version:2,plan:null,checked:[],remember:false,goal:'',history:[],edits:{},custom:[],prep:[]}; }
  function normalize(value) {
    const result = empty();
    if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
    result.remember = value.remember === true;
    result.dates = dates.normalize(value.dates);
    result.family = family.normalize(value.family);
    result.plan = planKeys.includes(value.plan) ? value.plan : null;
    result.prep = indices(value.prep,6);
    result.history = Array.isArray(value.history) ? value.history.slice(0,20).filter(x => x && planKeys.includes(x.plan) && typeof x.changedAt === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(x.changedAt) && Number.isFinite(Date.parse(x.changedAt))).map(x => ({goal:text(x.goal,100),plan:x.plan,changedAt:new Date(x.changedAt).toISOString(),done:Math.max(0,Math.min(10,Number.isInteger(x.done)?x.done:0)),total:Math.max(4,Math.min(10,Number.isInteger(x.total)?x.total:4))})).map(x=>({...x,done:Math.min(x.done,x.total)})) : [];
    if (!result.plan) return result;
    result.goal = text(value.goal,100);
    result.custom = Array.isArray(value.custom) ? value.custom.slice(0,6).filter(x => x && typeof x === 'object' && text(x.title,120)).map(x => ({title:text(x.title,120),detail:text(x.detail,240)})) : [];
    result.checked = indices(value.checked,4+result.custom.length);
    if (value.edits && typeof value.edits === 'object') for (let i=0;i<4;i++) {
      const edit = value.edits[i];
      if(edit && typeof edit === 'object' && text(edit.title,120)) result.edits[i] = {title:text(edit.title,120),detail:text(edit.detail,240)};
    }
    return result;
  }
  function tasks(state,defaults) {
    return defaults.map(([title,detail],i) => state.edits[i] || {title,detail}).concat(state.custom);
  }
  function archiveGoal(state,now=new Date().toISOString()) {
    if(!state.plan||(!state.goal&&!state.checked.length))return [...(state.history||[])];
    return [{goal:state.goal,plan:state.plan,changedAt:now,done:state.checked.length,total:4+state.custom.length},...(state.history||[])].slice(0,20);
  }
  function setGoal(state,value) {
    const goal=text(value,100);
    if(goal===state.goal)return state;
    return {...state,goal,history:archiveGoal(state)};
  }
  function changePlan(state,key) {
    if (!planKeys.includes(key) || state.plan===key) return state;
    return {...empty(),dates:dates.normalize(state.dates),family:family.normalize(state.family),plan:key,remember:state.remember,prep:[...state.prep],history:archiveGoal(state)};
  }
  function removeCustom(state,index) {
    if (!Number.isInteger(index) || index<4 || index>=4+state.custom.length) return state;
    return {...state,custom:state.custom.filter((_,i)=>i!==index-4),checked:state.checked.filter(i=>i!==index).map(i=>i>index?i-1:i)};
  }
  const api = {empty,normalize,tasks,changePlan,setGoal,archiveGoal,removeCustom,indices,text};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LiftPlanner = api;
})(typeof window !== 'undefined' ? window : globalThis);
