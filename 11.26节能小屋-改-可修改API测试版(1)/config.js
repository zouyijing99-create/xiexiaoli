;(function(global){
  var STORAGE_KEYS = { active: 'apiConfig', list: 'apiConfigs', lastValid: 'apiConfig:lastValid' }
  var templates = {
    qianwen: { name: '通义千问', baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1', endpointPath: '/chat/completions', models: ['qwen-flash-2025-07-28','qwen-plus','qwen-max'], defaultModel: 'qwen-flash-2025-07-28' },
    openai: { name: 'OpenAI', baseURL: 'https://api.openai.com/v1', endpointPath: '/chat/completions', models: ['gpt-3.5-turbo','gpt-4','gpt-4-turbo'], defaultModel: 'gpt-3.5-turbo' },
    wenxin: { name: '文心一言', baseURL: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1', endpointPath: '/wenxinworkshop/chat/completions', models: ['ernie-bot','ernie-bot-turbo','ernie-bot-4'], defaultModel: 'ernie-bot' }
  }
  function uid(){ return 'cfg_'+Math.random().toString(36).slice(2,10) }
  function read(key){ try{ return JSON.parse((global.localStorage||{}).getItem(key)||'null') }catch(e){ return null } }
  function write(key,val){ (global.localStorage||{ setItem:function(){} }).setItem(key, JSON.stringify(val)) }
  function getConfigs(){ return Array.isArray(read(STORAGE_KEYS.list)) ? read(STORAGE_KEYS.list) : [] }
  function setConfigs(arr){ write(STORAGE_KEYS.list, arr) }
  function getActiveConfig(){
    var cfg = read(STORAGE_KEYS.active) || null
    
    var def = {
      id: 'default',
      name: '默认配置',
      provider: 'qianwen',
      baseURL: templates.qianwen.baseURL,
      endpoint: templates.qianwen.baseURL + templates.qianwen.endpointPath,
      model: templates.qianwen.defaultModel,
      temperature: 0.7,
      maxTokens: 1024,
      headers: {}
    }
    return def
  }
  function setActiveConfigById(id){ var list=getConfigs(); var cfg=list.find(function(c){return c.id===id}); if(!cfg) return null; write(STORAGE_KEYS.active, cfg); saveLastValid(cfg); notifyChange(cfg); return cfg }
  function saveConfig(cfg){ var list=getConfigs(); var id=cfg.id||uid(); var now=new Date().toISOString(); var merged=Object.assign({ id:id, name:cfg.name||('未命名配置'), timestamp: now }, cfg); var idx=list.findIndex(function(c){return c.id===id}); if(idx>=0){ list[idx]=merged } else { list.push(merged) } setConfigs(list); write(STORAGE_KEYS.active, merged); notifyChange(merged); return merged }
  function deleteConfig(id){ var list=getConfigs().filter(function(c){return c.id!==id}); setConfigs(list); var active=getActiveConfig(); if(active&&active.id===id){ write(STORAGE_KEYS.active, null); notifyChange(null) } }
  function saveLastValid(cfg){ write(STORAGE_KEYS.lastValid, cfg) }
  function getLastValid(){ return read(STORAGE_KEYS.lastValid) || null }
  function notifyChange(cfg){ if(global.dispatchEvent){ global.dispatchEvent(new CustomEvent('apiConfigChanged', { detail: cfg })) } }
  function isValidUrl(u){ try{ var p=new URL(u); return !!p.protocol && !!p.host }catch(e){ return false } }
  async function validateEndpoint(cfg){
    var base = cfg && cfg.baseURL ? cfg.baseURL : (templates[(cfg&&cfg.provider)||'qianwen']||templates.qianwen).baseURL
    var provider = (cfg&&cfg.provider||'qianwen').toLowerCase()
    var tpl = templates[provider] || templates.qianwen
    var endpoint = String(base||'').replace(/\/$/,'') + (tpl.endpointPath||'/chat/completions')
    if(!isValidUrl(endpoint)) return { ok:false, status:0, code:'invalid_url' }
    var headers = Object.assign({}, cfg&&cfg.headers||{})
    if(cfg&&cfg.apiKey){ headers['Authorization']='Bearer '+cfg.apiKey }
    headers['Content-Type']='application/json'
    var body = {}
    if(provider==='openai'){
      body = { model: (cfg&&cfg.model)||tpl.defaultModel, messages:[{role:'user',content:'ping'}], max_tokens: 1, temperature: 0 }
    } else {
      body = { model: (cfg&&cfg.model)||tpl.defaultModel, messages:[{role:'user',content:'ping'}], max_tokens: 1, temperature: 0 }
    }
    try{
      var resp = await fetch(endpoint,{ method:'POST', headers:headers, body:JSON.stringify(body) })
      var ok = resp.status>=200&&resp.status<300
      var authFail = resp.status===401||resp.status===403
      return { ok: ok, status: resp.status, code: ok?'ok':(authFail?'auth_fail':'http_error') }
    } catch(e){
      return { ok:false, status:0, code:'network_error' }
    }
  }
  var api={ templates:templates, getConfigs:getConfigs, saveConfig:saveConfig, deleteConfig:deleteConfig, getActiveConfig:getActiveConfig, setActiveConfigById:setActiveConfigById, saveLastValid:saveLastValid, getLastValid:getLastValid, validateEndpoint:validateEndpoint }
  if(typeof module!=='undefined'&&module.exports){ module.exports=api } else { global.ConfigManager=api }
})(typeof window!=='undefined'?window:global)

