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

const ruleName = 'oas2-error-response-identifier';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  describe('openapi 2', () => {
    test('should throw an error if errors do not have a tracking id', async () => {
      const spec = await fsPromises.readFile(`${ resPath }/negative-oas2.yml`);
      const res = await spectral.run(spec.toString());

      expect(res).toEqual([
        {
          code: ruleName,
          message: 'Error representations include an identifier to help with troubleshooting (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
          path: [
            'paths',
            '/test',
            'get',
            'responses',
            '400',
          ],
          range: {
            start: {
              line: 21,
              character: 14,
            },
            end: {
              line: 27,
              character: 28,
            },
          },
          severity: 1,
        },
        {
          code: ruleName,
          message: 'Error representations include an identifier to help with troubleshooting (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
          path: [
            'paths',
            '/test',
            'get',
            'responses',
            '500',
          ],
          range: {
            start: {
              line: 28,
              character: 14,
            },
            end: {
              line: 34,
              character: 28,
            },
          },
          severity: 1,
        },
      ]);
    });
    test('should not lint error responses for HEAD operations', async () => {
      const spec = await fsPromises.readFile(`${ resPath }/ignore-head-oas2.yml`);
      const res = await spectral.run(spec.toString());

      expect(res).toEqual([]);
    });
    test('should pass if errors have a valid identifier', async () => {
      const spec = await fsPromises.readFile(`${ resPath }/positive-oas2.yml`);
      const res = await spectral.run(spec.toString());

      expect(res).toEqual([]);
    });
  });
});
