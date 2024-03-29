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
import ruleset from '../api-insights-openapi-ruleset';
const ruleName = 'respond-with-recommended-delete-codes';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should pass for valid DELETE codes', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
  test('should catch invalid DELETE codes', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: '201 is not an acceptable response code for DELETE. My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges.',
        path: [
          'paths',
          '/myResource',
          'delete',
          'responses',
          '201',
        ],
        range: {
          end: {
            character: 30,
            line: 21,
          },
          start: {
            character: 14,
            line: 20,
          },
        },
        severity: 0,
      },
      {
        code: 'respond-with-recommended-delete-codes',
        message: '202 is not an acceptable response code for DELETE. My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges.',
        path: [
          'paths',
          '/myResource',
          'delete',
          'responses',
          '202',
        ],
        range: {
          end: {
            character: 31,
            line: 23,
          },
          start: {
            character: 14,
            line: 22,
          },
        },
        severity: 0,
      },
    ]);
  });
});
