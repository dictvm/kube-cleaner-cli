"use strict";
const React = require("react");
const { AppContext, StdinContext, render, Color, Box, Text } = require("ink");
const yml = require("js-yaml");
const fs = require("fs");
const homedir = require("os").homedir();
const path = require("path");
const SelectInput = require("ink-select-input").default;
const TextInput = require("ink-text-input").default;

const useOnEnter = onEnter => {
  const { stdin } = React.useContext(StdinContext);

  React.useEffect(() => {
    const onData = data => {
      const s = data.toString();

      if (s === "\r") {
        onEnter();
      }
    };

    stdin.on("data", onData);

    return () => {
      stdin.off("data", onData);
    };
  });
};

const updateConfig = (kubeConfig, cluster, contexts, users) => {
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

const KubeCleaner = () => {
  const [config, setConfig] = React.useState(() => {
    const kubeConfig = path.join(homedir, ".kube/config");
    const kubeContent = fs.readFileSync(kubeConfig, "utf8");
    const parsedConfig = yml.safeLoad(kubeContent);
    return parsedConfig;
  });

  const [cluster, setCluster] = React.useState(null);

  const handleClusterSelect = item => {
    setCluster(item.cluster);
  };

  const relatedContexts =
    cluster === null
      ? []
      : config.contexts.filter(context => {
          return context.context.cluster === cluster.name;
        });

  const relatedUsers =
    cluster === null
      ? []
      : config.users.filter(user => {
          return user.name.startsWith(cluster.name);
        });

  const clusterOptions = config.clusters.map(cluster => {
    return {
      label: cluster.name,
      value: cluster.name,
      cluster: cluster
    };
  });

  const [confirmationText, setConfirmationText] = React.useState("");

  const [deletionConfirmed, setDeletionConfirmed] = React.useState(false);

  const appContext = React.useContext(AppContext);
  React.useEffect(() => {
    if (deletionConfirmed === true) {
      updateConfig(config, cluster, relatedContexts, relatedUsers);
      appContext.exit();
    }
  }, [deletionConfirmed]);

  return (
    <Box>
      {cluster == null ? (
        <SelectInput items={clusterOptions} onSelect={handleClusterSelect} />
      ) : (
        <Box flexDirection="column">
          <ClusterRelationships
            cluster={cluster}
            contexts={relatedContexts}
            users={relatedUsers}
          />
          <Box marginTop={1}>
            Confirm deletion y/n:{" "}
            <TextInputWithEnter
              value={confirmationText}
              onChange={query => {
                setConfirmationText(query);
              }}
              onSubmit={() => {
                if (confirmationText === "y") {
                  setDeletionConfirmed(true);
                }
              }}
            />
          </Box>
          {deletionConfirmed === true ? (
            <Box>Cluster {cluster.name} has been deleted.</Box>
          ) : null}
        </Box>
      )}
    </Box>
  );
};

const TextInputWithEnter = ({ value, onChange, onSubmit }) => {
  useOnEnter(() => {
    onSubmit();
  });
  return <TextInput value={value} onChange={onChange} />;
};

const ClusterRelationships = ({ cluster, contexts, users }) => {
  return (
    <Box flexDirection="column">
      <Box>
        selected cluster: <Color green>{cluster.name}</Color>
      </Box>
      <Box paddingLeft={2}>
        context:{" "}
        {contexts.map((context, i) => {
          const separator = i === contexts.length - 1 ? "" : ", ";
          return (
            <Text key={i}>
              <Color green>{context.name}</Color>
              {separator}
            </Text>
          );
        })}
      </Box>
      <Box paddingLeft={2}>
        user:{" "}
        {users.map((user, i) => {
          const separator = i === users.length - 1 ? "" : ", ";
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
