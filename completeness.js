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
import { oas } from '@stoplight/spectral-rulesets';
import completedSchema from './functions/completedSchema.js';
import ensureExamples from './functions/ensureExamples.js';
import ensureField from './functions/ensureField.js';
import ensureVersion from './functions/ensureVersion.js';
import includeAll from './functions/includeAll.js';
import keyMatchAnyPattern from './functions/keyMatchAnyPattern.js';
export default {
  'extends': [
    [
      oas,
      'off',
    ],
  ],
  'rules': {
    'oas3-schema': true,
    'oas2-schema': true,
    'info-contact': true,
    'info-description': true,
    'info-license': true,
    'license-url': true,
    'oas3-missing-schema-defination': {
      'description': 'There is no schema attribute for a component.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': [
        '$.paths.*.*.responses[?(@property != 204)].content[*]',
        '$.*.*.*.*.*.headers[*]',
        '$.*.*.*.parameters[*]',
      ],
      'then': {
        'function': ensureField,
        'functionOptions': {
          'field': 'schema',
        },
      },
    },
    'oas2-missing-schema-defination': {
      'description': 'There is no schema attribute for a component.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': [
        '$.*.*.responses[?(@property != 204)]',
        "$.*.*.*.parameters[?(@ != null && @.in === 'body')]",
      ],
      'then': {
        'function': ensureField,
        'functionOptions': {
          'field': 'schema',
        },
      },
    },
    'general-schema-defination': {
      'description': 'Some of the defined schema use object as a final field when describing their object structure.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': [
        '$..headers..[?(@ && @.schema)].schema',
        '$..parameters..[?(@ && @.schema)].schema',
        '$..content..[?(@ && @.schema)].schema',
        '$..responses..[?(@ && @.schema)].schema',
      ],
      'then': [
        {
          'function': completedSchema,
        },
      ],
    },
    'oas3-missing-returned-representation': {
      'description': '2XX (except 204) and 4xx responses must have a response schema defined.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': ['$.paths.*.*.responses[?(@property.match(/^[24]\\d{2}$/i) && @property!=204)].content[*]'],
      'then': {
        'function': ensureField,
        'functionOptions': {
          'field': 'schema',
        },
      },
    },
    'oas2-missing-returned-representation': {
      'description': 'MRR – Missing Returned Representation. 2XX (except 204) and 4xx responses must have a response schema defined',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': ['$.paths.*.*.responses[?(@property.match(/^[24]\\d{2}$/i) && @property!=204 )]'],
      'then': {
        'function': ensureField,
        'functionOptions': {
          'field': 'schema',
        },
      },
    },
    'success-status-code': {
      'description': 'For every operation in the OAS document, there should be at least one success status code defined.  A successful status code is in the 1xx, 2xx or 3xx range series, and generally a 200, 201 or 204.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths.*.*.responses',
      'then': {
        'function': keyMatchAnyPattern,
        'functionOptions': {
          'patterns': ['/^([123]\\d{2}|default)$/'],
        },
      },
    },
    'error-status-code': {
      'description': 'There should be at least one error status code either 4xx or 5xx.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': '$.paths.*.*.responses',
      'then': {
        'function': keyMatchAnyPattern,
        'functionOptions': {
          'patterns': [
            '/^4\\d{2}$/',
            '/^5\\d{2}$/',
            '/^default$/',
          ],
        },
      },
    },
    'description-for-every-attribute': {
      'description': 'DEA - Descriptions for Every Attribute',
      'message': 'For every attribute that is present in the OAS document, if a description is proposed as optional to complement that attribute, then yes it must be present; {{error}}',
      'severity': 'error',
      'given': [
        '$.tags[*]',
        '$.info',
        '$.server',
        '$.externalDocs',
        '$.paths.*.*.parameters.*',
        '$.paths.*.*.requestBody',
        '$.paths.*.*.responses.*',
        '$.paths.*.*.examples.*',
        '$.paths.*.*.responses.links.*',
        '$.*.securitySchemes.*',
        '$.securityDefinitions.*',
      ],
      'then': {
        'function': ensureField,
        'functionOptions': {
          'field': 'description',
        },
      },
    },
    'oas-version': {
      'description': 'The document must be specify the OAS version it is supporting.',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$',
      'then': {
        'function': ensureVersion,
      },
    },
    'oas2-meta-info': {
      'description': 'The following fields must be present (note',
      'message': '{{description}} {{error}}',
      'severity': 'warn',
      'formats': [oas2],
      'type': 'validation',
      'given': '$',
      'then': {
        'function': includeAll,
        'functionOptions': {
          'values': [
            'info',
            'swagger',
            'info.title',
            'info.version',
            'basePath',
            'consumes',
            'securityDefinitions',
          ],
        },
      },
    },
    'examples-for-every-schema': {
      'description': 'For every schema provided in the OAS document, at least one example must be present',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': [
        '$.paths.*.*.*.*.content[?(@.schema)]',
        '$.paths.*.*.*.content[?(@.schema)]',
        '$.paths.*.*.responses[*].headers[?(@.schema)]',
        '$.paths.*.*.parameters[?(@.schema)]',
        '$.paths.*.*.responses[?(@.schema)]',
        "$.paths.*.*.parameters[?(@.schema && @.in === 'body')]",
      ],
      'then': {
        'function': ensureExamples,
      },
    },
  },
};
