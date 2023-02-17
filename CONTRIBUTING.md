# Contributing to api-insights-openapi-rulesets
Thank you for taking time to start contributing! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github
We use github to host code, to track issues and feature requests, as well as accept pull requests.

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Local environment setup

* Install dependencies.
```
npm install
```
* Try the command.
```
npx spectral lint -r documentation.js examples/petstore.json
```
* You should see the linter result.

## How to add/modify linter rule

Suppose you want to add/modify a rule `rule1` in `api-insights-openapi-ruleset.js`:

1. Open issue with proposal for new rules, details of scenario. Once maintainers have reviewed/accepted proposal please proceede to next step. 
2. Write code for it in `api-insights-openapi-ruleset.js` and function if needed.
3. Write test for the code you added.
4. Run test to make sure all passed.
5. Run lint to fix all lint issues.
6. Document this rule in docs, explain its behavior.

## Any contributions you make will be under the Apache License, Version 2
In short, when you submit code changes, your submissions are understood to be under the same [Apache License](LICENSE) that covers the project.
Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](https://wwwin-github.cisco.com/DevNet/api-insights/issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://wwwin-github.cisco.com/DevNet/api-insights/issues).

## Write bug reports with detail, background, and sample code

Please consider to include the following in a bug report:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code/API spec if you can.
- What you expected would happen
- What actually happened
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Use a Consistent Coding Style
There is no strict coding style guideline, but some basic suggestions are:

* Please run eslint lint with rules. `npm run lint`


## License
By contributing, you agree that your contributions will be licensed under its Apache License, Version 2.

## References
This document was adapted from [here](https://gist.github.com/briandk/3d2e8b3ec8daf5a27a62).
