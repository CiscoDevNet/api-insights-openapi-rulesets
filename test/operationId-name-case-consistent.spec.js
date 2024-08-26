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
const ruleName = 'operationId-name-case-consistent';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should throw an error if ...', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    const expectedTestResult = [
      {
        'code': 'operationId-name-case-consistent',
        'message': 'OperationIds should have consistent casing.; Inconsistent casing types detected. Found: Pascal, camel.',
        'path': [],
        'severity': 1,
        'range': {
          'start': {
            'line': 0,
            'character': 0,
          },
          'end': {
            'line': 130,
            'character': 40,
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
