const assert = require('assert')
global.localStorage = (function(){
  const store = {}
  return {
    getItem: (k)=> store[k] || null,
    setItem: (k,v)=> { store[k]=v },
    removeItem: (k)=> { delete store[k] }
  }
})()
const Config = require('../config.js')
const a = Config.saveConfig({ name:'通义默认', provider:'qianwen', apiKey:'k1', baseURL: Config.templates.qianwen.baseURL, model: Config.templates.qianwen.defaultModel, temperature:0.7, maxTokens:2000 })
assert.ok(a && a.id)
const b = Config.saveConfig({ name:'OpenAI课堂', provider:'openai', apiKey:'k2', baseURL: Config.templates.openai.baseURL, model:'gpt-3.5-turbo', temperature:0.3, maxTokens:512 })
assert.ok(b && b.id && b.id!==a.id)
const list = Config.getConfigs()
assert.ok(Array.isArray(list) && list.length===2)
const active = Config.getActiveConfig()
assert.ok(active && active.id===b.id)
Config.setActiveConfigById(a.id)
const active2 = Config.getActiveConfig()
assert.ok(active2 && active2.id===a.id)
Config.saveLastValid(active2)
const last = Config.getLastValid()
assert.ok(last && last.id===a.id)
console.log('apiConfig.test passed')
