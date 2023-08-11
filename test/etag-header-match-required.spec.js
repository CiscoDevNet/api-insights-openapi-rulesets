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
const ruleName = 'etag-header-match-required';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should catch ETag headers without any Match headers', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect([res[1]]).toEqual([
      {
        code: ruleName,
        message: 'In cases where ETag is supported, such resources should also support If-Match and If-None-Match request headers.; "headers.If-None-Match" property must be truthy',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'headers',
        ],
        range: {
          start: {
            line: 22,
            character: 18,
          },
          end: {
            line: 25,
            character: 28,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should catch ETag headers with only one Match header required', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-one-required.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'In cases where ETag is supported, such resources should also support If-Match and If-None-Match request headers.; "headers.If-None-Match" property must be truthy',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'headers',
        ],
        range: {
          start: {
            line: 22,
            character: 18,
          },
          end: {
            line: 28,
            character: 28,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'In cases where ETag is supported, such resources should also support If-Match and If-None-Match request headers.; "headers.If-Match" property must be truthy',
        path: [
          'paths',
          '/anotherTest',
          'get',
          'responses',
          '200',
          'headers',
        ],
        range: {
          start: {
            line: 38,
            character: 18,
          },
          end: {
            line: 44,
            character: 28,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass ETag headers with Match headers', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
