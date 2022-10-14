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

const ruleName = 'oas2-order-parameter-asc-desc';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should catch order parameters that do not accept strings', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-wrong-type.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Ordering collections is designed with an \'order\' query parameter specifying \'asc\' or \'desc\' (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'get',
          'parameters',
          '0',
          'type',
        ],
        range: {
          start: {
            line: 25,
            character: 16,
          },
          end: {
            line: 25,
            character: 23,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should catch order parameters that do not accept "asc" and "desc"', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Ordering collections is designed with an \'order\' query parameter specifying \'asc\' or \'desc\' (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'get',
          'parameters',
          '0',
          'enum',
        ],
        range: {
          start: {
            line: 26,
            character: 15,
          },
          end: {
            line: 26,
            character: 38,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should pass if order parameters accept "asc" and "desc"', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
