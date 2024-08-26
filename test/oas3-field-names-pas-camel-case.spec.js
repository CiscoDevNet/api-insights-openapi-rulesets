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
import { expect } from '@jest/globals';

const ruleName = 'oas3-field-names-pas-camel-case';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should catch fields without PasCamelCase names', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    const expectedResult = [
      {
        'code': 'oas3-field-names-pas-camel-case',
        'message': 'Representation field names use PasCamelCase.; MYData (paths./test.post.requestBody.content.application/json.schema.properties.MYData)',
        'path': [
          'paths',
          '/test',
          'post',
          'requestBody',
          'content',
          'application/json',
          'schema',
          'properties',
          'MYData',
        ],
        'severity': 0,
        'range': {
          'start': {
            'character': 0,
            'line': 0,
          },
          'end': {
            'character': 0,
            'line': 0,
          },
        },
      },
      {
        'code': 'oas3-field-names-pas-camel-case',
        'message': 'Representation field names use PasCamelCase.; MYData (paths./test.post.responses.200.content.application/json.schema.items.properties.MYData)',
        'path': [
          'paths',
          '/test',
          'post',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'items',
          'properties',
          'MYData',
        ],
        'severity': 0,
        'range': {
          'start': {
            'character': 0,
            'line': 0,
          },
          'end': {
            'character': 0,
            'line': 0,
          },
        },
      },
      {
        'code': 'oas3-field-names-pas-camel-case',
        'message': 'Representation field names use PasCamelCase.; user_id (paths./test.post.parameters.0.name)',
        'path': [
          'paths',
          '/test',
          'post',
          'parameters',
          '0',
        ],
        'severity': 0,
        'range': {
          'start': {
            'line': 18,
            'character': 10,
          },
          'end': {
            'line': 23,
            'character': 53,
          },
        },
      },
    ];

    expect(res).toEqual(expectedResult);
  });

  test('should catch fields with snake_case names', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-with-snake-case.yml`);
    const res = await spectral.run(spec.toString());

    const expectedResult = [
      {
        'code': 'oas3-field-names-pas-camel-case',
        'message': 'Representation field names use PasCamelCase.; snake_case (paths./test.get.responses.200.content.application/json.schema.items.properties.snake_case)',
        'path': [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'items',
          'properties',
          'snake_case',
        ],
        'severity': 0,
        'range': {
          'start': {
            'character': 0,
            'line': 0,
          },
          'end': {
            'character': 0,
            'line': 0,
          },
        },
      },
    ];

    expect(res).toEqual(expectedResult);

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
