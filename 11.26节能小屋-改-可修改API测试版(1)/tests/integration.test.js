const assert = require('assert')
global.localStorage = (function(){
  const store = {}
  return {
    getItem: (k)=> store[k] || null,
    setItem: (k,v)=> { store[k]=v },
    removeItem: (k)=> { delete store[k] }
  }
})()
let dispatched = null
global.CustomEvent = function(name, init){ return { type:name, detail: init && init.detail } }
global.dispatchEvent = function(evt){ dispatched = evt }
const Config = require('../config.js')
const cfg = Config.saveConfig({ name:'测试配置', provider:'openai', apiKey:'key', baseURL: Config.templates.openai.baseURL, model:'gpt-3.5-turbo', temperature:0.5, maxTokens:256 })
assert.ok(dispatched && dispatched.type==='apiConfigChanged')
assert.ok(dispatched.detail && dispatched.detail.id===cfg.id)
console.log('integration.test passed')
