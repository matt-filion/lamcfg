'use strict';

const chai           = require('chai');
const Config         = require('../index.js');
const expect         = chai.expect;

describe('Configuration', () => {

  describe('#new()', () => {
    it('Base Configuration Object', () =>
      expect(new Config()).to.have.all.keys(['get','update'])
    );
  });
  describe('#get()', () => {
    
    it('Get Inline Value', () => {
      const config = new Config();
      return expect(config.get('name','InlineDefault')).to.equal('InlineDefault')
    });

    it('Get Default Configuration Value', () => {
      const config = new Config({defaults:{name:'ObjectDefault'}});
      return expect(config.get('name','InlineDefault')).to.equal('ObjectDefault')
    });

    it('Get Default Configuration Value', () => {
      const config = new Config({defaults:{name:'ObjectDefault'}});
      return expect(config.get('name','InlineDefault')).to.equal('ObjectDefault')
    });

    it('Get Configuration Dot Notation Value after Updating', () => {
      const config = new Config({defaults:{name:{first:'ObjectDefault'}}});
      config.update({name:{first:'ObjectDefaultSecond'}})
      return expect(config.get('name.first','InlineDefault')).to.equal('ObjectDefaultSecond')
    });

    it('Get Environment Value', () => {
      const config = new Config({name:'ObjectDefault'});
      process.env.name = 'ProcessOverride';
      expect(config.get('name','InlineDefault')).to.equal('ProcessOverride');
      process.env.name = undefined;
    });

    it('Get Environment Dot Notation Value', () => {
      const config = new Config({defaults:{name:'ObjectDefault'}});
      process.env['name_first'] = 'ProcessOverride';
      expect(config.get('name.first','InlineDefault')).to.equal('ProcessOverride');
      process.env['name_first'] = undefined;
    });

    it('Get Environment Dot Notation With Prefix Configured Value', () => {
      const config = new Config({envPrefix:'CFG_',defaults:{name:'ObjectDefault'}});
      process.env['CFG_name_first'] = 'ProcessOverride';
      expect(config.get('name.first','InlineDefault')).to.equal('ProcessOverride');
      process.env['CFG_name_first'] = undefined;
    });

  });
});