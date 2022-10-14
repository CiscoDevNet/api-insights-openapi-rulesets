# Release

We use github release to publish a new npm package, and keep the release version same with package version.

## Process

* In Github releases, Create a new release, you can specify tag or add new tag in sematic way, like v0.0.1
* When release is created, it will trigger github action to pushlish the pkg.
* Then you should see the package in github.

If you want to publish manually, you can refer to [this](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)

## How to use this package

* You cannot install the packge directly, you need to specify a token, and change repository url. You can add a `.npmrc` with the following content:
```
registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_PAT
```
* For `YOUR_PAT`, Refer to this [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). And You can only grant package read permission.
* You can then install the package by npm.
