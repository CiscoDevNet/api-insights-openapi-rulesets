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

const ruleName = 'oas2-request-header-date-correct-type';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should fail a Date header that is not the right type', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-type.yml`);
    const res = await spectral.run(spec.toString());

    // Two lint issues - no pattern and type is wrong.
    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Date header should be type \'string\' and should not use the built-in OpenAPI format. Instead, \'pattern\' should be used to specify a custom format (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'get',
          'parameters',
          '0',
        ],
        range: {
          start: {
            line: 18,
            character: 10,
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
        message: 'Date header should be type \'string\' and should not use the built-in OpenAPI format. Instead, \'pattern\' should be used to specify a custom format (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
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
            line: 20,
            character: 16,
          },
          end: {
            line: 20,
            character: 23,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should fail a Date header that is the right type but the wrong format', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-wrong-format.yml`);
    const res = await spectral.run(spec.toString());

    // Two lint issues - no pattern and format is wrong.
    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Date header should be type \'string\' and should not use the built-in OpenAPI format. Instead, \'pattern\' should be used to specify a custom format (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'get',
          'parameters',
          '0',
        ],
        range: {
          start: {
            line: 20,
            character: 10,
          },
          end: {
            line: 24,
            character: 25,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'Date header should be type \'string\' and should not use the built-in OpenAPI format. Instead, \'pattern\' should be used to specify a custom format (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'get',
          'parameters',
          '0',
          'format',
        ],
        range: {
          start: {
            line: 23,
            character: 18,
          },
          end: {
            line: 23,
            character: 27,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass a Date request header with the correct type, no format, and a pattern specified', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
  test('should pass a invalid type Date when parameter is not in the header', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-non-header.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
