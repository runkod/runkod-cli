#!/usr/bin/env node

var runkod = require('./dist')({ default: 'deploy' });

runkod(process.argv.slice(2));
