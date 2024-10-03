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
import ensureField from './functions/ensureField.js';
import includeAll from './functions/includeAll.js';
import keyMatchAnyPattern from './functions/keyMatchAnyPattern.js';
import multiVersion from './functions/multiVersion.js';
import operationIdCheck from './functions/operationIdCheck.js';
export default {
  'extends': [
    [
      oas,
      'off',
    ],
  ],
  'rules': {
    'oas3-schema': 'error',
    'oas2-schema': 'error',
    'oas3-missing-schema-definition': {
      'description': 'a schema must describe the structure of responses (except 204s) and request bodies if any',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': [
        '$.paths.*.*.responses[?(@property.match(/^[2]\\d{2}$/i) && @property!=204)].content[*]',
        '$.*.*.*.requestBody.content[*]',
      ],
      'then': {
        'function': ensureField,
        'functionOptions': {
          'field': 'schema',
        },
      },
    },
    'oas2-missing-schema-definition': {
      'description': 'a schema must describe the structure of responses (except 204s) and request bodies if any',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': [
        '$.paths.*.*.responses[?(@property.match(/^[2]\\d{2}$/i) && @property!=204 )]',
        "$.*.*.*.parameters[?(@ != null && @.in === 'body')]",
      ],
      'then': {
        'function': ensureField,
        'functionOptions': {
          'field': 'schema',
        },
      },
    },
    'general-schema-definition': {
      'description': 'schemas must be fully defined and should not use \'object\' as a final type',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': [
        '$.paths.*.*.*.*.content[?(@ && @.schema)].schema',
        '$.paths.*.*.*.content[?(@ && @.schema)].schema',
        '$.paths.*.*.responses[*].headers[?(@ && @.schema)].schema',
        '$.paths.*.*.parameters[?(@ && @.schema)].schema',
        '$.paths.*.*.responses[?(@ && @.schema)].schema',
        "$.paths.*.*.parameters[?(@ && @.schema && @.in === 'body')].schema",
      ],
      'then': [
        {
          'function': completedSchema,
        },
      ],
    },
    'oas3-missing-returned-representation': {
      'description': 'a response schema must be defined for 2xx responses (except 204)',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3],
      'given': ['$.paths.*.*.responses[?(@property.match(/^[2]\\d{2}$/i) && @property!=204)].content[*]'],
      'then': {
        'function': ensureField,
        'functionOptions': {
          'field': 'schema',
        },
      },
    },
    'oas2-missing-returned-representation': {
      'description': 'a response schema must be defined for 2xx responses (except 204)',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas2],
      'given': ['$.paths.*.*.responses[?(@property.match(/^[2]\\d{2}$/i) && @property!=204 )]'],
      'then': {
        'function': ensureField,
        'functionOptions': {
          'field': 'schema',
        },
      },
    },
    'success-status-code': {
      'description': 'responses must include a success status code in the 1xx, 2xx or 3xx range (generally 200, 201 or 204)',
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
      'description': 'responses should include at least one error status code (4xx or 5xx)',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
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
    'oas2-meta-info': {
      'description': 'some meta fields are missing',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
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
    'server-url-missing-version': {
      'description': 'the API version should be specified in the \'server.url\' field',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': [
        '$',
      ],
      'then': {
        'function': multiVersion,
        'functionOptions': {
          'check': 'server-url-missing'
        },
      },
    },
    'multi-versions': {
      'description': 'all paths should reference a single API version',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': [
        '$',
      ],
      'then': {
        'function': multiVersion,
        'functionOptions': {
          'exceptions' : [ "networks/{networkId}/switch/dhcp/v4" ]
        },
      },
    },
    'operationId-required-and-unique': {
      'description': 'an \'operationId\' field must be present for every operation and must be unique',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': [
        '$',
      ],
      'then': [
        {
          'function': operationIdCheck,
        },
      ],
    },
  },
};
