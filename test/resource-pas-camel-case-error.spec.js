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
const ruleName = 'resource-pas-camel-case-error';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should catch resources without PasCamelCase names', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Resource names use PasCamelCase.; snake_case must be PasCamelCase',
        path: [
          'paths',
          '/snake_case/snake_case',
        ],
        range: {
          start: {
            line: 13,
            character: 25,
          },
          end: {
            line: 21,
            character: 25,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'Resource names use PasCamelCase.; ALLCAPS must be PasCamelCase',
        path: [
          'paths',
          '/ALLCAPS/ALLCAPS',
        ],
        range: {
          start: {
            line: 22,
            character: 19,
          },
          end: {
            line: 30,
            character: 25,
          },
        },
        severity: 0,
      },
    ]);
  });

  test('should pass resources that are proper PasCamelCase', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
