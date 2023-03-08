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

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'For every schema provided in the OAS document, at least one example must be present; example or examples is missing in the object',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'headers',
          'X-RateLimit-Limit',
        ],
        range: {
          end: {
            character: 35,
            line: 47,
          },
          start: {
            character: 34,
            line: 45,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'For every schema provided in the OAS document, at least one example must be present; example or examples is missing in the object',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
        ],
        range: {
          end: {
            character: 38,
            line: 67,
          },
          start: {
            character: 33,
            line: 52,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'For every schema provided in the OAS document, at least one example must be present; example or examples is missing in the object',
        path: [
          'paths',
          '/test',
          'patch',
          'responses',
          '400',
          'content',
          'application/json',
        ],
        range: {
          end: {
            character: 38,
            line: 137,
          },
          start: {
            character: 33,
            line: 124,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should pass with provided example', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.json`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
