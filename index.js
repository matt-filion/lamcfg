'use strict';

module.exports = function(_config){

  const config   = _config ? _config : {};
  const prefix   = config.envPrefix ? config.envPrefix : '';
  const defaults = config.defaults && Object.keys(config.defaults).length !== 0 ? config.defaults : null;

  const isObject     = value => typeof value === 'object';
  const lookForValue = (path,parent) => parent ? path.split('.').reduce( (accumulator,name) => accumulator[name], parent) : null;
  const lookInEnv    = name => process.env[`${prefix}${name.replace(/([^a-zA-Z0-9_])/g,'_')}`];
  const get          = (name,inlineDefault) => lookInEnv(name) || lookForValue(name,defaults) || inlineDefault;
  const deepCopy     = (target,source) => Object.keys(source).forEach( key => target[key] && typeof target[key] === 'object' ? deepCopy(target[key],source[key]) : target[key] = source[key] )
  const objectValues = (name,value) => {
    if(isObject(value)){
      Object.keys(value).forEach( key => {
        if(isObject(value[key])){
          value = overrides(`${name}.${key}`,value[key]);
        } else {
          value[key] = lookInEnv(`${name}.${key}`) || value[key] 
        }
      })
    }
    return value;
  };

  return {
    get: (name,inlineDefault) => objectValues( name, get(name,inlineDefault) ),
    update: configs => deepCopy(defaults || {}, configs)
  }
}