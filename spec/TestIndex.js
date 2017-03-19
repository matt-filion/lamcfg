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
    
    it('Get No Value', () => {
      const config = new Config();
      expect(config.get('namex')).to.be.undefined
    });
    
    it('Get Inline Value', () => {
      const config = new Config();
      expect(config.get('name','InlineDefault')).to.equal('InlineDefault')
    });

    it('Get Default Configuration Value', () => {
      const config = new Config({defaults:{name:'ObjectDefault'}});
      expect(config.get('name','InlineDefault')).to.equal('ObjectDefault')
    });

    it('Get Default Configuration Value', () => {
      const config = new Config({defaults:{name:'ObjectDefault'}});
      expect(config.get('name','InlineDefault')).to.equal('ObjectDefault')
    });

    it('Get Configuration Object Value', () => {
      const config = new Config({defaults:{name:{first:'ObjectDefault'}}});
      expect(config.get('name','InlineDefault')).to.have.property('first').that.equals('ObjectDefault')
    });

    it('Get Configuration Dot Notation Value after Updating', () => {
      const config = new Config({defaults:{name:{first:'ObjectDefault'}}});
      config.update({name:{first:'ObjectDefaultSecond'}})
      expect(config.get('name.first','InlineDefault')).to.equal('ObjectDefaultSecond')
    });

    it('Get Configuration Dot Notation Value after Updating, complex', () => {
      const config = new Config({defaults:{name:{first:'ObjectDefault'}}});
      config.update({name:{first:'ObjectDefaultSecond'},another:{value:'to check'}})
      expect(config.get('another.value')).to.equal('to check')
      expect(config.get('name.first')).to.equal('ObjectDefaultSecond')
    });

    it('Get Environment Value', () => {
      const config = new Config({name:'ObjectDefault'});
      process.env.name = 'ProcessOverride';
      expect(config.get('name','InlineDefault')).to.equal('ProcessOverride');
      delete process.env.name;
    });

    it('Get Environment Dot Notation Value', () => {
      const config = new Config({defaults:{name:'ObjectDefault'}});
      process.env['name_first'] = 'ProcessOverride';
      expect(config.get('name.first','InlineDefault')).to.equal('ProcessOverride');
      delete process.env['name_first'] ;
    });

    it('Get Environment Dot Notation With Prefix Configured Value', () => {
      const config = new Config({envPrefix:'CFG_',defaults:{name:'ObjectDefault'}});
      process.env['CFG_name_first'] = 'ProcessOverride';
      expect(config.get('name.first','InlineDefault')).to.equal('ProcessOverride');
      delete process.env['CFG_name_first'];
    });

    it('Get Configuration Object Value With Override', () => {
      const config = new Config({ defaults:{ name:{ first:'ObjectDefault' } } });
      process.env['name_first'] = 'ProcessOverridePROP';
      expect( config.get('name') ).to.have.property('first').that.equals('ProcessOverridePROP')
      delete process.env['name_first'];
    });

  });
});