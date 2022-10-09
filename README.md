# api-insights-openapi-rulesets

The API Insights OpenAPI ruleset is project to programatically check conformance of API specification against REST API Guidelines. These guidelines are developed and supported as part of [API Insights](https://github.com/cisco-developer/api-insights). 

This module implements set lintable REST API best practices, linter can be used validate API Specs in Swagger2 or OAS3 format. Project implements 2 linter rulesets. 
1. REST Guidelines :  Lintable REST API best practices related to API Design, API implementation, API testing and developer experience.
2. Doc Completeness: set of rules provided to ensure the end user document genrated from API specs are good quality. It includes rules like examples are included for every schema, description provided for every attribute etc. 
For more details on guidelines please refer [guidelines docs](./docs/api-guidelines.md)

These custom rulesets are implemented using [Spectral](https://github.com/stoplightio/spectral) open source linter. 


## Get started

* Install spectral cli globally. Refer to [spectral-cli](https://meta.stoplight.io/docs/spectral/b8391e051b7d8-installation).
```
npm install -g @stoplight/spectral-cli
```
* Install packages.
```
npm install
```
* Run with global cli.
```
spectral lint -r api-insights-openapi-ruleset.js examples/petstore.json
```
* Run with locally installed cli.
```
npx spectral lint -r api-insights-openapi-ruleset.js examples/petstore.json
spectral lint -r completeness.js examples/petstore.json
```
