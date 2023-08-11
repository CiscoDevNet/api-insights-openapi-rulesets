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

const ruleName = 'oas3-array-plural-representation';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should flag a collection (array) xml response', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Representation fields use plural noun names for collections.; device should be plural.',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'properties',
          'device',
        ],
        range: {
          start: {
            line: 31,
            character: 25,
          },
          end: {
            line: 51,
            character: 49,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'Representation fields use plural noun names for collections.; contract should be plural.',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'properties',
          'device',
          'items',
          'properties',
          'contract',
        ],
        range: {
          start: {
            line: 42,
            character: 33,
          },
          end: {
            line: 51,
            character: 49,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'Representation fields use plural noun names for collections.; balance should be plural.',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'properties',
          'details',
          'properties',
          'balance',
        ],
        range: {
          start: {
            line: 59,
            character: 30,
          },
          end: {
            line: 62,
            character: 38,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should not flag responses that end with an id', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
