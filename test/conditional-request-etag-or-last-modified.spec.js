import fsPromises from 'fs/promises';
import path from 'path';
import CiscoLinter from '../src/CiscoLinter';
import { prepLinter } from '../src/util/testUtils';
const ruleName = 'conditional-request-etag-or-last-modified';
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
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(async () => {
    spectral = new CiscoLinter(undefined);
    await prepLinter(spectral, 'cisco-without-oas', ruleName);
  });

  test('should throw an error if conditional request does not contain etag or last-modified', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: "Conditional requests are designed with 'Etag' or 'Last-Modified' headers (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)",
        path: [
          'paths',
          '/test/{testId}',
          'get',
        ],
        range: {
          start: {
            line: 14,
            character: 8,
          },
          end: {
            line: 32,
            character: 32,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: "Conditional requests are designed with 'Etag' or 'Last-Modified' headers (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)",
        path: [
          'paths',
          '/anotherTest',
          'get',
        ],
        range: {
          start: {
            line: 34,
            character: 8,
          },
          end: {
            line: 50,
            character: 28,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('should pass if conditional request contains etag or last-modified header for openapi v3', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });

  test('should pass if conditional request contains etag or last-modified header for openapi v2', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-oas2.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
