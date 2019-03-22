import React from 'react';
import { Color, Box, Text } from 'ink';
import { Cluster, Context, User, CurrentContext } from './types';

const ClusterRelationships: React.FC<{
  cluster: Cluster;
  contexts: Context[];
  users: User[];
  currentContext: CurrentContext;
}> = ({ cluster, contexts, users, currentContext }) => {
  return (
    <Box flexDirection="column">
      <Box>
        selected cluster: <Color green>{cluster.name}</Color>
      </Box>
      <Box>
        current context: <Color green>{currentContext}</Color>
      </Box>
      <Box paddingLeft={2}>
        context:{' '}
        {contexts.map((context, i) => {
          const separator = i === contexts.length - 1 ? '' : ', ';
          return (
            <Text key={i}>
              <Color green>{context.name}</Color>
              {separator}
            </Text>
          );
        })}
      </Box>
      <Box paddingLeft={2}>
        user:{' '}
        {users.map((user, i) => {
          const separator = i === users.length - 1 ? '' : ', ';
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

export default ClusterRelationships;
