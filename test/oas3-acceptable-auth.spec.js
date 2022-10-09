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

const ruleName = 'oas3-acceptable-auth';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should catch basic auth', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-basic.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: 'oas3-acceptable-auth',
        message: 'My API authenticates requests using access tokens; NOT username/passwords. (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'components',
          'securitySchemes',
          'BasicAuth',
        ],
        range: {
          end: {
            character: 19,
            line: 11,
          },
          start: {
            character: 14,
            line: 9,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should catch oauth2 (password)', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-oauth2.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: 'oas3-acceptable-auth',
        message: 'My API authenticates requests using access tokens; NOT username/passwords. (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'components',
          'securitySchemes',
          'PasswordAuth',
        ],
        range: {
          end: {
            character: 45,
            line: 14,
          },
          start: {
            character: 17,
            line: 9,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass for acceptable auth options', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
