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
const ruleName = 'put-200-204-success';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should catch PUTs with both 200 and 204 status codes', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-both.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'PUT operations return either \'200 OK\' with full representation or \'204 No Content\' (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'put',
        ],
        range: {
          start: {
            line: 26,
            character: 8,
          },
          end: {
            line: 44,
            character: 33,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should catch PUTs without a 200 or 204 status code', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-neither.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'PUT operations return either \'200 OK\' with full representation or \'204 No Content\' (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'put',
        ],
        range: {
          start: {
            line: 26,
            character: 8,
          },
          end: {
            line: 35,
            character: 34,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should catch PUTs with 204 status code with content definition', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-204-content.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'PUT operations return either \'200 OK\' with full representation or \'204 No Content\' (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'put',
        ],
        range: {
          start: {
            line: 26,
            character: 8,
          },
          end: {
            line: 42,
            character: 28,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should catch PUTs with 204 status code with schema definition', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-204-schema.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'PUT operations return either \'200 OK\' with full representation or \'204 No Content\' (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'put',
        ],
        range: {
          start: {
            line: 23,
            character: 8,
          },
          end: {
            line: 38,
            character: 24,
          },
        },
        severity: 0,
      },
    ]);
  });
  test('should pass PUTs with 200 status code and no request or response bodies', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-200-no-bodies.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
  test('should pass PUTs with 200 status code in OAS3', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-200-oas3.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
  test('should pass PUTs with 200 status code in OAS2', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-200-oas2.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
  test('should pass PUTs with 200 status code with nested keys', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-nested.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
  test('should pass PUTs with 200 status code with nested keys and allOf/anyOf', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-allof-anyof.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
  test('should pass PUTs with 204 status code', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-204.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
