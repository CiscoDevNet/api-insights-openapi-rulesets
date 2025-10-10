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
import { oas3_1 } from '@stoplight/spectral-formats';
import defaultInEnum from './functions/defaultInEnum.js';
import validateRefSiblings from './functions/validateRefSiblings.js';
import validateRequiredProperties from './functions/validateRequiredProperties.js';

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
    'oas3-operation-security-defined': 'error',
    'oas2-operation-security-defined': 'error',
    'server-variable-default': {
      'description': 'default must be within the enum',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'formats': [oas3_1],
      'given': [
        '$.servers[*].variables',
      ],
      'then': [
        {
          'function': defaultInEnum,
        },
      ],
    },
  
    'broken-internal-refs': {
      'description': 'internal references should exist',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'resolved': false,
      'given': '$..',
      'then': [
        {
          'function': validateRefSiblings,
        },
      ],
    },

    'undefined-required-properties': {
      'description': 'required properties must be defined',
      'message': '{{description}}; {{error}}',
      'severity': 'error',
      'given': [
        '$.components.schemas.*',
        '$.paths.*.*.responses.*.content.*.schema',
        '$.paths.*.*.requestBody.content.*.schema',
        '$.paths.*.*.parameters.*.schema'
      ],
      'then': [
        {
          'function': validateRequiredProperties,
        },
      ],
    },
  },
};
