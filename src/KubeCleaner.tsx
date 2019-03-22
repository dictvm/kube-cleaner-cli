import React, { useContext, useState, useEffect } from 'react';
import { AppContext, Color, render, Box } from 'ink';
import SelectInput from 'ink-select-input';
import TextInputWithEnter from './TextInputWithEnter';
import ClusterRelationships from './ClusterRelationships';
import { updateConfig, writeConfig, loadConfig } from './utils';
import { Cluster } from './types';

export const KubeCleaner = () => {
  const appContext = useContext(AppContext);

  const [config] = useState(() => loadConfig());

  const [cluster, setCluster] = useState<null | Cluster>(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [deletionConfirmed, setDeletionConfirmed] = useState<boolean | null>(
    false,
  );

  const relatedContexts =
    cluster === null
      ? []
      : config.contexts.filter(
          context => context.context.cluster === cluster.name,
        );

  const relatedUsers =
    cluster === null
      ? []
      : config.users.filter(
          user =>
            user.name.startsWith(cluster.name) ||
            cluster.name.startsWith(user.name),
        );

  const currentContext = config['current-context'];

  useEffect(() => {
    if (deletionConfirmed === true && cluster !== null) {
      const updatedConfig = updateConfig(
        config,
        cluster,
        relatedContexts,
        relatedUsers,
      );
      writeConfig(updatedConfig);
      appContext.exit();
    }
  }, [
    deletionConfirmed,
    cluster,
    config,
    relatedContexts,
    relatedUsers,
    appContext,
  ]);

  if (config.clusters.length === 0) {
    return <Box>No clusters found in the config</Box>;
  }

  const clusterOptions = config.clusters.map(cluster => ({
    label: cluster.name,
    value: cluster.name,
    cluster: cluster,
  }));

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
            currentContext={currentContext}
          />
          <Box marginTop={1}>
            Confirm deletion y/n:{' '}
            <TextInputWithEnter
              value={confirmationText}
              onChange={query => {
                setConfirmationText(query);
              }}
              onSubmit={() => {
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
            <Box flexDirection="column">
              <Box>Cluster {cluster.name} has been deleted.</Box>
              {cluster.name === currentContext ? (
                <Box>
                  The deleted cluster was also your current context. Use{' '}
                  <Color blue>
                    kubectl config set current-context $cluster-name
                  </Color>{' '}
                  to set a new default context.
                </Box>
              ) : null}
            </Box>
          ) : null}
          {deletionConfirmed === null ? <Box>Invalid input.</Box> : null}
        </Box>
      )}
    </Box>
  );
};

export const start = () => render(<KubeCleaner />);
