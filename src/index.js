"use strict";
const React = require("react");
const { render, Color } = require("ink");
const yml = require("js-yaml");
const fs = require("fs");
const homedir = require("os").homedir();
const path = require("path");

// function useInterval(callback, delay) {
//   const savedCallback = React.useRef();

//   React.useEffect(() => {
//     savedCallback.current = callback;
//   });

//   React.useEffect(() => {
//     function tick() {
//       savedCallback.current();
//     }

//     let id = setInterval(tick, delay);
//     return () => clearInterval(id);
//   }, [delay]);
// }

const KubeCleaner = () => {
  const [cluster, setCluster] = React.useState(null);
  React.useEffect(() => {
    const readConfig = async () => {
      const file = path.join(homedir, ".kube/config");
      console.log(file);
    };

    readConfig();
  }, []);

  return <Color green>1 tests passed</Color>;
};

render(<KubeCleaner />);
