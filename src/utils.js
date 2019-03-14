const yml = require('js-yaml');
const fs = require('fs');
const homedir = require('os').homedir();
const path = require('path');

const kubeConfigPath = path.join(homedir, '.kube/config');

module.exports.updateConfig = (kubeConfig, cluster, contexts, users) => {
  const config = JSON.parse(JSON.stringify(kubeConfig));
  const contextNames = contexts.map(context => context.name);
  const userNames = users.map(user => user.name);

  config.clusters = config.clusters.filter(c => c.name !== cluster.name);
  config.contexts = config.contexts.filter(context => {
    return !contextNames.includes(context.name);
  });
  config.users = config.users.filter(user => {
    return !userNames.includes(user.name);
  });

  return config;
};

module.exports.loadConfig = () => {
  const kubeContent = fs.readFileSync(kubeConfigPath, 'utf8');
  return yml.safeLoad(kubeContent);
};

module.exports.writeConfig = config => {
  const yamlConfig = yml.safeDump(config);
  fs.writeFileSync(kubeConfigPath, yamlConfig, 'utf8');
};
