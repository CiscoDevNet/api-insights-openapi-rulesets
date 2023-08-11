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

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Representation field names use PasCamelCase.; user_id (paths./test.post.parameters.0.name)',
        path: [
          'paths',
          '/test',
          'post',
          'parameters',
          '0',
        ],
        range: {
          end: {
            character: 53,
            line: 23,
          },
          start: {
            character: 10,
            line: 18,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'Representation field names use PasCamelCase.; MYData (paths./test.post.requestBody.content.application/json.schema.properties.MYData)',
        path: [
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
        range: {
          end: {
            character: 56,
            line: 31,
          },
          start: {
            character: 19,
            line: 30,
          },
        },
        severity: 0,
        source: undefined,
      },
      {
        code: ruleName,
        message: 'Representation field names use PasCamelCase.; MYData (paths./test.post.responses.200.content.application/json.schema.items.properties.MYData)',
        path: [
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
        range: {
          end: {
            character: 60,
            line: 38,
          },
          start: {
            character: 21,
            line: 37,
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
        message: 'Representation field names use PasCamelCase.; snake_case (paths./test.get.responses.200.content.application/json.schema.items.properties.snake_case)',
        path: [
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
        range: {
          start: {
            line: 24,
            character: 21,
          },
          end: {
            line: 25,
            character: 60,
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
