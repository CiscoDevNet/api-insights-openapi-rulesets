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
const ruleName = 'error-description-unique-for-method';
const resPath = path.join(__dirname, `resources/${ ruleName }`);


describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should throw an error if the same description is used for more than one error code', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());


    const expectedTestResult = [
      {
        'code': 'error-description-unique-for-method',
        'message': 'For each Error status-code defined, the description must be unique.; Error Description \"error\" should be unique within each API operation but is duplicated for these codes: 401, 429, 500',
        'path': [
          'paths',
          '/organizations',
          'get',
        ],
        'severity': 1,
        'range': {
          'start': {
            'line': 23,
            'character': 8,
          },
          'end': {
            'line': 44,
            'character': 18,
          },
        },
      },
    ];

    expect(res).toEqual(expectedTestResult);
  });
  test('should pass with provided example', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());
    const expectedTestResult = [];

    expect(res).toEqual(expectedTestResult);
  });
});
