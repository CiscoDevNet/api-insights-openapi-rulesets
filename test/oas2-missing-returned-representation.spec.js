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
const ruleName = 'oas2-missing-returned-representation';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should throw an error if missing returned representation', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.json`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: '2XX (except 204) responses must have a response schema defined.; schema is missing in the object',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
        ],
        range: {
          end: {
            character: 33,
            line: 39,
          },
          start: {
            character: 16,
            line: 35,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass with provided returned representation', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.json`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
