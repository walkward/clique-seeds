
const fs = require('fs');
const path = require('path');
const Seeds = require('./src');

try {
  const seeds = new Seeds();
  const types = Object.keys(seeds.records);

  seeds.init();

  types.forEach((type) => {
    seeds.records[type] = seeds.serialize(type);
  });

  fs.writeFile(
    path.join(__dirname, 'seeds.json'),
    JSON.stringify(seeds.records, null, 2),
    'utf8',
    (err) => { if (err) throw err; },
  );
} catch (error) {
  console.log(error);
}
