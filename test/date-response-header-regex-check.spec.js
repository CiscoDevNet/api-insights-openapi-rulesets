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
const ruleName = 'date-response-header-regex-check';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should fail a Date header with a pattern that is not comprehensive enough', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'All responses include a \'Date\' header in the GMT timezone and RFC 5322 format.; The regex pattern used does not pass basic linting sample checks - should not have matched case Thu 8 Apr 2021 19:06:27 GMT (Comma required after Day of Week)',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'headers',
          'Date',
          'schema',
          'pattern',
        ],
        range: {
          start: {
            line: 26,
            character: 25,
          },
          end: {
            line: 26,
            character: 183,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should pass responses with a Date header with a valid pattern defined', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
