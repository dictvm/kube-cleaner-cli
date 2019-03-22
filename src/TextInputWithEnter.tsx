import React from 'react';
import { StdinContext, Text } from 'ink';
import TextInput from 'ink-text-input';

const useOnEnter = (onEnter: () => any) => {
  const { stdin } = React.useContext(StdinContext);

  React.useEffect(() => {
    const onData = (data: NodeJS.ReadStream) => {
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

const TextInputWithEnter: React.FC<{
  value: string;
  onChange: (value: string) => any;
  onSubmit: () => any;
  readOnly?: boolean;
}> = ({ value, onChange, onSubmit, readOnly }) => {
  useOnEnter(() => {
    if (!readOnly) onSubmit();
  });
  if (readOnly) return <Text>{value}</Text>;
  return <TextInput value={value} onChange={onChange} />;
};

export default TextInputWithEnter;
