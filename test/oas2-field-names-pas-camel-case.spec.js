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

const ruleName = 'oas2-field-names-pas-camel-case';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should catch fields without PasCamelCase names', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'user_id (paths./test.post.parameters.0.name) field is not PasCamelCase (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'post',
          'parameters',
          '0',
        ],
        range: {
          end: {
            character: 24,
            line: 22,
          },
          start: {
            character: 10,
            line: 19,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'MYData (paths./test.post.parameters.1.schema.properties.MYData) field is not PasCamelCase (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'post',
          'parameters',
          '1',
          'schema',
          'properties',
          'MYData',
        ],
        range: {
          end: {
            character: 47,
            line: 27,
          },
          start: {
            character: 17,
            line: 26,
          },
        },
        severity: 0,
        source: undefined,
      },
      {
        code: ruleName,
        message: 'MYData (paths./test.post.responses.200.schema.items.properties.MYData) field is not PasCamelCase (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'post',
          'responses',
          '200',
          'schema',
          'items',
          'properties',
          'MYData',
        ],
        range: {
          start: {
            'character': 17,
            'line': 33,
          },
          end: {
            'character': 49,
            'line': 34,
          },
        },
        severity: 0,
        source: undefined,
      },
    ]);
  });

  test('should catch fields with snake_case names', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-with-snake-case.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'snake_case (paths./test.get.responses.200.schema.items.properties.snake_case) field is not PasCamelCase (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'schema',
          'items',
          'properties',
          'snake_case',
        ],
        range: {
          end: {
            'character': 49,
            'line': 24,
          },
          start: {
            'character': 17,
            'line': 23,
          },
        },
        severity: 0,
        source: undefined,
      },
    ]);
  });

  test('should pass fields that are proper PasCamelCase', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });

  test('should pass the field \'_id\' as an exception to the PasCamelCase rule', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-with-_id.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });

  test('should pass the field \'x-cisco-data-classification\' as an exception to the PasCamelCase rule', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-with-x-cisco-data-classification.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });

  test('should pass parameters in the header as an exception to the PasCamelCase rule', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-with-header.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
