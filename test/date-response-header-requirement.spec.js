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
const ruleName = 'date-response-header-requirement';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should require a Date header for all responses', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'All responses include a \'Date\' header in the GMT timezone and RFC 5322 format.; An expected pathway is missing. Prerequisite: "headers", search: "Date"',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
        ],
        range: {
          start: {
            line: 20,
            character: 14,
          },
          end: {
            line: 25,
            character: 29,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'All responses include a \'Date\' header in the GMT timezone and RFC 5322 format.; An expected pathway is missing. Prerequisite: "headers", search: "Date"',
        path: [
          'paths',
          '/test',
          'delete',
          'responses',
          '200',
        ],
        range: {
          start: {
            line: 32,
            character: 14,
          },
          end: {
            line: 37,
            character: 29,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should flag a response that has no headers whatsoever', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-omitted.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'All responses include a \'Date\' header in the GMT timezone and RFC 5322 format.; An expected pathway is missing. Prerequisite: "headers", search: "Date"',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
        ],
        range: {
          start: {
            line: 20,
            character: 14,
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
        message: 'All responses include a \'Date\' header in the GMT timezone and RFC 5322 format.; An expected pathway is missing. Prerequisite: "headers", search: "Date"',
        path: [
          'paths',
          '/test',
          'delete',
          'responses',
          '200',
        ],
        range: {
          start: {
            line: 28,
            character: 14,
          },
          end: {
            line: 29,
            character: 25,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass responses with a Date header defined', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
