const ConfigConventional = require('@commitlint/config-conventional');

const Configuration = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      ConfigConventional.rules['type-enum'][0],
      ConfigConventional.rules['type-enum'][1],
      [...ConfigConventional.rules['type-enum'][2], 'example'],
    ],
  },
};

module.exports = Configuration;
