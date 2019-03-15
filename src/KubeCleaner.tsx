import React, { useContext, useState, useEffect } from 'react';
import { AppContext, render, Box } from 'ink';
import SelectInput from 'ink-select-input';
import TextInputWithEnter from './TextInputWithEnter';
import ClusterRelationships from './ClusterRelationships';

import { updateConfig, writeConfig, loadConfig } from './utils';
import { Cluster } from './types';

const KubeCleaner = () => {
  const appContext = useContext(AppContext);

  const [config] = useState(() => loadConfig());

  const [cluster, setCluster] = useState<null | Cluster>(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [deletionConfirmed, setDeletionConfirmed] = useState<boolean | null>(
    false,
  );

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
  }, [deletionConfirmed]);

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

  if (clusterOptions.length === 0) {
    return <Box>No clusters found in the config</Box>;
  }

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

export const start = () => render(<KubeCleaner />);
