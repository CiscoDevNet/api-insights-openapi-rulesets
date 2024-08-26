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

import { oas } from '@stoplight/spectral-rulesets';
import { xor } from '@stoplight/spectral-functions/dist';
import ensureExamples from './functions/ensureExamples.js';
import ensureField from './functions/ensureField.js';
import ensureUniqueErrorDescriptions from './functions/ensureUniqueErrorDescriptions.js';
import ensureErrorConsistency from './functions/ensureErrorConsistency.js';
import ensureTagConsistency from './functions/ensureTagConsistency.js';
import ensureOperationIdConsistency from './functions/ensureOperationIdConsistency.js';

export default {
  'extends': [
    [
      oas,
      'off',
    ],
  ],
  'rules': {
    'info-contact': 'warn',
    'info-description': 'warn',
    'info-license': 'warn',
    'license-url': {
      'description': 'License object must include "url" or "identifier".',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': [
        '$.info.license',
      ],
      'then': {
        'function': xor,
        'functionOptions': {
          'properties': [
            'url',
            'identifier',
          ],
        },
      },
    },
    'description-for-every-attribute': {
      'description': 'Every attribute in the OpenAPI document must have a description. Description fields that are marked as optional must be filled.',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': [
        '$.info',
        '$.server',
        '$.externalDocs',
        '$.paths.*.*.parameters.*',
        '$.paths.*.*.requestBody.content.*.schema.properties.*',
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
    'examples-for-every-schema': {
      'description': 'For every schema provided in the OAS document, at least one example must be present.',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': [
        '$.paths.*.*.*.*.content[?(@ && @.schema)]',
        '$.paths.*.*.*.content[?(@ && @.schema)]',
        '$.paths.*.*.responses[*].headers[?(@ && @.schema)]',
        '$.paths.*.*.responses[?(@ && @.schema)]',
      ],
      'then': {
        'function': ensureExamples,
      },
    },
    'error-description-unique-for-method': {
      'description': 'For each Error status-code defined, the description must be unique.',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$.paths',
      'then': {
        'function': ensureUniqueErrorDescriptions,
      },
    },
    'error-code-description-consistent': {
      'description': 'For each error code, the description should be consistent across the API.',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$',
      'then': {
        'function': ensureErrorConsistency,
      },
    },
    'tag-name-case-consistent': {
      'description': 'Tags should have consistent casing for the same tag.',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$',
      'then': {
        'function': ensureTagConsistency,
      },
    },
    'operationId-name-case-consistent': {
      'description': 'OperationIds should have consistent casing.',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': '$',
      'then': {
        'function': ensureOperationIdConsistency,
      },
    },
    'oas3-valid-media-example': 'error',
    'oas2-valid-media-example': 'error',
    'oas3-valid-schema-example': 'error',
  },
};
