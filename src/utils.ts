import yml from 'js-yaml';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { Cluster, Context, User } from './types';

const kubeConfigPath = path.join(os.homedir(), '.kube/config');

export const updateConfig = (
  kubeConfig: any,
  cluster: Cluster,
  contexts: Context[],
  users: User[],
) => {
  const config = JSON.parse(JSON.stringify(kubeConfig));
  const contextNames = contexts.map((context: Context) => context.name);
  const userNames = users.map(user => user.name);

  config.clusters = config.clusters.filter(
    (c: Cluster) => c.name !== cluster.name,
  );
  config.contexts = config.contexts.filter((context: Context) => {
    return !contextNames.includes(context.name);
  });
  config.users = config.users.filter((user: User) => {
    return !userNames.includes(user.name);
  });

  return config;
};

export const loadConfig = () => {
  const kubeContent = fs.readFileSync(kubeConfigPath, 'utf8');
  return yml.safeLoad(kubeContent);
};

export const writeConfig = (config: any) => {
  const yamlConfig = yml.safeDump(config);
  fs.writeFileSync(kubeConfigPath, yamlConfig, 'utf8');
};