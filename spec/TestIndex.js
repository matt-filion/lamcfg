'use strict';

const chai           = require('chai');
const Config         = require('../index.js');
const expect         = chai.expect;

describe('Configuration', () => {

  describe('#new()', () => {
    it('Base Configuration Object', () =>
      expect(new Config()).to.have.all.keys(['get','update','childOf'])
    );
  });

  describe('#get()', () => {
    
    it('Get No Value', () => {
      const config = new Config();
      expect(config.get('namex')).to.be.undefined
    });
    
    it('Get Boolean Value', () => {
      const config = new Config({defaults:{'x':true}});
      expect(config.get('x')).to.equal(true);
      config.update({x:false});
      expect(config.get('x')).to.equal(false);
    });
    
    it('Get Number Value', () => {
      const config = new Config({defaults:{'x':123}});
      expect(config.get('x')).to.equal(123);
      config.update({x:-321});
      expect(config.get('x')).to.equal(-321);
      config.update({x:0});
      expect(config.get('x')).to.equal(0);
    });
    
    it('Get Date Value', () => {
      const date = new Date();
      const config = new Config({defaults:{'x':date}});
      expect(config.get('x')).to.equal(date);
    });

    it('Get Inline Value', () => {
      const config = new Config();
      expect(config.get('name','InlineDefault')).to.equal('InlineDefault')
    });

    it('Get Default Configuration Value', () => {
      const config = new Config({defaults:{name:'ObjectDefault'}});
      expect(config.get('name','InlineDefault')).to.equal('ObjectDefault')
    });

    it('Get Default Value', () => {
      const config = new Config({defaults:{name:'ObjectDefault'}});
      expect(config.get('name','InlineDefault')).to.equal('ObjectDefault')
    });

    it('Get Object Value', () => {
      const config = new Config({defaults:{name:{first:'ObjectDefault'}}});
      expect(config.get('name','InlineDefault')).to.have.property('first').that.equals('ObjectDefault')
    });

    it('Get Object Value, nested, with siblings', () => {
      const config = new Config({defaults:{top:{name:{first:'ObjectDefault'}}},x:1});
      expect(config.get('top.name')).to.have.property('first').that.equals('ObjectDefault')
    });

    it('Get Object Value, with child object.', () => {
      const config = new Config({defaults:{top:{name:{first:'ObjectDefault'}}},x:1});
      expect(config.get('top')).to.have.property('name').that.has.property('first').that.equals('ObjectDefault')
    });

    it('Get Dot Notation Value after Updating', () => {
      const config = new Config({defaults:{name:{first:'ObjectDefault'}}});
      config.update({name:{first:'ObjectDefaultSecond'}})
      expect(config.get('name.first','InlineDefault')).to.equal('ObjectDefaultSecond')
    });

    it('Get Dot Notation Value after Updating, complex', () => {
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

    it('Get Environment Dot Notation With Prefix Configured Value and underscores in the name.', () => {
      const config = new Config({envPrefix:'CFG_',defaults:{ name: {"first_name":'ObjectDefault'}}});
      process.env['CFG_name_first_name'] = 'ProcessOverride';
      expect(config.get('name.first_name','InlineDefault')).to.equal('ProcessOverride');
      delete process.env['CFG_name_first_name'];
    });

    it('Get Configuration Object Value With Override', () => {
      const config = new Config({ defaults:{ name:{ first:'ObjectDefault' } } });
      process.env['name_first'] = 'ProcessOverridePROP';
      expect( config.get('name') ).to.have.property('first').that.equals('ProcessOverridePROP')
      delete process.env['name_first'];
    });
  });

  describe('#child()', () => {

    it('Get a child configuration.', () => {
      const config = new Config({defaults:{db:{name:'x',env:'test'}}});
      const childConfig = config.childOf('db');
      expect(childConfig).to.have.all.keys(['get','update','childOf'])
      expect(childConfig.get('name')).to.equal('x');
      expect(childConfig.get('env')).to.equal('test');
    });

    it('Get a child thats deeply nested in configuration', () => {
      const config = new Config({defaults:{parent:{db:{name:'x',env:'test'}}}});
      const childConfig = config.childOf('parent.db');
      expect(childConfig).to.have.all.keys(['get','update','childOf'])
      expect(childConfig.get('name')).to.equal('x');
      expect(childConfig.get('env')).to.equal('test');
    });

    it('Get a child configuration, with environment override', () => {
      process.env['db_name'] = 'ProcessOverride';
      const config = new Config({defaults:{db:{name:'x',env:'test'}}});
      const childConfig = config.childOf('db');
      expect(childConfig).to.have.all.keys(['get','update','childOf'])
      expect(childConfig.get('name')).to.equal('ProcessOverride');
      expect(childConfig.get('env')).to.equal('test');

      delete process.env['db_name'];
    });

    it('Get a child thats deeply nested in configuration, with environment override and underscore in name', () => {
      process.env['parent_db_first_name'] = 'ProcessOverride';
      const config = new Config({defaults:{parent:{db:{'first_name':'x',env:'test'}}}});
      const childConfig = config.childOf('parent.db');
      expect(childConfig).to.have.all.keys(['get','update','childOf'])
      expect(childConfig.get('first_name')).to.equal('ProcessOverride');
      expect(childConfig.get('env')).to.equal('test');;

      delete process.env['parent_db_first_name'];
    });

    it('Get a child and a child of the child', () => {
      process.env['parent_db_first_name'] = 'ProcessOverride';
      const config2 = new Config({defaults:{
        y: 2,
        parent: { 
          x: 1,
          db: {
            'first_name':'x',
            env:'test'
          }
        }
      }});
      const parentConfig = config2.childOf('parent');
      const childConfig = parentConfig.childOf('db');
      expect(childConfig).to.have.all.keys(['get','update','childOf'])
      expect(childConfig.get('first_name')).to.equal('ProcessOverride');
      expect(childConfig.get('env')).to.equal('test');;

      delete process.env['parent_db_first_name'];
    });

    it('Get a child and a child of the child, with prefix configured', () => {
      process.env['__xyzparent_db_first_name'] = 'ProcessOverride';
      const config2 = new Config({envPrefix:'__xyz',defaults:{
        y: 2,
        parent: { 
          x: 1,
          db: {
            'first_name':'x',
            env:'test'
          }
        }
      }});
      const parentConfig = config2.childOf('parent');
      const childConfig = parentConfig.childOf('db');
      expect(childConfig).to.have.all.keys(['get','update','childOf'])
      expect(childConfig.get('first_name')).to.equal('ProcessOverride');
      expect(childConfig.get('env')).to.equal('test');;

      delete process.env['__xyzparent_db_first_name'];
    });
  });
});