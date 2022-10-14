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

const ruleName = 'oas2-request-header-accept-encoding-valid-enum';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should fail a request Accept-Encoding header accepts an invalid value in the enum', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Accept-Encoding accepts a value that is not valid per RFC 7231. (The following values must be removed: notvalid.) (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer) Please see https://www.iana.org/assignments/http-parameters/http-parameters.xhtml',
        path: [
          'paths',
          '/test',
          'get',
          'parameters',
          '0',
          'enum',
        ],
        range: {
          start: {
            line: 20,
            character: 15,
          },
          end: {
            line: 23,
            character: 22,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass a request Accept-Encoding header that accepts nothing but valid values in the enum', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
  test('should pass an invalid type Date when parameter is not in the header', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-non-header.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
