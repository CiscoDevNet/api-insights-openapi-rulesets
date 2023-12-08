# api-insights-openapi-rulesets

The Cisco OpenAPI ruleset is a project to programatically check conformance of API specification against REST API Guidelines. These guidelines are developed and supported as part of Cisco's internal API experience program. 

This module implements a set of lintable REST API best practices, linters can be used validate API Specs in Swagger2 or OAS3 format. The project implements 2 linter rulesets. 
1. REST Guidelines :  Lintable REST API best practices related to API Design, API implementation, API testing and developer experience. For details refer [rest-guidelines.md](docs/rest-guidelines.md)
2. API Contract: Set of rules provided to ensure the API contract is reliable and complete in terms of API metadata, schema definition, operation status code & responses. For details refer to [doc-completeness.md](docs/doc-completeness.md).
3. API Documentation Completeness: Set of rules provided to ensure the end user document generated from API specs is of good quality. It includes rules like description provided for every attribute, examples are included for every schema, etc. For details refer to [doc-completeness.md](docs/doc-completeness.md).

These custom rulesets are implemented using [Spectral](https://github.com/stoplightio/spectral) open source linter. 

Note: In addition to the above rulesets you may want to consider an "Inclusive Language" analyzer. Check the [cisco-open/inclusive-language project](https://github.com/cisco-open/inclusive-language) for a collection of tools and resources for working on eliminating biased language. See also linter projects like [Woke](https://getwoke.tech) and [AlexJS](https://alexjs.com/).

## Installation

```
npm install @cisco-developer/api-insights-openapi-rulesets
```

## Usage

There are two rulesets in this repo, you can choose one of them:
```
api-insights-openapi-ruleset.js
contract.js
documentation.js
```

* If you installed spectral cli globally refer to [spectral-cli](https://meta.stoplight.io/docs/spectral/b8391e051b7d8-installation), you can run:
```
spectral lint -r node_modules/@cisco-developer/api-insights-openapi-rulesets/api-insights-openapi-ruleset.js your-spec.json/yaml
```
* Run with locally installed cli:
```
npx spectral lint -r node_modules/@cisco-developer/api-insights-openapi-rulesets/api-insights-openapi-ruleset.js your-spec.json/yaml
```

Also you can refer to [use npm](https://meta.stoplight.io/docs/spectral/7895ff1196448-sharing-and-distributing-rulesets#npm), define your `.spectral.yaml` like this:
```
extends:
  - "@cisco-developer/api-insights-openapi-rulesets/api-insights-openapi-ruleset.js"
  - "@cisco-developer/api-insights-openapi-rulesets/contract.js"
  - "@cisco-developer/api-insights-openapi-rulesets/documentation.js"
```

## Contributing

If you are interested in this project, check out [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[Apache License 2.0](LICENSE)
