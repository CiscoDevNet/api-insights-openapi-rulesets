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

const ruleName = 'oas2-application-json-charset-utf8-required';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe('ruleName', () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should catch content with the wrong charset used', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'JSON representations should be declared using \'application/json\' or \'application/json; charset=UTF-8\' media types.; "application/json; charset=utf-16" must not match the pattern "^application/json; charset=(?![Uu][Tt][Ff]-8$)"',
        path: [
          'paths',
          '/test',
          'get',
          'produces',
          '0',
        ],
        range: {
          start: {
            line: 16,
            character: 10,
          },
          end: {
            line: 16,
            character: 42,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'JSON representations should be declared using \'application/json\' or \'application/json; charset=UTF-8\' media types.; "application/json; charset=utf-16" must not match the pattern "^application/json; charset=(?![Uu][Tt][Ff]-8$)"',
        path: [
          'paths',
          '/test',
          'get',
          'consumes',
          '0',
        ],
        range: {
          start: {
            line: 18,
            character: 10,
          },
          end: {
            line: 18,
            character: 42,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass content with utf-8 charset used', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
