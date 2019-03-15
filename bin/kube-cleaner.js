#!/usr/bin/env node

'use strict';

const { start } = require('../dist/KubeCleaner');

process.env.FORCE_COLOR = '1';
start();
