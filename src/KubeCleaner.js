'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const { AppContext, render, Box } = require('ink');
const SelectInput = require('ink-select-input').default;
const TextInputWithEnter = importJsx('./TextInputWithEnter');
const ClusterRelationships = importJsx('./ClusterRelationships');

const { updateConfig, writeConfig, loadConfig } = require('./utils');

const KubeCleaner = () => {
  const appContext = React.useContext(AppContext);

  const [config] = React.useState(() => loadConfig());

  const [cluster, setCluster] = React.useState(null);
  const [confirmationText, setConfirmationText] = React.useState('');
  const [deletionConfirmed, setDeletionConfirmed] = React.useState(false);

  const relatedContexts =
    cluster === null
      ? []
      : config.contexts.filter(
          context => context.context.cluster === cluster.name,
        );

  const relatedUsers =
    cluster === null
      ? []
      : config.users.filter(user => user.name.startsWith(cluster.name));

  const clusterOptions = config.clusters.map(cluster => ({
    label: cluster.name,
    value: cluster.name,
    cluster: cluster,
  }));

  React.useEffect(() => {
    if (deletionConfirmed === true) {
      const updatedConfig = updateConfig(
        config,
        cluster,
        relatedContexts,
        relatedUsers,
      );
      writeConfig(updatedConfig);
      appContext.exit();
    }
  }, [deletionConfirmed]);

  return (
    <Box>
      {cluster == null ? (
        <SelectInput
          items={clusterOptions}
          onSelect={item => {
            setCluster(item.cluster);
          }}
        />
      ) : (
        <Box flexDirection="column">
          <ClusterRelationships
            cluster={cluster}
            contexts={relatedContexts}
            users={relatedUsers}
          />
          <Box marginTop={1}>
            Confirm deletion y/n:{' '}
            <TextInputWithEnter
              value={confirmationText}
              onChange={query => {
                setConfirmationText(query);
              }}
              onSubmit={() => {
                if (confirmationText === 'y') {
                  setDeletionConfirmed(true);
                }
                switch (confirmationText) {
                  case 'y':
                    return setDeletionConfirmed(true);
                  case 'n':
                    setDeletionConfirmed(false);
                    setConfirmationText('');
                    return setCluster(null);
                  default:
                    setDeletionConfirmed(null);
                    setConfirmationText('');
                    return;
                }
              }}
            />
          </Box>
          {deletionConfirmed === true ? (
            <Box>Cluster {cluster.name} has been deleted.</Box>
          ) : null}
          {deletionConfirmed === null ? <Box>Invalid input.</Box> : null}
        </Box>
      )}
    </Box>
  );
};

render(<KubeCleaner />);
