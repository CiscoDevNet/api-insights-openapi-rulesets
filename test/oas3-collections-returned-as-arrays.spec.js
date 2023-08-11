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

const ruleName = 'oas3-collections-returned-as-arrays';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should catch application/json responses that are arrays', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Collections are returned as arrays encapsulated with a named field such as \'items\'.; "array" must not match the pattern "^array$"',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'type',
        ],
        range: {
          start: {
            line: 25,
            character: 22,
          },
          end: {
            line: 25,
            character: 27,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'Collections are returned as arrays encapsulated with a named field such as \'items\'.; "array" must not match the pattern "^array$"',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/xml',
          'schema',
          'type',
        ],
        range: {
          start: {
            line: 30,
            character: 22,
          },
          end: {
            line: 30,
            character: 27,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should catch application/json; charset=utf-8 responses that are arrays', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-charset.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Collections are returned as arrays encapsulated with a named field such as \'items\'.; "array" must not match the pattern "^array$"',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/json; charset=utf-8',
          'schema',
          'type',
        ],
        range: {
          start: {
            line: 25,
            character: 22,
          },
          end: {
            line: 25,
            character: 27,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should lint non-200 GET responses as well', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-non-200-get.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Collections are returned as arrays encapsulated with a named field such as \'items\'.; "array" must not match the pattern "^array$"',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'type',
        ],
        range: {
          start: {
            line: 25,
            character: 22,
          },
          end: {
            line: 25,
            character: 27,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'Collections are returned as arrays encapsulated with a named field such as \'items\'.; "array" must not match the pattern "^array$"',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '500',
          'content',
          'application/json',
          'schema',
          'type',
        ],
        range: {
          start: {
            line: 33,
            character: 22,
          },
          end: {
            line: 33,
            character: 27,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass application/json responses that are objects', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
