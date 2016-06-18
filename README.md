Hasher
======

Automatic detection of hashing algorithms. This project might be useful to recognize the method used to generate a certain hash, assuming that one knows all its input values.

## Building
To build Hasher, clone the *master* branch of this repository, and do the following:

1. Install Node.js, and install Grunt globally.

2. Install the development and client dependencies with: `npm install`.

3. Finally, build the source with: `grunt build`.

## Deploying
To automatically deploy Hasher to GitHub pages, push the files inside the `dist` folder to the `gh-pages` branch. To automatize this enter the following command in Windows/Powershell:
```
$token = git subtree split --prefix dist master
powershell -command "git push origin $($token):gh-pages --force"
```
or in Linux:
```
git push origin `git subtree split --prefix dist master`:gh-pages --force
```
