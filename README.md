## Kubernetes Config File cleanup CLI tool

`kube-cleaner-cli` is a utility to keep your kubectl config-file in check.

Let's say you're using `kops` to manage Kubernetes clusters on AWS. You're not
upgrading your clusters in-place but instead, you replace your clusters
regularly. Maybe you've moved from `minikube` to Docker's Docker for Desktop. Or
you're setting up lots of clusters for clients that you don't need anymore after the contract is done.

There are several valid reasons for your `kubectl` config to grow.

Of course you can [manually clean them up](https://stackoverflow.com/questions/37016546/how-do-i-delete-clusters-and-contexts-from-kubectl-config) or open `$HOME/.kube/config` in your text editor and edit `YAML` by hand, but you're not from the stone age, are you?

`kube-cleaner` makes it easy to keep track of your clusters, users and contexts
and to delete them, as soon as you no longer need them.

![screenshot showing first output of the applicaton](docs/first.png 'first screenshot')

![screenshot showing second output of the applicaton](docs/second.png 'second screenshot')

### Install

`yarn global add kube-cleaner`

or

`npm install -g kube-cleaner`

This assumes your yarn/npm-`PATH` is setup correctly. Please refer to their
docs if `kube-cleaner` is not an available command after installation.
