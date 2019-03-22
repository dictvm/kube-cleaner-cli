export interface Cluster {
  name: string;
}

export interface User {
  name: string;
}

export interface Context {
  name: string;
  context: {
    cluster: string;
  };
}

export type CurrentContext = string;

export interface Config {
  clusters: Cluster[];
  users: User[];
  contexts: Context[];
  'current-context': CurrentContext;
}
