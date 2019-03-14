'use strict';
const React = require('react');
const { Color, Box, Text } = require('ink');

const ClusterRelationships = ({ cluster, contexts, users }) => {
  return (
    <Box flexDirection="column">
      <Box>
        selected cluster: <Color green>{cluster.name}</Color>
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

module.exports = ClusterRelationships;
