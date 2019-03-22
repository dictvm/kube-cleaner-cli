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
  const [newCurrentContext, setNewCurrentContext] = useState<null | Cluster>(
    null,
  );
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
        newCurrentContext,
      );
      if (currentContext !== cluster.name) {
        writeConfig(updatedConfig);
        appContext.exit();
      } else {
        if (
          newCurrentContext !== null ||
          remainingClusterOptions.length === 0
        ) {
          writeConfig(updatedConfig);
          appContext.exit();
        }
      }
    }
  }, [
    deletionConfirmed,
    cluster,
    newCurrentContext,
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

  const remainingClusterOptions = clusterOptions.filter(option =>
    cluster ? option.label !== cluster.name : true,
  );

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
              readOnly={deletionConfirmed === true}
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
              {cluster.name === currentContext &&
              remainingClusterOptions.length > 0 ? (
                <Box>
                  Select new current context from remaining clusters:
                  <Box paddingLeft={1}>
                    <SelectInput
                      items={remainingClusterOptions}
                      onSelect={item => {
                        setNewCurrentContext(item.cluster);
                      }}
                    />
                  </Box>
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
