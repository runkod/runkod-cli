#!/usr/bin/env node

var runkod = require('./runkod')({ default: 'deploy' });

runkod(process.argv.slice(2));
