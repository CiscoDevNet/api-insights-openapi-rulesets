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

const ruleName = 'oas2-date-fields-iso-format';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should flag responses that do not have properly formatted date fields', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Representation fields use strings in \'iso-date-time\' format (RFC-3339) for date/time.; Field timestamp should be type "string" with a format of "date-time".',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'schema',
          'properties',
          'transactions',
          'items',
          'properties',
          'timestamp',
        ],
        range: {
          start: {
            line: 35,
            character: 30,
          },
          end: {
            line: 37,
            character: 36,
          },
        },
        severity: 2,
      },
      {
        code: ruleName,
        message: 'Representation fields use strings in \'iso-date-time\' format (RFC-3339) for date/time.; Field requestDate should be type "string" with a format of "date-time".',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'schema',
          'properties',
          'requestDate',
        ],
        range: {
          start: {
            line: 38,
            character: 26,
          },
          end: {
            line: 39,
            character: 28,
          },
        },
        severity: 2,
      },
      {
        code: ruleName,
        message: 'Representation fields use strings in \'iso-date-time\' format (RFC-3339) for date/time.; Field date should be type "string" with a format of "date-time".',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'schema',
          'properties',
          'date',
        ],
        range: {
          start: {
            line: 40,
            character: 19,
          },
          end: {
            line: 41,
            character: 28,
          },
        },
        severity: 2,
      },
      {
        code: ruleName,
        message: 'Representation fields use strings in \'iso-date-time\' format (RFC-3339) for date/time.; Field dates\'s items should be type "string" with a format of "date-time".',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'schema',
          'properties',
          'dates',
          'items',
        ],
        range: {
          start: {
            line: 44,
            character: 22,
          },
          end: {
            line: 45,
            character: 30,
          },
        },
        severity: 2,
      },
    ]);
  });
  test('should not flag responses that have properly formatted date fields', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
