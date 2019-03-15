import React from 'react';
import { StdinContext } from 'ink';
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
}> = ({ value, onChange, onSubmit }) => {
  useOnEnter(() => {
    onSubmit();
  });
  return <TextInput value={value} onChange={onChange} />;
};

export default TextInputWithEnter;
