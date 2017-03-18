'use strict';

module.exports = function(_config){

  const config   = _config ? _config : {};
  const prefix   = config.envPrefix ? config.envPrefix : '';
  const defaults = config.defaults && Object.keys(config.defaults).length !== 0 ? config.defaults : null;

  const lookForValue = (path,parent) => parent ? path.split('.').reduce( (accumulator,name) => accumulator[name],parent) : null;
  const lookInEnv    = (name) => process.env[`${prefix}${name.replace(/([^a-zA-Z0-9_])/g,'_')}`];

  return {
    get: (name,inlineDefault) => lookInEnv(name) || lookForValue(name,defaults) || inlineDefault,
    update: configs => Object.assign(defaults || {}, configs)
  }
}