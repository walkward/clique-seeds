const test = require('ava');

const Seeds = require('../src');

test('each resource can be created independently', (assert) => {
  const seeds = new Seeds();
  assert.true(typeof seeds.customer() === 'object' && seeds.customer() !== null);
  assert.true(typeof seeds.project() === 'object' && seeds.project() !== null);
  assert.true(typeof seeds.user() === 'object' && seeds.user() !== null);
  assert.true(typeof seeds.group() === 'object' && seeds.group() !== null);
  assert.true(typeof seeds.collection() === 'object' && seeds.collection() !== null);
  assert.true(typeof seeds.folder() === 'object' && seeds.folder() !== null);
  assert.true(typeof seeds.asset() === 'object' && seeds.asset() !== null);
});

test('init creates tree of data', (assert) => {
  const seeds = new Seeds();
  seeds.init();
  assert.true(Object.values(seeds.records).every(records => records.length > 0));
});

test('checking enumerable customer.assets & project.assets properties', (assert) => {
  const seeds = new Seeds();
  seeds.init();

  assert.true(seeds.records.customers.some(customer => customer.assets.length > 0));
  assert.true(seeds.records.projects.some(customer => customer.assets.length > 0));

  const [project] = seeds.records.projects;
  Object.keys(project).forEach(key => assert.true(key !== 'assets'));

  const [customer] = seeds.records.customers;
  Object.keys(customer).forEach(key => assert.true(key !== 'assets'));
});

test('checking content types of each record', (assert) => {
  const seeds = new Seeds();
  seeds.init();

  assert.true(seeds.records.customers.every(customer => customer.projects.every(project => project.type === 'projects')));
  assert.true(seeds.records.customers.every(customer => customer.groups.every(group => group.type === 'groups')));
  assert.true(seeds.records.customers.every(customer => customer.users.every(user => user.type === 'users')));

  assert.true(seeds.records.projects.every(project => project.rootFolder.type === 'folders'));
  assert.true(seeds.records.projects.every(project => project.customer.type === 'customers'));

  assert.true(seeds.records.users.every(user => user.collections.every(collection => collection.type === 'collections')));
  assert.true(seeds.records.users.every(user => user.groups.every(group => group.type === 'groups')));
  assert.true(seeds.records.users.every(user => user.customer.type === 'customers'));

  assert.true(seeds.records.groups.every(group => group.collections.every(collection => collection.type === 'collections')));
  assert.true(seeds.records.groups.every(group => group.users.every(user => user.type === 'users')));
  assert.true(seeds.records.groups.every(group => group.customer.type === 'customers'));

  assert.true(seeds.records.folders.every(folder => folder.collections.every(collection => collection.type === 'collections')));
  assert.true(seeds.records.folders.every(folder => folder.folders.every(f => f.type === 'folders')));
  assert.true(seeds.records.folders.every(folder => folder.assets.every(asset => asset.type === 'assets')));

  assert.true(seeds.records.collections.every(collection => collection.assets.every(asset => asset.type === 'assets')));

  assert.true(seeds.records.assets.every(asset => asset.folder.type === 'folders'));
});


test('helper methods should return their expected type', (assert) => {
  const seeds = new Seeds();

  assert.true(typeof seeds.companyName() === 'string');
  assert.true(typeof seeds.buzzWord() === 'string');
  assert.true(typeof seeds.titleWord() === 'string');
  assert.true(typeof seeds.created() === 'string');
  assert.true(typeof seeds.modified() === 'string');
  assert.true(typeof seeds.title() === 'string');

  assert.true(typeof seeds.randomCount(0, 2) === 'number');
  assert.true(typeof seeds.randomCount() === 'number');
  assert.true(typeof seeds.smallCount(2) === 'number');
  assert.true(typeof seeds.smallCount() === 'number');
  assert.true(typeof seeds.largeCount(20) === 'number');
  assert.true(typeof seeds.largeCount() === 'number');
});

test('creating a record should add it to the records array', (assert) => {
  const seeds = new Seeds();
  seeds.asset();
  assert.true(seeds.records.assets.length === 1);
});

test('use once should only allow using a value once', (assert) => {
  const seeds = new Seeds();
  const array = [1, 2];
  assert.true(typeof seeds.useOnce(array, 3) === 'number');
  assert.true(typeof seeds.useOnce(array, 3) === 'number');
  assert.true(array.length === 0);
  assert.true(seeds.useOnce(array, 3) === 3);
});

test('we can serialize each type', (assert) => {
  const seeds = new Seeds();
  const types = Object.keys(seeds.records);
  assert.plan(types.length);

  seeds.init();

  types.forEach((type) => {
    seeds.records[type] = seeds.serialize(type);
    assert.true(seeds.records[type].length > 0);
  });
});
