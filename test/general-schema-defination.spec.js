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
import ruleset from '../contract';
const ruleName = 'general-schema-definition';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should throw an error if missing schema', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.json`);
    const res = await spectral.run(spec.toString());
    const expectedResult = [
      {
        'code': 'general-schema-definition',
        'message': 'Some of the defined schema use object as a final field when describing their object structure; properties missing for object schema',
        'path': [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
        ],
        'severity': 0,
        'range': {
          'start': {
            'line': 55,
            'character': 25,
          },
          'end': {
            'line': 63,
            'character': 32,
          },
        },
      },
    ];

    expect(res).toEqual(expectedResult);
  });
  test('should pass with provided schema', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.json`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
