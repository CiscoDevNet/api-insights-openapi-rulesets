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

import fsPromises from 'fs/promises';
import path from 'path';
import { prepLinter } from '../util/testUtils';
import ruleset from '../documentation';
const ruleName = 'examples-for-every-schema';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should throw an error if missing example', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.json`);
    const res = await spectral.run(spec.toString());
    const expectedResult = [
      {
        'code': 'examples-for-every-schema',
        'message': 'For every schema provided in the OAS document, at least one example must be present.; example or examples is missing in the object',
        'path': [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'headers',
          'X-RateLimit-Limit',
        ],
        'severity': 1,
        'range': {
          'start': {
            'line': 45,
            'character': 34,
          },
          'end': {
            'line': 47,
            'character': 35,
          },
        },
      },
      {
        'code': 'examples-for-every-schema',
        'message': 'For every schema provided in the OAS document, at least one example must be present.; example or examples is missing in the object',
        'path': [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
        ],
        'severity': 1,
        'range': {
          'start': {
            'line': 52,
            'character': 33,
          },
          'end': {
            'line': 67,
            'character': 38,
          },
        },
      },
      {
        'code': 'examples-for-every-schema',
        'message': 'For every schema provided in the OAS document, at least one example must be present.; example or examples is missing in the object',
        'path': [
          'paths',
          '/test',
          'get',
          'responses',
          '400',
          'content',
          'application/json',
        ],
        'severity': 1,
        'range': {
          'start': {
            'line': 77,
            'character': 33,
          },
          'end': {
            'line': 79,
            'character': 61,
          },
        },
      },
      {
        'code': 'examples-for-every-schema',
        'message': 'For every schema provided in the OAS document, at least one example must be present.; example or examples is missing in the object',
        'path': [
          'paths',
          '/test',
          'get',
          'responses',
          '401',
          'content',
          'application/json',
        ],
        'severity': 1,
        'range': {
          'start': {
            'line': 87,
            'character': 33,
          },
          'end': {
            'line': 91,
            'character': 63,
          },
        },
      },
      {
        'code': 'examples-for-every-schema',
        'message': 'For every schema provided in the OAS document, at least one example must be present.; example or examples is missing in the object',
        'path': [
          'paths',
          '/test',
          'patch',
          'responses',
          '400',
          'content',
          'application/json',
        ],
        'severity': 1,
        'range': {
          'start': {
            'line': 147,
            'character': 33,
          },
          'end': {
            'line': 160,
            'character': 38,
          },
        },
      },
    ];

    expect(res).toEqual(expectedResult);
  });
  test('should pass with provided example', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.json`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
