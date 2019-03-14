"use strict";
const React = require("react");
const { render, Color } = require("ink");

function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

const Counter = () => {
  const [counter, setCounter] = React.useState(0);
  useInterval(() => {
    setCounter(counter + 1);
  }, 100);

  return <Color green>{counter} tests passed</Color>;
};

render(<Counter />);
