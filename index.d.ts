declare module "lamcfg" {
  
  class Settings {
    /**
     * The prefix to use for all variables in this environment.
     */
    envPrefix:string;
    /**
     * Default configurations to use when no environment override exists.
     */
    defaults:any;
  }

  class Config{
    constructor(settings?:Settings);
    /**
     * Locates the configuration in the environment.
     * 
     * @param name 
     * @param inlineDefault 
     */
    get(name:string,inlineDefault:any):any;

    /**
     * Updates the defaults for this environment.
     * 
     * @param defaults 
     */
    update(defaults:any):void;

    /**
     * Creates a configuration instance from a child block of configurations
     *  defined in the environment.
     * @param name 
     */
    childOf(name:string):Config;
  }
}