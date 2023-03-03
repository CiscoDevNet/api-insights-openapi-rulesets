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
/* eslint-env jest */
import path from 'path';
import { prepLinter } from '../util/testUtils';
import ruleset from '../api-insights-openapi-ruleset';

const ruleName = 'authenticate-requests';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should throw warnings for requests with no security', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'API.REST.SECURITY.03: My API authenticates and authorizes all requests (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'get',
        ],
        range: {
          start: {
            line: 19,
            character: 8,
          },
          end: {
            line: 26,
            character: 25,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'API.REST.SECURITY.03: My API authenticates and authorizes all requests (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'post',
        ],
        range: {
          start: {
            line: 27,
            character: 9,
          },
          end: {
            line: 34,
            character: 25,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'API.REST.SECURITY.03: My API authenticates and authorizes all requests (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'put',
        ],
        range: {
          start: {
            line: 35,
            character: 8,
          },
          end: {
            line: 42,
            character: 25,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'API.REST.SECURITY.03: My API authenticates and authorizes all requests (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'delete',
        ],
        range: {
          start: {
            line: 43,
            character: 11,
          },
          end: {
            line: 50,
            character: 25,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'API.REST.SECURITY.03: My API authenticates and authorizes all requests (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'options',
        ],
        range: {
          start: {
            line: 51,
            character: 12,
          },
          end: {
            line: 58,
            character: 25,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
