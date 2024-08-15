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

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'For every attribute that is present in the OAS document, if a description is proposed as optional to complement that attribute, then yes it must be present; description is missing in the object',
        path: [
          'paths',
          '/test',
          'get',
          'parameters',
          '0',
        ],
        range: {
          end: {
            character: 29,
            line: 36,
          },
          start: {
            character: 11,
            line: 29,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'For every attribute that is present in the OAS document, if a description is proposed as optional to complement that attribute, then yes it must be present; description is missing in the object',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
        ],
        range: {
          end: {
            character: 32,
            line: 72,
          },
          start: {
            character: 16,
            line: 41,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'For every attribute that is present in the OAS document, if a description is proposed as optional to complement that attribute, then yes it must be present; description is missing in the object',
        path: [
          'components',
          'schemas',
          'Pet',
        ],
        range: {
          end: {
            character: 28,
            line: 160,
          },
          start: {
            character: 12,
            line: 143,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'For every attribute that is present in the OAS document, if a description is proposed as optional to complement that attribute, then yes it must be present; description is missing in the object',
        path: [
          'components',
          'schemas',
          'Error',
          'properties',
          'message',
        ],
        range: {
          end: {
            character: 28,
            line: 184,
          },
          start: {
            character: 20,
            line: 183,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass with provided description', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.json`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
