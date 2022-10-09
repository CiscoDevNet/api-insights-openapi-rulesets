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
const ruleName = 'resource-name-too-long';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should fail a reseource name with over 15 characters but less than 20 characters', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: '"veryLongEndpoint" is longer than allowed maximum of 15 (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/veryLongEndpoint',
        ],
        range: {
          start: {
            line: 13,
            character: 20,
          },
          end: {
            line: 21,
            character: 25,
          },
        },
        severity: 2,
      },
      {
        code: ruleName,
        message: '"someLongEndpoint" is longer than allowed maximum of 15 (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/veryLongEndpoint/someLongEndpoint',
        ],
        range: {
          start: {
            line: 22,
            character: 37,
          },
          end: {
            line: 30,
            character: 25,
          },
        },
        severity: 2,
      },
      {
        code: 'resource-name-too-long',
        message: '"veryLongEndpoint" is longer than allowed maximum of 15 (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/other/veryLongEndpoint',
        ],
        range: {
          end: {
            character: 25,
            line: 39,
          },
          start: {
            character: 26,
            line: 31,
          },
        },
        severity: 2,
      },
      {
        code: 'resource-name-too-long',
        message: '"veryVeryVeryLongEndpoint" is longer than allowed maximum of 15 (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/veryVeryVeryLongEndpoint',
        ],
        range: {
          end: {
            character: 25,
            line: 48,
          },
          start: {
            character: 28,
            line: 40,
          },
        },
        severity: 2,
      },
    ]);
  });
  test('should pass a spec with a resource under 15 characters', async () => {
    expect.assertions(1);
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
