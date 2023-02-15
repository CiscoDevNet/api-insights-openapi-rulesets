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

import ensureExamples from './functions/ensureExamples.js';
import ensureField from './functions/ensureField.js';
export default {
  'rules': {
    'description-for-every-attribute': {
      'description': 'DEA - Descriptions for Every Attribute',
      'message': 'For every attribute that is present in the OAS document, if a description is proposed as optional to complement that attribute, then yes it must be present; {{error}}',
      'severity': 'warn',
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
    'examples-for-every-schema': {
      'description': 'For every schema provided in the OAS document, at least one example must be present',
      'message': '{{description}}; {{error}}',
      'severity': 'warn',
      'given': [
        '$.paths.*.*.*.*.content[?(@ && @.schema)]',
        '$.paths.*.*.*.content[?(@ && @.schema)]',
        '$.paths.*.*.responses[*].headers[?(@ && @.schema)]',
        '$.paths.*.*.parameters[?(@ && @.schema)]',
        '$.paths.*.*.responses[?(@ && @.schema)]',
        "$.paths.*.*.parameters[?(@ && @.schema && @.in === 'body')]",
      ],
      'then': {
        'function': ensureExamples,
      },
    },
  },
};
