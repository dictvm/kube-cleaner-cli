## Kube-Cleaner

`kube-cleaner` is a utility to keep your kubectl config-file in check.

Let's say you're using `kops` to manage Kubernetes clusters on AWS. You're not
upgrading your clusters in-place but instead, you replace your clusters
regularly. By doing so, your clusters get a new name for each major update.

If you do this for a couple of Kubernetes releases, you will end up with a lot
of clusters in your `kubectl` config. Of course you can
(manually clean them up)[https://stackoverflow.com/questions/37016546/how-do-i-delete-clusters-and-contexts-from-kubectl-config] or open your `$HOME/.kube/config` in your text editor, but you're not from the stone age, are you?

Here `kube-cleaner` comes to your rescue!

### Install

`yarn global add kube-cleaner`

or

`npm install -g kube-cleaner`

This assumes your yarn/npm-PATH's are setup correctly. Please refer to their
docs if `kube-cleaner` is not an available command after installation.
