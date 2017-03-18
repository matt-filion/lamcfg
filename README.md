# lamcfg
Bereft and easy configuration management for NodeJS projects on AWS Lambda via Serverless.

## Summary
The idea is to provide a quick wrapper around configurations to make them easily consumed in AWS Lambda functions, while also providing an easy way to make code testable. If the configuration is provided as an argument to the class that needs it then values can be easily fed into your unit tests via configuration defaults.

The secondary objective is to keep the code footprint small and have no reliance on outside libraries, since these quickly blow up the code footprint.

## Value Heirarchy
There are 3 points you can provide a configuration, inline as a second argument to getting the value, as 'defaults' to the configuration instance and as process.env values. The value is selected based on the first value found.
1. process.env, if there is a value here it is used.
2. configuration defaults, if there is a value found here it is used.
3. inline defaults, this is the last place looked and the value is used if it is found.

## process.env
You can specify an envPrefix value if you want to keep your configurations 'separate' from other process.env values. Its a primitive method to help avoid name collissions but should work in most scenarios.

# Config Defaults with process.env
This assumes you have a central file or configuration source, as is usually needed in larger applications where the value is used in multiple places. This module does not provide you a method for storing and retreiving the configuration. If you would like this feature please request it at https://github.com/matt-filion/lamcfg/issues. 
```|JavaScript
process.env['MYCFG_dot_notation_to_value'] = "Override Inline Default";

const Config = require('lamcfg');
const config = new Config({envPrefix:'MYCFG_',defaults:{dot:{notation:{to:{value:'DefaultValue'}}}}});

function MyObject(config){
  /*
   * Assuming the value is not overriden by a process.env value, then the value specified
   *  in defaults will be used.
   */
  config.get("dot.notation.to.value");
}

```

# Inline and process.env
This strategy aimes at providing you two points of configuration, and is appropriate for small and quick applications. Inline at the point of needing the configuration and then overriding using process.env variables. On AWS Lambda this will be in the form of environment variables, see http://docs.aws.amazon.com/lambda/latest/dg/env_variables.html.

```|JavaScript
process.env['dot_notation_to_value'] = "Override Inline Default";

const Config = require('lamcfg');
const config = new Config();

function MyObject(config){
  /*
   * Assumin the value is not overriden by a process.env value, then the inline value
   *  will be used.
   */
  config.get("dot.notation.to.value","inlineDefault");
}

```