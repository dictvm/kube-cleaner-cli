import React from 'react';
import yml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import * as utils from './utils';
import { KubeCleaner } from './KubeCleaner';
import { render } from 'ink-testing-library';
process.env.FORCE_COLOR = '0';

test('it works', () => {
  jest.spyOn(utils, 'loadConfig').mockImplementation(() => {
    const configPath = path.resolve(__dirname, '__fixtures__', 'config');
    console.log(configPath);
    const content = fs.readFileSync(configPath, 'utf8');
    return yml.safeLoad(content);
  });
  const { lastFrame } = render(<KubeCleaner />);
  expect(lastFrame()).toMatchInlineSnapshot(`"❯ docker-for-desktop-cluster"`);
});
