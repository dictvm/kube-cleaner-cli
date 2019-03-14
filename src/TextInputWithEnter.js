'use strict';
const React = require('react');
const { StdinContext } = require('ink');
const TextInput = require('ink-text-input').default;

const useOnEnter = onEnter => {
  const { stdin } = React.useContext(StdinContext);

  React.useEffect(() => {
    const onData = data => {
      const s = data.toString();

      if (s === '\r') {
        onEnter();
      }
    };

    stdin.on('data', onData);

    return () => {
      stdin.off('data', onData);
    };
  });
};

const TextInputWithEnter = ({ value, onChange, onSubmit }) => {
  useOnEnter(() => {
    onSubmit();
  });
  return <TextInput value={value} onChange={onChange} />;
};

module.exports = TextInputWithEnter;
