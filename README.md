# clique-seeds

## Install

```sh
yarn add clique-seeds
```


## Overview

Use the `Seeds()` constructor to instantiate a generator for creating seed data. The `Seeds` constructor takes two optional arguments:
- instance<?number|?string>: See the [Chance.js Seed documentation](https://chancejs.com/usage/seed.html). The instance value essentially guarantees repeatable results given the same instance value and options arguments.
- options<?object>: See default options below.

##### Default options

Most of the following default options apply to the `init()` method which generates a graph of relational data.

```js
{
  customerCount: 2,
  maxFolderDepth: 6,
  maxAssets: 30,
  maxProjects: 10,
  maxFolders: 10,
  maxCollections: 10,
  quiet: true,        // Quiet mode prevents the init method from printing record counts
}
```

> NOTE: Modifying these options can exponentially increase the number of records generated

## Usage

```js
const Seeds = require('clique-seeds');

// Instantiate the seeds with an instance value of 1
const seeds = new Seeds(1);

// Creates an individual asset.
const asset = seeds.asset();

// An "overrides" object can be passed while creating records which will automatically override the seed
// generated object. Also note, this folder object is pushed into the seeds.records.folders array.
const folder = seeds.folder({ id: '123123' });

// Create 10 customers. Note, this will not create an "hasMany" data for the generated customers. Use the
// seeds.init() method for generating a graph of data.
const customers = seeds.generate(10, this.customer)

// Initialize a graph of data stored on the object this.records. Note, calling seeds.init() twice will duplicate
// the amount of data generated. Also note, any records created prior to seeds.init() will exist within the records
// arrays.
seeds.init()

// Will return objects in the shape the json-api expects for seeding the db
seeds.serialize('projects')

/* =========== String Generators =========== */
seeds.title()                  // Generates a random human readable title (titles can have multiple words)
seeds.companyName()            // String suitable for a company name
seeds.titleWord()              // Individual title word
seeds.buzzWord()               // Individual buzzword
seeds.randomCount(10, 100)     // Generate a random number between 10 - 100

/* =========== Numeric Generators =========== */
seeds.smallCount(10)        // Generates a number between 0 - 10 that is more likely to be small
seeds.largeCount(10)        // Opposite of seeds.smallCount()
seeds.randomCount(10, 100)  // Generate a random number between 10 - 100

/* =========== Use Once Generator =========== */
// Use once will return a random value from an array, then mutate the array to
// remove the value which has been returned. Thus, guaranteeing that values can only
// be "used once." Note, you may add arrays to the seeds.data map for this purpose. However,
// be careful to not override any of the existing data arrays.
seeds.useOnce(['foo', 'bar'], 'baz') // returns some item from array (e.g. 'bar')
seeds.useOnce(['foo', 'bar'], 'baz') // returns some different from array (e.g. 'foo')
seeds.useOnce(['foo', 'bar'], 'baz') // returns default value from array (e.g. 'baz')
seeds.useOnce(['foo', 'bar'], 'baz') // returns default value from array (e.g. 'baz')

```

