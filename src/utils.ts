import yml from 'js-yaml';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { Cluster, Context, User, Config } from './types';

const kubeConfigPath = path.join(os.homedir(), '.kube', 'config');

export const updateConfig = (
  kubeConfig: Config,
  cluster: Cluster,
  contexts: Context[],
  users: User[],
): Config => {
  const config: Config = JSON.parse(JSON.stringify(kubeConfig));
  const contextNames = contexts.map((context: Context) => context.name);
  const userNames = users.map(user => user.name);

  config.clusters = config.clusters.filter(c => c.name !== cluster.name);
  config.contexts = config.contexts.filter(
    context => !contextNames.includes(context.name),
  );
  if (config['current-context'] === cluster.name) {
    delete config['current-context'];
  }
  config.users = config.users.filter(user => !userNames.includes(user.name));

  return config;
};

export const loadConfig = (): Config => {
  const kubeContent = fs.readFileSync(kubeConfigPath, 'utf8');
  return yml.safeLoad(kubeContent);
};

export const writeConfig = (config: Config) => {
  const yamlConfig = yml.safeDump(config);
  fs.writeFileSync(kubeConfigPath, yamlConfig, 'utf8');
};
