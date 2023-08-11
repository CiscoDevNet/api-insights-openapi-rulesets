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

const ruleName = 'oas3-post-201-created';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should throw an error if POST 201 does not have \'Created\' description', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'POST operations which create objects return 201 Created, with a full or reference-only representation.; "[201].content" property must be truthy',
        path: [
          'paths',
          '/test',
          'post',
          'responses',
          '201',
        ],
        range: {
          end: {
            character: 32,
            line: 21,
          },
          start: {
            character: 14,
            line: 20,
          },
        },
        severity: 0,
      },
      {
        code: ruleName,
        message: 'POST operations which create objects return 201 Created, with a full or reference-only representation.; "[201].content" property must be truthy',
        path: [
          'paths',
          '/other/test',
          'post',
          'responses',
          '201',
        ],
        range: {
          end: {
            character: 30,
            line: 30,
          },
          start: {
            character: 14,
            line: 29,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should verify POST 201 responses have description \'Created\' and some sort of response', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
