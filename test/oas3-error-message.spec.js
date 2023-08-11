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

const ruleName = 'oas3-error-message';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should throw an error if errors do not have a message', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Error representations include a useful human-readable message.',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '400',
        ],
        range: {
          start: {
            line: 20,
            character: 14,
          },
          end: {
            line: 25,
            character: 50,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'Error representations include a useful human-readable message.',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '500',
        ],
        range: {
          start: {
            line: 26,
            character: 14,
          },
          end: {
            line: 31,
            character: 50,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass if errors have a message', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
  test('should pass if HEAD response with no message', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-HEAD.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
  test('should fail if HEAD response with no message, and has other response with no message', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-HEAD.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Error representations include a useful human-readable message.',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '400',
        ],
        range: {
          start: {
            line: 20,
            character: 16,
          },
          end: {
            line: 25,
            character: 52,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'Error representations include a useful human-readable message.',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '500',
        ],
        range: {
          start: {
            line: 26,
            character: 16,
          },
          end: {
            line: 31,
            character: 52,
          },
        },
        severity: 0,
      },
    ]);
  });
});
