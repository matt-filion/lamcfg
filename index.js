'use strict';

class Config {

  constructor(_config) {
    this.config           = _config ? _config : {};
    this.config.envPrefix = this.config.envPrefix ||  '';
    this.config.defaults  = this.config.defaults && Object.keys(this.config.defaults).length !== 0 ? this.config.defaults : {}
  }

  get(name,inlineDefault){
    const lookForValue = path => path.split('.').reduce( (accumulator,name) => accumulator ? accumulator[name] : null, defaults);
    const lookInEnv    = name => process.env[`${prefix}${name.replace(/([^a-zA-Z0-9_])/g,'_')}`];
    const exists       = value => value !== undefined && value !== null;
    const get          = (name,inlineDefault) => {
      let value = lookInEnv(name)
      if(!exists(value)) value = lookForValue(name)
      if(!exists(value)) value = inlineDefault
      return value;
    };
    const isObject       = value => typeof value === 'object';
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
    return objEnvOverride( name, get(name,inlineDefault) );
  }

  update(source){
    Object.keys(source).forEach( key => this.config.defaults[key] && typeof this.config.defaults[key] === 'object' ? deepCopy(this.config.defaults[key],source[key]) : this.config.defaults[key] = source[key] );
  }

  child(name) {
    return new Config({envPrefix:`${this.config.prefix}${this.config.prefix ? '_' : ''}${name}`,defaults:this.get(name) });
  }
}

module.exports = Config;