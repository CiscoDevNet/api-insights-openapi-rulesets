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
import ruleset from '../documentation';
const ruleName = 'description-for-every-attribute';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should throw an error if missing description', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.json`);
    const res = await spectral.run(spec.toString());
    const expectResult = [
      {
        "code": "description-for-every-attribute",
        "message": "Every attribute in the OpenAPI document must have a description. Description fields that are marked as optional must be filled.; description is missing in the object",
        "path": [
          "paths",
          "/test",
          "get",
          "parameters",
          "0"
        ],
        "severity": 0,
        "range": {
          "start": {
            "line": 29,
            "character": 11
          },
          "end": {
            "line": 36,
            "character": 29
          }
        }
      },
      {
        "code": "description-for-every-attribute",
        "message": "Every attribute in the OpenAPI document must have a description. Description fields that are marked as optional must be filled.; description is missing in the object",
        "path": [
          "paths",
          "/test",
          "get",
          "responses",
          "200"
        ],
        "severity": 0,
        "range": {
          "start": {
            "line": 41,
            "character": 16
          },
          "end": {
            "line": 72,
            "character": 32
          }
        }
      },
      {
        "code": "description-for-every-attribute",
        "message": "Every attribute in the OpenAPI document must have a description. Description fields that are marked as optional must be filled.; description is missing in the object",
        "path": [
          "components",
          "schemas",
          "Pet"
        ],
        "severity": 0,
        "range": {
          "start": {
            "line": 143,
            "character": 12
          },
          "end": {
            "line": 160,
            "character": 28
          }
        }
      },
      {
        "code": "description-for-every-attribute",
        "message": "Every attribute in the OpenAPI document must have a description. Description fields that are marked as optional must be filled.; description is missing in the object",
        "path": [
          "components",
          "schemas",
          "Error",
          "properties",
          "message"
        ],
        "severity": 0,
        "range": {
          "start": {
            "line": 183,
            "character": 20
          },
          "end": {
            "line": 184,
            "character": 28
          }
        }
      }
    ];

    expect(res).toEqual(expectResult);
  });
  test('should pass with provided description', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.json`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
