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

const ruleName = 'oas2-path-based-versioning-major-only';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should detect if there are revision numbers in the version - oas2', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'API shows only major version numbers on the path; not the revision numbers.',
        path: [],
        range: {
          start: {
            line: 0,
            character: 0,
          },
          end: {
            line: 24,
            character: 25,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass for valid version - oas2', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
