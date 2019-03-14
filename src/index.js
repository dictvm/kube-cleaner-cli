'use strict';
const React = require('react');
const {render, Color, Box, Text} = require('ink');
const yml = require('js-yaml');
const fs = require('fs');
const homedir = require('os').homedir();
const path = require('path');
const SelectInput = require('ink-select-input').default;

// function useInterval(callback, delay) {
//   const savedCallback = React.useRef();

//   React.useEffect(() => {
//     savedCallback.current = callback;
//   });

//   React.useEffect(() => {
//     function tick() {
//       savedCallback.current();
//     }

//     let id = setInterval(tick, delay);
//     return () => clearInterval(id);
//   }, [delay]);
// }

const KubeCleaner = () => {
  const [config, setConfig] = React.useState(() => {
    const kubeConfig = path.join(homedir, '.kube/config');
    const kubeContent = fs.readFileSync(kubeConfig, 'utf8');
    const parsedConfig = yml.safeLoad(kubeContent);
    return parsedConfig;
  });

  const [cluster, setCluster] = React.useState(null);

  const handleClusterSelect = item => {
    setCluster(item.cluster);
  };

  const clusterOptions = config.clusters.map(cluster => {
    return {
      label: cluster.name,
      value: cluster.name,
      cluster: cluster,
    };
  });

  return (
    <Box>
      {cluster == null ? (
        <SelectInput items={clusterOptions} onSelect={handleClusterSelect} />
      ) : (
        <ClusterRelationships
          cluster={cluster}
          contexts={config.contexts}
          users={config.users}
        />
      )}
    </Box>
  );
};

const ClusterRelationships = ({cluster, contexts, users}) => {
  const relatedContexts = contexts.filter(context => {
    return context.context.cluster === cluster.name;
  });

  const relatedUsers = users.filter(user => {
    return user.name.startsWith(cluster.name);
  });

  return (
    <Box flexDirection="column">
      <Box>
        selected cluster: <Color green>{cluster.name}</Color>
      </Box>
      <Box>
        related context:{' '}
        {relatedContexts.map((context, i) => {
          const separator = i === relatedContexts.length - 1 ? '' : ', ';
          return (
            <Text key={i}>
              <Color green>{context.name}</Color>{separator}
            </Text>
          );
        })}
      </Box>
      <Box>
        related user:{' '}
        {relatedUsers.map((user, i) => {
          const separator = i === relatedUsers.length - 1 ? '' : ', ';
          return (
            <Text key={i}>
              <Color green>{user.name}</Color>
              {separator}
            </Text>
          );
        })}
      </Box>
    </Box>
  );
};

render(<KubeCleaner />);
