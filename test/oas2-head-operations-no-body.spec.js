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

const ruleName = 'oas2-head-operations-no-body';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should flag an endpoint that has both a GET and HEAD response with a response body returned by the HEAD response', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'HEAD operations with a corresponding GET operation must return no body content (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'head',
          'responses',
          '200',
          'schema',
        ],
        range: {
          start: {
            line: 31,
            character: 17,
          },
          end: {
            line: 32,
            character: 24,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass if an endpoint has both a GET and HEAD response and the HEAD response has no response body', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
  test('should pass if an endpoint has only a HEAD response (no GET response) with a response body', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-no-get-response.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
