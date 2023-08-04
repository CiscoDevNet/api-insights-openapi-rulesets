/**
 * Copyright 2022 Cisco Systems, Inc. and its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  oas2, oas3,
} from '@stoplight/spectral-formats';
import {
  falsy, length, pattern, truthy,
} from '@stoplight/spectral-functions/dist';
import acceptableAuth from './functions/acceptableAuth.js';
import allOfEnum from './functions/allOfEnum.js';
import anyOfEnum from './functions/anyOfEnum.js';
import checkDateFields from './functions/checkDateFields.js';
import checkEnums from './functions/checkEnums.js';
import checkForMaxParameterLinkHeaderLikely from './functions/checkForMaxParameterLinkHeaderLikely.js';
import checkForMaxParameterLinkHeaderPossible from './functions/checkForMaxParameterLinkHeaderPossible.js';
import checkForSort from './functions/checkForSort.js';
import checkForSortAndOrderParameters from './functions/checkForSortAndOrderParameters.js';
import checkPatchSuccess from './functions/checkPatchSuccess.js';
import checkPathBasedVersioning from './functions/checkPathBasedVersioning.js';
import checkPluralRepresentationFields from './functions/checkPluralRepresentationFields.js';
import checkPutSuccess from './functions/checkPutSuccess.js';
import checkRFC5322RegexCompliance from './functions/checkRFC5322RegexCompliance.js';
import correctResponseRange from './functions/correctResponseRange.js';
import deepCheck from './functions/deepCheck.js';
import fieldNamesPasCamelCase from './functions/fieldNamesPasCamelCase.js';
import hasErrorIdentifier from './functions/hasErrorIdentifier.js';
import hasErrorMessage from './functions/hasErrorMessage.js';
import hasRecommendedStatusCodes from './functions/hasRecommendedStatusCodes.js';
import headOperationsContainHeadersFromGet from './functions/headOperationsContainHeadersFromGet.js';
import noCrudVerbs from './functions/noCrudVerbs.js';
import reasonPhrases from './functions/reasonPhrases.js';
import resourcePasCamelCase from './functions/resourcePasCamelCase.js';
import verifyResourceLength from './functions/verifyResourceLength.js';
export default {
  extends: [],
  rules: {
    'oas3-jwt-format': {
      'description': "My API access tokens are passed via the HTTP 'Authorization' header, with a 'Bearer' prefix.",
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.components.securitySchemes.[?(@.type === 'http' && @.scheme === 'bearer')]",
      'then': [
        {
          'field': 'bearerFormat',
          'function': truthy,
        },
        {
          'field': 'bearerFormat',
          'function': pattern,
          'functionOptions': {
            'match': '/^jwt$/i',
          },
        },
      ],
    },
    'delete-204-success': {
      'description': "DELETE operations return '204 No Content' on success.",
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': "$.paths.*[?( @property === 'delete' )].responses",
      'then': {
        'field': '204',
        'function': truthy,
      },
    },
    'patch-200-204-success': {
      'description': "PATCH operations return either '200 OK' with full representation or '204 No Content'.",
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': "$.paths.*[?( @property === 'patch' )]",
      'then': {
        'function': checkPatchSuccess,
      },
    },
    'put-200-204-success': {
      'description': "PUT operations return either '200 OK' with full representation or '204 No Content'.",
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths.*[?( @property === \'put\' )]',
      'then': {
        'function': checkPutSuccess,
      },
    },
    'resource-pas-camel-case-info': {
      'description': 'Resource names use PasCamelCase.',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths[*]~',
      'then': {
        'function': resourcePasCamelCase,
        'functionOptions': {
          'substring': 'leading',
        },
      },
    },
    'resource-pas-camel-case-error': {
      'description': 'Resource names use PasCamelCase.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths[*]~',
      'then': {
        'function': resourcePasCamelCase,
        'functionOptions': {
          'substring': 'last',
        },
      },
    },
    'status-codes-in-2xx-3xx-4xx-5xx': {
      'description': 'API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': "$.paths.*[?( @property === 'get' || @property === 'put' || @property === 'post' || @property === 'delete' || @property === 'options' || @property === 'head' || @property === 'patch' || @property === 'trace' )]",
      'then': {
        'field': 'responses',
        'function': correctResponseRange,
        'functionOptions': {
          'rangeString': '2xx/3xx/4xx/5xx',
          'validRanges': [
            {
              'start': 200,
              'stop': 299,
            },
            {
              'start': 300,
              'stop': 399,
            },
            {
              'start': 400,
              'stop': 499,
            },
            {
              'start': 500,
              'stop': 599,
            },
          ],
        },
      },
    },
    'status-codes-in-2xx-4xx-5xx': {
      'description': 'API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': "$.paths.*[?( @property === 'get' || @property === 'put' || @property === 'post' || @property === 'delete' || @property === 'options' || @property === 'head' || @property === 'patch' || @property === 'trace' )]",
      'then': {
        'field': 'responses',
        'function': correctResponseRange,
        'functionOptions': {
          'rangeString': '2xx/4xx/5xx',
          'validRanges': [
            {
              'start': 200,
              'stop': 299,
            },
            {
              'start': 400,
              'stop': 499,
            },
            {
              'start': 500,
              'stop': 599,
            },
          ],
        },
      },
    },
    'post-header': {
      'description': 'POST operations that create resources should include a Location header.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths.*.post.responses[?( /^201$/i.test(@property) )]',
      'then': {
        'field': 'headers',
        'function': truthy,
      },
    },
    'post-header-location': {
      'description': 'POST operations that create resources should include a Location header.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths.*.post.responses[?( /^201$/i.test(@property) )].headers',
      'then': {
        'field': 'Location',
        'function': truthy,
      },
    },
    'oas2-post-201-created': {
      'description': 'POST operations which create objects return 201 Created, with a full or reference-only representation.',
      'message': '{{description}}; {{error}}',
      'formats': [oas2],
      'severity': 'error',
      'given': '$.paths.*.post.responses.201',
      'then': [
        {
          'field': 'schema',
          'function': truthy,
        },
      ],
    },
    'oas3-post-201-created': {
      'description': 'POST operations which create objects return 201 Created, with a full or reference-only representation.',
      'message': '{{description}}; {{error}}',
      'formats': [oas3],
      'severity': 'error',
      'given': '$.paths.*.post.responses.201',
      'then': [
        {
          'field': 'content',
          'function': truthy,
        },
      ],
    },
    'oas2-application-json-charset-utf8-required': {
      'description': "JSON representations should be declared using 'application/json' or 'application/json; charset=UTF-8' media types.",
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': '$.paths.*.*[produces,consumes].*',
      'then': {
        'function': pattern,
        'functionOptions': {
          'notMatch': '^application/json; charset=(?![Uu][Tt][Ff]-8$)',
        },
      },
    },
    'oas3-application-json-charset-utf8-required': {
      'description': "JSON representations should be declared using 'application/json' or 'application/json; charset=UTF-8' media types.",
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': '$.paths.*.*.responses[*].content[*]~',
      'then': {
        'function': pattern,
        'functionOptions': {
          'notMatch': '^application/json; charset=(?![Uu][Tt][Ff]-8$)',
        },
      },
    },
    'date-response-header-requirement': {
      'description': "All responses include a 'Date' header in the GMT timezone and RFC 5322 format.",
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths.*.*.responses[*]',
      'then': {
        'function': deepCheck,
        'functionOptions': {
          'prerequisite': 'headers',
          'search': 'Date',
        },
      },
    },
    'date-response-header-format-pattern-requirement': {
      'description': "All responses include a 'Date' header in the GMT timezone and RFC 5322 format.",
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths.*.*.responses[*].headers.Date.schema',
      'then': [
        {
          'field': 'format',
          'function': falsy,
        },
        {
          'field': 'pattern',
          'function': truthy,
        },
      ],
    },
    'date-response-header-regex-check': {
      'description': "All responses include a 'Date' header in the GMT timezone and RFC 5322 format.",
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths.*.*.responses[*].headers.Date.schema',
      'then': {
        'field': 'pattern',
        'function': checkRFC5322RegexCompliance,
      },
    },
    'head-operations-match-headers-with-get': {
      'description': 'HEAD operations must return response headers identical to the corresponding GET.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths[?( @.get && @.head )]',
      'then': {
        'function': headOperationsContainHeadersFromGet,
      },
    },
    'oas2-head-operations-no-body': {
      'description': 'HEAD operations with a corresponding GET operation must return no body content.',
      'message': '{{description}}; {{error}}',
      'formats': [oas2],
      'severity': 'error',
      'given': '$.paths[?( @.get && @.head )].head.responses.*',
      'then': {
        'field': 'schema',
        'function': falsy,
      },
    },
    'oas3-head-operations-no-body': {
      'description': 'HEAD operations with a corresponding GET operation must return no body content.',
      'message': '{{description}}; {{error}}',
      'formats': [oas3],
      'severity': 'error',
      'given': '$.paths[?( @.get && @.head )].head.responses.*',
      'then': {
        'field': 'content',
        'function': falsy,
      },
    },
    'oas2-field-names-pas-camel-case': {
      'description': 'Representation field names use PasCamelCase.',
      'message': '{{description}}; {{error}}',
      'formats': [oas2],
      'severity': 'error',
      'given': [
        '$.paths.*.*.responses.*.schema..[*]~',
        '$.paths.*.*.parameters.*.schema..[*]~',
        '$.paths.*.*.parameters.*',
      ],
      'then': {
        'function': fieldNamesPasCamelCase,
      },
    },
    'oas3-field-names-pas-camel-case': {
      'description': 'Representation field names use PasCamelCase.',
      'message': '{{description}}; {{error}}',
      'formats': [oas3],
      'severity': 'error',
      'given': [
        '$.paths.*.*.responses.*.content.*.schema..[*]~',
        '$.paths.*.*.requestBody.content.*.*..[*]~',
        '$.paths.*.*.parameters.*',
      ],
      'then': {
        'function': fieldNamesPasCamelCase,
      },
    },
    'tracking-id-header-requirement': {
      'description': "All responses must include a 'TrackingID' header.",
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths.*.*.responses[*]',
      'then': {
        'function': deepCheck,
        'functionOptions': {
          'prerequisite': ['headers'],
          'search': 'TrackingID',
        },
      },
    },
    'oas2-tracking-id-header-string-requirement': {
      'description': "'TrackingID' header should be a string in order to accommodate a UUID.",
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths.*.*.responses[*].headers[?( /^trackingid$/i.test(@property) )]',
      'then': {
        'field': 'type',
        'function': pattern,
        'functionOptions': {
          'match': '^string$',
        },
      },
    },
    'oas3-tracking-id-header-string-requirement': {
      'description': "'TrackingID' header should be a string in order to accommodate a UUID.",
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths.*.*.responses[*].headers[?( /^trackingid$/i.test(@property) )].schema',
      'then': {
        'field': 'type',
        'function': pattern,
        'functionOptions': {
          'match': '^string$',
        },
      },
    },
    'oas2-collections-returned-as-arrays': {
      'description': "Collections are returned as arrays encapsulated with a named field such as 'items'.",
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths.*.*.responses.*.schema',
      'formats': [oas2],
      'then': {
        'field': 'type',
        'function': pattern,
        'functionOptions': {
          'notMatch': '^array$',
        },
      },
    },
    'oas3-collections-returned-as-arrays': {
      'description': "Collections are returned as arrays encapsulated with a named field such as 'items'.",
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths.*.*.responses.*.content[*].schema',
      'formats': [oas3],
      'then': {
        'field': 'type',
        'function': pattern,
        'functionOptions': {
          'notMatch': '^array$',
        },
      },
    },
    'oas2-no-boolean-string-enums': {
      'description': 'Representation fields use format-native true/false values for booleans.',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': "$.paths.*.*.responses.*.schema..[?(@ && @.type === 'string' && @.enum )]",
      'formats': [oas2],
      'then': {
        'field': 'enum',
        'function': checkEnums,
        'functionOptions': {
          'caseSensitive': false,
          'enums': [
            [
              'yes',
              'no',
            ],
            [
              'on',
              'off',
            ],
            [
              'true',
              'false',
            ],
          ],
          'shouldMatch': false,
        },
      },
    },
    'oas3-no-boolean-string-enums': {
      'description': 'Representation fields use format-native true/false values for booleans.',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': "$.paths.*.*.responses.*.content.*.schema..[?(@ && @.type === 'string' && @.enum )]",
      'formats': [oas3],
      'then': {
        'field': 'enum',
        'function': checkEnums,
        'functionOptions': {
          'caseSensitive': false,
          'enums': [
            [
              'yes',
              'no',
            ],
            [
              'on',
              'off',
            ],
            [
              'true',
              'false',
            ],
          ],
          'shouldMatch': false,
        },
      },
    },
    'etag-header-match-required': {
      'description': 'In cases where ETag is supported, such resources should also support If-Match and If-None-Match request headers.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths.*.*.responses[?(@.headers && @.headers.ETag)].headers',
      'then': [
        {
          'field': 'If-Match',
          'function': truthy,
        },
        {
          'field': 'If-None-Match',
          'function': truthy,
        },
      ],
    },
    'no-etag-cache-control-header-required': {
      'description': 'Where caching is not appropriate, operations must include a Cache-Control header (e.g. max-age=0, no-cache, no-store, must-revalidate) and must not include an ETag header.',
      'message': '{{description}}; {{error}}',
      'severity': 'hint',
      'given': '$.paths.*.*.responses[?( !(@.headers && @.headers.ETag) )].headers',
      'then': {
        'field': 'Cache-Control',
        'function': truthy,
      },
    },
    'oas2-order-parameter-asc-desc': {
      'description': "Ordering collections is designed with an 'order' query parameter specifying 'asc' or 'desc'.",
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'formats': [oas2],
      'given': "$.paths.*.get.parameters[?( @.in === 'query' && @.name === 'order' )]",
      'then': [
        {
          'field': 'type',
          'function': pattern,
          'functionOptions': {
            'match': '^string$',
          },
        },
        {
          'field': 'enum',
          'function': checkEnums,
          'functionOptions': {
            'enums': [
              [
                'asc',
                'desc',
              ],
            ],
            'shouldMatch': true,
          },
        },
      ],
    },
    'oas3-order-parameter-asc-desc': {
      'description': "Ordering collections is designed with an 'order' query parameter specifying 'asc' or 'desc'.",
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'formats': [oas3],
      'given': "$.paths.*.get.parameters[?( @.in === 'query' && @.name === 'order' )].schema",
      'then': [
        {
          'field': 'type',
          'function': pattern,
          'functionOptions': {
            'match': '^string$',
          },
        },
        {
          'field': 'enum',
          'function': checkEnums,
          'functionOptions': {
            'enums': [
              [
                'asc',
                'desc',
              ],
            ],
            'shouldMatch': true,
          },
        },
      ],
    },
    'no-crud-verbs': {
      'description': 'Standard CRUD lifecycle operations map to HTTP verbs; Functional resources are used when non-standard CRUD are needed.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths[*~]',
      'then': {
        'function': noCrudVerbs,
      },
    },
    'respond-with-recommended-get-codes': {
      'description': 'My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': "$.paths.*.[?(@property === 'get')].responses.*~",
      'then': [
        {
          'function': hasRecommendedStatusCodes,
          'functionOptions': {
            'method': 'get',
          },
        },
      ],
    },
    'respond-with-recommended-post-codes': {
      'description': 'My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': "$.paths.*.[?(@property === 'post')].responses.*~",
      'then': [
        {
          'function': hasRecommendedStatusCodes,
          'functionOptions': {
            'method': 'post',
          },
        },
      ],
    },
    'respond-with-recommended-patch-codes': {
      'description': 'My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': "$.paths.*.[?(@property === 'patch')].responses.*~",
      'then': [
        {
          'function': hasRecommendedStatusCodes,
          'functionOptions': {
            'method': 'patch',
          },
        },
      ],
    },
    'respond-with-recommended-put-codes': {
      'description': 'My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': "$.paths.*.[?(@property === 'put')].responses.*~",
      'then': [
        {
          'function': hasRecommendedStatusCodes,
          'functionOptions': {
            'method': 'put',
          },
        },
      ],
    },
    'respond-with-recommended-delete-codes': {
      'description': 'My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': "$.paths.*.[?(@property === 'delete')].responses.*~",
      'then': [
        {
          'function': hasRecommendedStatusCodes,
          'functionOptions': {
            'method': 'delete',
          },
        },
      ],
    },
    'sort-recommend-order': {
      'description': "Consider using 'order' with 'sort' in this operation.",
      'message': '{{description}}; {{error}}',
      'severity': 'hint',
      'given': '$.paths.*.get.parameters',
      'then': {
        'function': checkForSortAndOrderParameters,
      },
    },
    'oas2-error-message': {
      'description': 'Error representations include a useful human-readable message.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': "$.paths.*[?(@property != 'head')].responses[?(/^4\\d\\d.*$/i.test(@property) || /^5\\d\\d.*$/i.test(@property))]",
      'then': [
        {
          'function': hasErrorMessage,
        },
      ],
    },
    'oas3-error-message': {
      'description': 'Error representations include a useful human-readable message.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.paths.*[?(@property != 'head')].responses[?(/^4\\d\\d.*$/i.test(@property) || /^5\\d\\d.*$/i.test(@property))]",
      'then': [
        {
          'function': hasErrorMessage,
        },
      ],
    },
    'oas2-error-response-identifier': {
      'description': 'Error representations include an identifier to help with troubleshooting.',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': "$.paths.*[?(@property !== 'head')].responses[?(/^4\\d\\d.*$/i.test(@property) || /^5\\d\\d.*$/i.test(@property))]",
      'formats': [oas2],
      'then': [
        {
          'function': hasErrorIdentifier,
        },
      ],
    },
    'oas3-error-response-identifier': {
      'description': 'Error representations include an identifier to help with troubleshooting.',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': "$.paths.*[?(@property !== 'head')].responses[?(/^4\\d\\d.*$/i.test(@property) || /^5\\d\\d.*$/i.test(@property))]",
      'formats': [oas3],
      'then': [
        {
          'function': hasErrorIdentifier,
        },
      ],
    },
    'oas2-request-header-date-correct-type': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': "$.paths.*.*.parameters[?( /^Date$/i.test(@.name) && @.in === 'header' )]",
      'then': [
        {
          'field': 'type',
          'function': pattern,
          'functionOptions': {
            'match': '^string$',
          },
        },
        {
          'field': 'format',
          'function': falsy,
        },
        {
          'field': 'pattern',
          'function': truthy,
        },
      ],
    },
    'oas2-request-header-date-correct-regex': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': "$.paths.*.*.parameters[?( /^Date$/i.test(@.name) && @.in === 'header' )]",
      'then': {
        'field': 'pattern',
        'function': checkRFC5322RegexCompliance,
      },
    },
    'oas2-request-header-accept-language-enum': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': "$.paths.*.*.parameters[?( /^Accept-Language$/i.test(@.name) && @.in === 'header' )]",
      'then': {
        'field': 'enum',
        'function': truthy,
      },
    },
    'oas2-request-header-accept-encoding-enum': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': "$.paths.*.*.parameters[?( /^Accept-Encoding$/i.test(@.name) && @.in === 'header' )]",
      'then': {
        'field': 'enum',
        'function': truthy,
      },
    },
    'oas2-request-header-accept-encoding-valid-enum': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': "$.paths.*.*.parameters[?( /^Accept-Encoding$/i.test(@.name) && @.in === 'header' )]",
      'then': {
        'field': 'enum',
        'function': anyOfEnum,
        'functionOptions': {
          'values': [
            'aes128gcm',
            'br',
            'compress',
            'deflate',
            'exi',
            'gzip',
            'identity',
            'pack200-gzip',
            'zstd',
          ],
        },
      },
    },
    'oas2-request-header-accept-charset-default-required': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': "$.paths.*.*.parameters[?( /^Accept-Charset$/i.test(@.name) && @.in === 'header' )]",
      'then': {
        'field': 'default',
        'function': truthy,
      },
    },
    'oas2-request-header-accept-charset-valid-default': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': "$.paths.*.*.parameters[?( /^Accept-Charset$/i.test(@.name) && @.in === 'header' )]",
      'then': {
        'field': 'default',
        'function': pattern,
        'functionOptions': {
          'match': '^[Uu][Tt][Ff]-8$',
        },
      },
    },
    'oas2-request-header-accept-charset-enum-required': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': "$.paths.*.*.parameters[?( /^Accept-Charset$/i.test(@.name) && @.in === 'header' )]",
      'then': {
        'field': 'enum',
        'function': truthy,
      },
    },
    'oas2-request-header-accept-charset-valid-enum': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': "$.paths.*.*.parameters[?( /^Accept-Charset$/i.test(@.name) && @.in === 'header' )]",
      'then': {
        'field': 'enum',
        'function': allOfEnum,
        'functionOptions': {
          'values': [
            'UTF-8',
            'ISO-8859-1',
          ],
        },
      },
    },
    'oas2-request-header-if-match-is-string': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': "$.paths.*.*.parameters[?( /^If-Match$/i.test(@.name) && @.in === 'header' )]",
      'then': {
        'field': 'type',
        'function': pattern,
        'functionOptions': {
          'match': '^string$',
        },
      },
    },
    'oas2-request-header-if-none-match-is-string': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': "$.paths.*.*.parameters[?( /^If-None-Match$/i.test(@.name) && @.in === 'header' )]",
      'then': {
        'field': 'type',
        'function': pattern,
        'functionOptions': {
          'match': '^string$',
        },
      },
    },
    'oas2-request-header-if-range-is-string': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': "$.paths.*.*.parameters[?( /^If-Range$/i.test(@.name) && @.in === 'header' )]",
      'then': {
        'field': 'type',
        'function': pattern,
        'functionOptions': {
          'match': '^string$',
        },
      },
    },
    'oas3-request-header-date-correct-type': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.paths.*.*.parameters[?( /^Date$/i.test(@.name) && @.in === 'header' )].schema",
      'then': [
        {
          'field': 'type',
          'function': pattern,
          'functionOptions': {
            'match': '^string$',
          },
        },
        {
          'field': 'format',
          'function': falsy,
        },
        {
          'field': 'pattern',
          'function': truthy,
        },
      ],
    },
    'oas3-request-header-date-correct-regex': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.paths.*.*.parameters[?( /^date$/i.test(@.name) && @.in === 'header' )].schema",
      'then': {
        'field': 'pattern',
        'function': checkRFC5322RegexCompliance,
      },
    },
    'oas3-request-header-accept-language-enum': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.paths.*.*.parameters[?( /^Accept-Language$/i.test(@.name) && @.in === 'header' )].schema",
      'then': {
        'field': 'enum',
        'function': truthy,
      },
    },
    'oas3-request-header-accept-encoding-enum': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.paths.*.*.parameters[?( /^Accept-Encoding$/i.test(@.name) && @.in === 'header' )].schema",
      'then': {
        'field': 'enum',
        'function': truthy,
      },
    },
    'oas3-request-header-accept-encoding-valid-enum': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.paths.*.*.parameters[?( /^Accept-Encoding$/i.test(@.name) && @.in === 'header' )].schema",
      'then': {
        'field': 'enum',
        'function': anyOfEnum,
        'functionOptions': {
          'values': [
            'aes128gcm',
            'br',
            'compress',
            'deflate',
            'exi',
            'gzip',
            'identity',
            'pack200-gzip',
            'zstd',
          ],
        },
      },
    },
    'oas3-request-header-accept-charset-default-required': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.paths.*.*.parameters[?( /^Accept-Charset$/i.test(@.name) && @.in === 'header' )].schema",
      'then': {
        'field': 'default',
        'function': truthy,
      },
    },
    'oas3-request-header-accept-charset-valid-default': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.paths.*.*.parameters[?( /^Accept-Charset$/i.test(@.name) && @.in === 'header' )].schema",
      'then': {
        'field': 'default',
        'function': pattern,
        'functionOptions': {
          'match': '^[Uu][Tt][Ff]-8$',
        },
      },
    },
    'oas3-request-header-accept-charset-enum-required': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.paths.*.*.parameters[?( /^Accept-Charset$/i.test(@.name) && @.in === 'header' )].schema",
      'then': {
        'field': 'enum',
        'function': truthy,
      },
    },
    'oas3-request-header-accept-charset-valid-enum': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.paths.*.*.parameters[?( /^Accept-Charset$/i.test(@.name) && @.in === 'header' )].schema",
      'then': {
        'field': 'enum',
        'function': allOfEnum,
        'functionOptions': {
          'values': [
            'UTF-8',
            'ISO-8859-1',
          ],
        },
      },
    },
    'oas3-request-header-if-match-is-string': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.paths.*.*.parameters[?( /^If-Match$/i.test(@.name) && @.in === 'header' )].schema",
      'then': {
        'field': 'type',
        'function': pattern,
        'functionOptions': {
          'match': '^string$',
        },
      },
    },
    'oas3-request-header-if-none-match-is-string': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.paths.*.*.parameters[?( /^If-None-Match$/i.test(@.name) && @.in === 'header' )].schema",
      'then': {
        'field': 'type',
        'function': pattern,
        'functionOptions': {
          'match': '^string$',
        },
      },
    },
    'oas3-request-header-if-range-is-string': {
      'description': 'HTTP headers follow the syntax specified in the corresponding RFCs.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': "$.paths.*.*.parameters[?( /^If-Range$/i.test(@.name) && @.in === 'header' )].schema",
      'then': {
        'field': 'type',
        'function': pattern,
        'functionOptions': {
          'match': '^string$',
        },
      },
    },
    'oas2-path-based-versioning-error': {
      'description': 'API uses path-based versioning.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': '$',
      'then': {
        'function': checkPathBasedVersioning,
        'functionOptions': {
          'onlyMajor': false,
          'specVersion': 'oas2',
        },
      },
    },
    'oas3-path-based-versioning-error': {
      'description': 'API uses path-based versioning.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': '$',
      'then': {
        'function': checkPathBasedVersioning,
        'functionOptions': {
          'onlyMajor': false,
          'specVersion': 'oas3',
        },
      },
    },
    'path-based-versioning-warn': {
      'description': 'Versioning should not be done in endpoint path.',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths.*~',
      'then': {
        'function': pattern,
        'functionOptions': {
          'notMatch': 'v[0-9]+',
        },
      },
    },
    'oas2-path-based-versioning-major-only': {
      'description': 'API shows only major version numbers on the path; not the revision numbers.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': '$',
      'then': {
        'function': checkPathBasedVersioning,
        'functionOptions': {
          'onlyMajor': true,
          'specVersion': 'oas2',
        },
      },
    },
    'oas3-path-based-versioning-major-only': {
      'description': 'API shows only major version numbers on the path; not the revision numbers.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': '$',
      'then': {
        'function': checkPathBasedVersioning,
        'functionOptions': {
          'onlyMajor': true,
          'specVersion': 'oas3',
        },
      },
    },
    'oas2-get-collection-max-parameter-link-header-required-possible': {
      'description': "Pagination is designed using a 'max' query parameter and 'Link' headers per RFC 5988.",
      'formats': [oas2],
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths[?( !(/\\/{.*}$/.test(@property)) )].get',
      'then': {
        'function': checkForMaxParameterLinkHeaderPossible,
      },
    },
    'oas3-get-collection-max-parameter-link-header-required-possible': {
      'description': "Pagination is designed using a 'max' query parameter and 'Link' headers per RFC 5988.",
      'formats': [oas3],
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths[?( !(/\\/{.*}$/.test(@property)) )].get',
      'then': {
        'function': checkForMaxParameterLinkHeaderPossible,
      },
    },
    'oas2-get-collection-max-parameter-link-header-required-likely': {
      'description': "Pagination is designed using a 'max' query parameter and 'Link' headers per RFC 5988.",
      'formats': [oas2],
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths[?( !(/\\/{.*}$/.test(@property)) )].get',
      'then': {
        'function': checkForMaxParameterLinkHeaderLikely,
      },
    },
    'oas3-get-collection-max-parameter-link-header-required-likely': {
      'description': "Pagination is designed using a 'max' query parameter and 'Link' headers per RFC 5988.",
      'formats': [oas3],
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths[?( !(/\\/{.*}$/.test(@property)) )].get',
      'then': {
        'function': checkForMaxParameterLinkHeaderLikely,
      },
    },
    'oas2-https-only': {
      'description': 'My API supports HTTPS only.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': '$.schemes.*',
      'then': {
        'function': pattern,
        'functionOptions': {
          'match': '^https$',
        },
      },
    },
    'oas3-https-only': {
      'description': 'My API supports HTTPS only.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': '$.servers.*',
      'then': {
        'field': 'url',
        'function': pattern,
        'functionOptions': {
          'match': '^https://',
        },
      },
    },
    'oas2-acceptable-auth': {
      'description': 'My API authenticates requests using access tokens; NOT username/passwords.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': '$.securityDefinitions.*',
      'then': {
        'function': acceptableAuth,
      },
    },
    'oas3-acceptable-auth': {
      'description': 'My API authenticates requests using access tokens; NOT username/passwords.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': '$.components.securitySchemes.*',
      'then': {
        'function': acceptableAuth,
      },
    },
    'resource-name-too-long': {
      'description': 'Resource names are consistent and succinct; do not use abbreviations.',
      'message': '{{description}}; {{error}}',
      'severity': 'info',
      'given': '$.paths[*]~',
      'then': {
        'function': verifyResourceLength,
        'functionOptions': {
          'maxLength': 15,
        },
      },
    },
    'oas2-get-collection-sort-parameter': {
      'description': "Sorting collections is designed with a 'sort' query parameter.",
      'formats': [oas2],
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths[?( !(/\\/{.*}$/.test(@property)) )].get',
      'then': {
        'function': checkForSort,
      },
    },
    'oas3-get-collection-sort-parameter': {
      'description': "Sorting collections is designed with a 'sort' query parameter.",
      'formats': [oas3],
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths[?( !(/\\/{.*}$/.test(@property)) )].get',
      'then': {
        'function': checkForSort,
      },
    },
    'status-code-401': {
      'description': 'A 401 status code is returned when authentication fails.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths.*[?(@.security && @.security.length)]',
      'then': [
        {
          'field': 'responses',
          'function': deepCheck,
          'functionOptions': {
            'search': 401,
          },
        },
      ],
    },
    'status-code-403': {
      'description': 'A 403 status code is returned if a consumer is not authorized to access an operation.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths.*[?(@.security && @.security.length)]',
      'then': [
        {
          'field': 'responses',
          'function': deepCheck,
          'functionOptions': {
            'search': 403,
          },
        },
      ],
    },
    'oas2-array-plural-representation': {
      'description': 'Representation fields use plural noun names for collections.',
      'formats': [oas2],
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths.*.*.responses.*.schema',
      'then': {
        'function': checkPluralRepresentationFields,
      },
    },
    'oas3-array-plural-representation': {
      'description': 'Representation fields use plural noun names for collections.',
      'formats': [oas3],
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths.*.*.responses.*.content.*.schema',
      'then': {
        'function': checkPluralRepresentationFields,
      },
    },
    'oas2-date-fields-iso-format': {
      'description': "Representation fields use strings in 'iso-date-time' format (RFC-3339) for date/time.",
      'formats': [oas2],
      'message': '{{description}}; {{error}}',
      'severity': 'info',
      'given': '$.paths.*.*.responses.*.schema',
      'then': {
        'function': checkDateFields,
      },
    },
    'oas3-date-fields-iso-format': {
      'description': "Representation fields use strings in 'iso-date-time' format (RFC-3339) for date/time.",
      'formats': [oas3],
      'message': '{{description}}; {{error}}',
      'severity': 'info',
      'given': '$.paths.*.*.responses.*.content.*.schema',
      'then': {
        'function': checkDateFields,
      },
    },
    'authenticate-requests': {
      'description': 'API.REST.SECURITY.03: My API authenticates and authorizes all requests',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths.*.*',
      'then': [
        {
          'field': 'security',
          'function': truthy,
        },
        {
          'field': 'security',
          'function': length,
          'functionOptions': {
            'min': 1,
          },
        },
      ],
    },
    'reason-phrase': {
      'description': 'Reason phrase needs to match',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths.*.*.responses.*.description',
      'then': [
        {
          'function': reasonPhrases,
          'functionOptions': {
            'caseSensitive': true,
          },
        },
      ],
    },
  },
};
