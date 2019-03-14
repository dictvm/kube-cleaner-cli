#!/usr/bin/env node

'use strict';

const importJsx = require('import-jsx');
process.env.FORCE_COLOR = '1';
importJsx('../src/KubeCleaner');
