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

const ruleName = 'oas2-no-boolean-string-enums';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should catch responses with a string enum for booleans', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());
    const expectedResult = [
      {
        'code': 'oas2-no-boolean-string-enums',
        'message': 'Representation fields use format-native true/false values for booleans.; Given matches target enums.',
        'path': [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'schema',
          'properties',
          'val',
          'enum',
        ],
        'severity': 1,
        'range': {
          'start': {
            'line': 28,
            'character': 21,
          },
          'end': {
            'line': 30,
            'character': 23,
          },
        },
      },
    ];

    expect(res).toEqual(expectedResult);

  });
  test('should catch responses with a string enum for booleans hidden deeply', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-deep.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Representation fields use format-native true/false values for booleans.; Given matches target enums.',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'schema',
          'properties',
          'this',
          'properties',
          'is',
          'properties',
          'a',
          'properties',
          'deep',
          'properties',
          'obj',
          'enum',
        ],
        range: {
          start: {
            line: 40,
            character: 37,
          },
          end: {
            line: 42,
            character: 39,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'Representation fields use format-native true/false values for booleans.; Given matches target enums.',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'schema',
          'properties',
          'this',
          'properties',
          'is',
          'properties',
          'b',
          'enum',
        ],
        range: {
          start: {
            line: 45,
            character: 29,
          },
          end: {
            line: 47,
            character: 30,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should catch referenced responses with a string enum for booleans hidden deeply', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-deep-reference.yml`);
    const res = await spectral.run(spec.toString());
    const expectedResult =  [
      {
        "code": "oas2-no-boolean-string-enums",
        "message": "Representation fields use format-native true/false values for booleans.; Given matches target enums.",
        "path": [
          "paths",
          "/test",
          "get",
          "responses",
          "200",
          "schema",
          "properties",
          "this",
          "properties",
          "is",
          "properties",
          "a",
          "properties",
          "deep",
          "properties",
          "obj",
          "enum"
        ],
        "severity": 1,
        "range": {
          "start": {
            "line": 23,
            "character": 17
          },
          "end": {
            "line": 24,
            "character": 44
          }
        }
      },
      {
        "code": "oas2-no-boolean-string-enums",
        "message": "Representation fields use format-native true/false values for booleans.; Given matches target enums.",
        "path": [
          "paths",
          "/test",
          "get",
          "responses",
          "200",
          "schema",
          "properties",
          "this",
          "properties",
          "is",
          "properties",
          "b",
          "enum"
        ],
        "severity": 1,
        "range": {
          "start": {
            "line": 23,
            "character": 17
          },
          "end": {
            "line": 24,
            "character": 44
          }
        }
      }
    ];

    expect(res).toEqual(expectedResult);
  });
  test('should pass responses with unrelated enums and proper booleans', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
