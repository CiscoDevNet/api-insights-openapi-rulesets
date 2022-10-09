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
const ruleName = 'head-operations-match-headers-with-get';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  describe('openapi 2', () => {
    test('should fail if HEAD is missing headers from GET', async () => {
      const spec = await fsPromises.readFile(`${ resPath }/openapi2/negative.yml`);
      const res = await spectral.run(spec.toString());

      expect(res).toEqual([
        {
          code: ruleName,
          message: 'The following headers are missing from the HEAD operation for response code 200: X-RateLimit-Limit (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
          path: [
            'paths',
            '/test',
            'head',
            'responses',
            '200',
            'headers',
          ],
          range: {
            start: {
              line: 36,
              character: 18,
            },
            end: {
              line: 38,
              character: 27,
            },
          },
          severity: 0,
        },
      ]);
    });
    test('should fail if GET has headers but HEAD is missing headers entirely', async () => {
      const spec = await fsPromises.readFile(`${ resPath }/openapi2/negative-missing-headers.yml`);
      const res = await spectral.run(spec.toString());

      expect(res).toEqual([
        {
          code: ruleName,
          message: 'The HEAD operation for response code 200 is missing a "headers" definition (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
          path: [
            'paths',
            '/test',
            'head',
            'responses',
            '200',
          ],
          range: {
            start: {
              line: 34,
              character: 14,
            },
            end: {
              line: 35,
              character: 25,
            },
          },
          severity: 0,
        },
      ]);
    });
    test('should pass GET and HEAD response codes with the same headers', async () => {
      const spec = await fsPromises.readFile(`${ resPath }/openapi2/positive-same.yml`);
      const res = await spectral.run(spec.toString());

      expect(res).toEqual([]);
    });
    test('should pass GET and HEAD response codes without any headers', async () => {
      const spec = await fsPromises.readFile(`${ resPath }/openapi2/positive-no-headers.yml`);
      const res = await spectral.run(spec.toString());

      expect(res).toEqual([]);
    });
    test('should pass GET that is missing headers from HEAD', async () => {
      const spec = await fsPromises.readFile(`${ resPath }/openapi2/positive-get-missing.yml`);
      const res = await spectral.run(spec.toString());

      expect(res).toEqual([]);
    });
  });
  describe('openapi 3', () => {
    test('should fail if HEAD is missing headers from GET', async () => {
      const spec = await fsPromises.readFile(`${ resPath }/openapi3/negative.yml`);
      const res = await spectral.run(spec.toString());

      expect(res).toEqual([
        {
          code: ruleName,
          message: 'The following headers are missing from the HEAD operation for response code 200: X-RateLimit-Limit (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
          path: [
            'paths',
            '/test',
            'head',
            'responses',
            '200',
            'headers',
          ],
          range: {
            start: {
              line: 36,
              character: 18,
            },
            end: {
              line: 39,
              character: 29,
            },
          },
          severity: 0,
        },
      ]);
    });
    test('should fail if GET has headers but HEAD is missing headers entirely', async () => {
      const spec = await fsPromises.readFile(`${ resPath }/openapi3/negative-missing-headers.yml`);
      const res = await spectral.run(spec.toString());

      expect(res).toEqual([
        {
          code: ruleName,
          message: 'The HEAD operation for response code 200 is missing a "headers" definition (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
          path: [
            'paths',
            '/test',
            'head',
            'responses',
            '200',
          ],
          range: {
            start: {
              line: 34,
              character: 14,
            },
            end: {
              line: 35,
              character: 25,
            },
          },
          severity: 0,
        },
      ]);
    });
    test('should pass GET and HEAD response codes with the same headers', async () => {
      const spec = await fsPromises.readFile(`${ resPath }/openapi3/positive-same.yml`);
      const res = await spectral.run(spec.toString());

      expect(res).toEqual([]);
    });
    test('should pass GET and HEAD response codes without any headers', async () => {
      const spec = await fsPromises.readFile(`${ resPath }/openapi3/positive-no-headers.yml`);
      const res = await spectral.run(spec.toString());

      expect(res).toEqual([]);
    });
    test('should pass GET that is missing headers from HEAD', async () => {
      const spec = await fsPromises.readFile(`${ resPath }/openapi3/positive-get-missing.yml`);
      const res = await spectral.run(spec.toString());

      expect(res).toEqual([]);
    });
  });
});
