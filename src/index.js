/**
 * Seeds: A class for generating seed data
 * ------------------------------------
 * This class extends the chance.js library using "mixins"
 * See [github repo](chance.js library](https://github.com/chancejs/chancejs) for information on all the available methods
 *
 * Calling any of the "resource generator methods" will return the requested resource in addition to
 * adding that resource to its associated array (e.g. this.customers)
 *
 * Calling seed.init() will generate an entire tree of resources starting from the customer down.
 * Afterwards you can access seeds[<resource type>] to access each object. You will likely want to
 * call init once before seeding a database, but calling seed.init() multiple times will do no harm.
 *
 * @example
 * const seeds = new Seeds();           // Instantiate a Seeds instance
 * seeds.asset()                        // Returns an asset object
 * seeds.folder({ assets })             // Returns a folder object that hasMany assets
 *
 * const seeds = new Seeds(Date.now())  // Seeding with the current timestamp guarantees uniqueness
 *
 * @namespace seeds
 */

const pick = require('lodash/pick');
const omit = require('lodash/omit');
const { stripIndents } = require('common-tags');
const Chance = require('chance');

module.exports = class Seeds extends Chance {
  constructor(instance, options) {
    super(instance);

    this.options = Object.assign({
      customerCount: 2,
      maxFolderDepth: 6,
      maxAssets: 30,
      maxProjects: 10,
      maxFolders: 10,
      maxCollections: 10,
    }, options);

    this.state = {
      initialized: false,
    };

    this.records = {
      customers: [],
      projects: [],
      users: [],
      groups: [],
      folders: [],
      collections: [],
      assets: [],
    };

    this.data = {
      names: ['justin', 'walker'],
      companyNames: ['Zoonder', 'Voolith', 'Gabcube', 'Rooxo', 'Einti', 'Zava', 'Fivespan', 'Dablist', 'Twitterbridge', 'Jaxworks', 'Zooxo', 'Aimbo', 'Shuffletag', 'Brightbean', 'Yombu', 'Leenti', 'Trunyx', 'Zoonoodle', 'Aimbo', 'Zoomdog', 'Dynazzy', 'Meedoo', 'Fadeo', 'Blogtag', 'Vipe', 'Mydo', 'Bluejam', 'Jaloo', 'Oba', 'Skilith', 'Skiptube', 'Devbug', 'Centimia', 'Twitternation', 'Edgeclub', 'Photospace', 'Rhyzio', 'Kazio', 'Avamba', 'Avamba', 'Avavee', 'Linkbridge', 'Camido', 'Jayo', 'Kazu', 'Realpoint', 'Jabbersphere', 'Zoomlounge', 'Shuffletag', 'Omba'],
      buzzWords: ['actuating', 'synergy', 'Streamlined', 'success', 'alliance', 'Proactive', 'leverage', 'analyzing', 'static', 'Proactive', 'bifurcated', 'Front-line', '3rd generation', 'optimizing', 'synergy', 'throughput', 'core', 'Cloned', 'Quality-focused', 'database', 'Innovative', 'approach', 'Devolved', 'full-range', 'disintermediate', 'support', 'interface', 'Business-focused', 'protocol', 'local', 'high-level', 'cohesive', 'analyzer', 'User-centric', 'protocol', 'concept', 'Enterprise-wide', 'leading edge', 'cohesive', 'systemic', '5th generation', 'web-enabled', 'multi-tasking', 'open system', 'hybrid', 'approach', 'leverage', 'foreground', 'Front-line', 'Inverse', 'approach', 'Enterprise-wide', 'multi-state', 'flexibility', 'Optimized', 'Cloned', 'object-oriented', 'Fully-configurable', 'Face to face', 'uniform', 'national', 'object-oriented', 'Automated', 'solution', 'secured line'],
      titleWords: ['tresom', 'bytecard', 'stim', 'it', 'fintone', 'biodex', 'andalax', 'fixflex', 'cardify', 'sonair', 'tres-zap', 'cardguard', 'konklab', 'regrant', 'wrapsafe', 'treeflex', 'bitchip', 'solarbreeze', 'duobam', 'voltsillam', 'voltsillam', 'sub-ex', 'temp', 'zoolab', 'quo lux', 'sonair', 'ventosanzap', 'treeflex', 'fix san', 'hatity', 'holdlamis', 'sub-ex', 'flowdesk', 'zaam-dox', 'stronghold', 'hatity', 'solarbreeze', 'redhold', 'toughjoyfax', 'lotstring', 'gembucket', 'it', 'fix san', 'cardguard', 'hatity', 'y-find', 'alphazap', 'ronstring', 'alphazap', 'opela', 'zoolab', 'mat lam tam', 'veribet', 'solarbreeze', 'opela', 'ventosanzap', 'zoolab', 'cardguard', 'opela', 'y-solowarm', 'aerified', 'regrant', 'fintone', 'otcom', 'wrapsafe', 'zathin'],
    };

    this.mixin({
      /* ======= Begin Helper Methods ======= */

      companyName: () => this.pickone(this.data.companyNames),

      titleWord: () => this.pickone(this.data.titleWords),

      buzzWord: () => this.pickone(this.data.buzzWords),

      created: () => this.date({ year: 2017 }).toJSON().replace(/.{5}$/, 'Z'),

      modified: () => this.date({ year: 2018 }).toJSON().replace(/.{5}$/, 'Z'),

      randomCount: (min = 1, max = 10) => this.integer({ min, max }),

      generate: (count, method, opts) => Array(count).fill(null).map(() => method(opts)),

      useOnce: (array, defaultValue) => {
        if (array.length === 0) return defaultValue;
        const index = this.randomCount(0, array.length - 1);
        const value = array[index];
        array.splice(index, 1);
        return value;
      },

      smallCount: (max = 6) => {
        const values = Array.from(Array(max + 1).keys());
        const weight = Array.from(Array(max + 1).keys()).reverse().map(value => value * value);
        return this.weighted(values, weight);
      },

      // NOTE: Not currently used anywhere, but will be useful in the future...
      largeCount: (max = 6) => {
        const values = Array.from(Array(max + 1).keys());
        const weight = Array.from(Array(max + 1).keys()).map(value => value * value);
        return this.weighted(values, weight);
      },

      title: () => this.pickone([
        `${this.titleWord()}`,
        `${this.capitalize(this.buzzWord())} ${this.titleWord()}`,
        `${this.capitalize(this.buzzWord())} ${this.capitalize(this.companyName())}`,
        `${this.capitalize(this.buzzWord())} ${this.capitalize(this.buzzWord())} ${this.titleWord()}`,
        `${this.capitalize(this.buzzWord())} ${this.word({ length: this.randomCount(4, 12) })}`,
        `${this.capitalize(this.buzzWord())} ${this.word({ length: 12 })} ${this.word({ length: 8 })}`,
      ]),

      addRecord: (item) => {
        this.records[item.type].push(item);
        return item;
      },

      retrieve(recordType) {
        const records = this.records[recordType];
        const hasManys = Object.keys(this.records);
        const belongsTo = ['rootFolder', ...hasManys.map(o => o.replace(/[s]$/, ''))];

        return records.map((record) => {
          record = omit(record, belongsTo); // eslint-disable-line no-param-reassign
          return hasManys.reduce((prev, hasMany) => {
            if (typeof prev[hasMany] !== 'undefined') {
              prev[hasMany] = prev[hasMany].map(o => pick(o, ['id', 'type'])); // eslint-disable-line no-param-reassign
            }
            return prev;
          }, record);
        });
      },

      /* ======= End Helper Methods ======= */

      /* ======= Begin Resource Generator Methods ======= */

      asset: (overrides = {}) => {
        const asset = Object.assign({
          id: this.guid(),
          type: 'assets',
          name: `XDAM_${this.pad(this.records.assets.length + 1, 5)}.jpg`,
          created: this.created(),
          modified: this.modified(),
          fileType: 'JPG',
          location: 's3.amazonaws.com/xdam-clique-qa-assets',
          folder: null,
        }, overrides);

        return this.addRecord(asset);
      },

      collection: (overrides = {}) => {
        const collection = Object.assign({
          id: this.guid(),
          type: 'collections',
          name: this.title(),
          created: this.created(),
          modified: this.modified(),
          assets: [],
          user: null,
        }, overrides);

        return this.addRecord(collection);
      },

      folder: (overrides = {}) => {
        const folder = Object.assign({
          id: this.guid(),
          type: 'folders',
          name: this.title(),
          created: this.created(),
          modified: this.modified(),
          folders: [],
          collections: [],
          assets: [],
          folder: null,
        }, overrides);

        return this.addRecord(folder);
      },

      project: (overrides = {}) => {
        const project = Object.assign({
          id: this.guid(),
          type: 'projects',
          name: this.title(),
          created: this.created(),
          modified: this.modified(),
          rootFolder: overrides.rootFolder || this.folder(),
          customer: null,
        }, overrides);

        Object.defineProperties(project, {
          assets: {
            enumerable: false,
            get() {
              // Recursively finding all assets within the folder tree
              const assets = [];
              const nested = (obj) => {
                if (typeof obj.assets !== 'undefined') assets.push(...obj.assets);
                if (typeof obj.folders !== 'undefined' && obj.folders.length > 0) obj.folders.forEach(nested);
              };
              nested(this.rootFolder);
              return assets;
            },
          },
        });

        return this.addRecord(project);
      },

      user: (overrides = {}) => {
        const firstname = this.useOnce(this.data.names, this.first({ nationality: 'en' }));
        const lastname = this.last({ nationality: 'en' });

        const user = Object.assign({
          id: this.guid(),
          type: 'users',
          created: this.created(),
          modified: this.modified(),
          email: `${firstname}_${lastname}@email.com`.toLowerCase(),
          login: `${firstname}`.toLowerCase(),
          password: 'test',
          firstname,
          lastname,
          collections: [],
          groups: [],
          customer: null,
        }, overrides);

        return this.addRecord(user);
      },

      group: (overrides = {}) => {
        const group = Object.assign({
          id: this.guid(),
          type: 'groups',
          name: this.title(),
          created: this.created(),
          modified: this.modified(),
          collections: [],
          users: [],
          customer: null,
        }, overrides);

        return this.addRecord(group);
      },

      customer: (overrides = {}) => {
        const customer = Object.assign({
          id: this.guid(),
          type: 'customers',
          name: this.title(),
          created: this.created(),
          modified: this.modified(),
          groups: [],
          projects: [],
          users: [],
        }, overrides);

        Object.defineProperties(customer, {
          assets: {
            enumerable: false,
            get() {
              return this.projects.reduce((total, project) => [...total, ...project.assets], []);
            },
          },
        });

        return this.addRecord(customer);
      },

      /* ======= Begin Seed Generation Lifecycle Methods  ======= */

      init: () => {
        if (!this.state.initialized) {
          this.state.initialized = true;

          const customers = this.generate(this.options.customerCount, this.customer);

          customers.forEach((customer) => {
            const projects = this.generate(this.randomCount(), this.project, { customer });
            customer.projects.push(...projects);

            projects.forEach((project) => {
              const { rootFolder } = project;

              const assets = this.generate(this.randomCount(), this.asset, {
                folder: rootFolder,
              });
              rootFolder.assets.push(...assets);

              const collections = this.generate(this.randomCount(), this.collection, {
                assets: this.pickset(assets, this.randomCount()),
                folder: rootFolder,
              });
              rootFolder.collections.push(...collections);

              const folders = this.generate(this.randomCount(), this.folder, {
                folder: rootFolder,
              });
              rootFolder.folders.push(...folders);
            });

            const users = this.generate(this.randomCount(), this.user, { customer });
            const groups = this.generate(this.randomCount(), this.group, { customer });

            users.forEach((user) => {
              const collections = this.generate(this.randomCount(), this.collection, {
                assets: customer.assets,
                user,
              });
              user.collections.push(...collections);
              user.groups.push(...this.pickset(groups, this.randomCount()));
            });
            customer.users.push(...users);

            groups.forEach((group) => {
              const collections = this.generate(this.randomCount(), this.collection, {
                assets: this.pickset(customer.assets, this.randomCount()),
                customer,
              });
              group.collections.push(...collections);
              group.users.push(...customer.users.filter((user) => {
                return user.groups.some(g => g.id === group.id);
              }));
            });
            customer.groups.push(...groups);
          });

          /* eslint-disable */
          console.log(stripIndents`
            Generated Seed Data:
            ----------------------
            ${Object.entries(this.records).reduce((prev, [key, value]) => prev += `${key}: ${value.length}\n`, '')}
          `);
          /* eslint-enable */
        }
      },

      /* ======= End Seed Generation Lifecycle Methods  ======= */
    });
  }
};
