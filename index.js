'use strict';

function Config(_config){

  const config   = _config ? _config : {};
  const prefix   = config.envPrefix ? config.envPrefix : '';
  const defaults = config.defaults && Object.keys(config.defaults).length !== 0 ? config.defaults : {};

  const exists       = value => value !== undefined && value !== null;
  const isObject     = value => typeof value === 'object';
  const lookForValue = path => path.split('.').reduce( (accumulator,name) => accumulator ? accumulator[name] : {}, defaults);
  const lookInEnv    = name => process.env[`${prefix}${name.replace(/([^a-zA-Z0-9_])/g,'_')}`];
  const get          = (name,inlineDefault) => {
    let value = lookInEnv(name)
    if(!exists(value)) value = lookForValue(name)
    if(!exists(value)) value = inlineDefault
    return value;
  };
  const deepCopy       = (target,source) => Object.keys(source).forEach( key => target[key] && typeof target[key] === 'object' ? deepCopy(target[key],source[key]) : target[key] = source[key] );
  const objEnvOverride = (name,value) => {
    if(isObject(value)){
      Object.keys(value).forEach( key => {
        if(isObject(value[key])){
          objEnvOverride(`${name}.${key}`,value[key]);
        } else {
          value[key] = lookInEnv(`${name}.${key}`) || value[key] 
        }
      })
    }
    return value;
  };

  const instance = {
    get: (name,inlineDefault) => objEnvOverride( name, get(name,inlineDefault) ),
    update: configs => deepCopy(defaults, configs),
    childOf: name => new Config({envPrefix:`${prefix}${prefix ? '_' : ''}${name}`,defaults:instance.get(name) })
  }

  return instance;
}

module.exports = Config;