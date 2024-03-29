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
/* eslint-env jest */
import { prepLinter } from '../util/testUtils';
import ruleset from '../api-insights-openapi-ruleset';
const ruleName = 'oas3-get-collection-max-parameter-link-header-required-possible';
const resPath =  path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should flag a collection (array) xml response', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-array-xml.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When returning a paginated collection, include a "max" query parameter',
        path: [
          'paths',
          '/test',
          'get',
        ],
        range: {
          start: {
            line: 14,
            character: 8,
          },
          end: {
            line: 25,
            character: 25,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When supporting offset-based pagination, operations include a "offset" query parameter',
        path: [
          'paths',
          '/test',
          'get',
        ],
        range: {
          start: {
            line: 14,
            character: 8,
          },
          end: {
            line: 25,
            character: 25,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When returning a paginated collection, include a "Link" header in the response',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
        ],
        range: {
          start: {
            line: 20,
            character: 14,
          },
          end: {
            line: 25,
            character: 25,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should flag a collection (array wrapped in object) json response', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-object-json.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When returning a paginated collection, include a "max" query parameter',
        path: [
          'paths',
          '/test',
          'get',
        ],
        range: {
          start: {
            line: 14,
            character: 8,
          },
          end: {
            line: 28,
            character: 25,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When supporting offset-based pagination, operations include a "offset" query parameter',
        path: [
          'paths',
          '/test',
          'get',
        ],
        range: {
          start: {
            line: 14,
            character: 8,
          },
          end: {
            line: 28,
            character: 25,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When returning a paginated collection, include a "Link" header in the response',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
        ],
        range: {
          start: {
            line: 20,
            character: 14,
          },
          end: {
            line: 28,
            character: 25,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should flag a collection where it has multiple child arrays (guess that it is a collection)', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-object-multi-array.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When returning a paginated collection, include a "max" query parameter',
        path: [
          'paths',
          '/test',
          'get',
        ],
        range: {
          start: {
            line: 14,
            character: 8,
          },
          end: {
            line: 32,
            character: 25,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When supporting offset-based pagination, operations include a "offset" query parameter',
        path: [
          'paths',
          '/test',
          'get',
        ],
        range: {
          start: {
            line: 14,
            character: 8,
          },
          end: {
            line: 32,
            character: 25,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When returning a paginated collection, include a "Link" header in the response',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
        ],
        range: {
          start: {
            line: 20,
            character: 14,
          },
          end: {
            line: 32,
            character: 25,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should only flag missing max query parameter if Link header, offset parameter is present', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-max-parameter.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When returning a paginated collection, include a "max" query parameter',
        path: [
          'paths',
          '/test',
          'get',
        ],
        range: {
          start: {
            line: 14,
            character: 8,
          },
          end: {
            line: 34,
            character: 28,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should only flag missing offset query parameter if Link header, max query parameter is present', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-offset-parameter.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When supporting offset-based pagination, operations include a "offset" query parameter',
        path: [
          'paths',
          '/test',
          'get',
        ],
        range: {
          start: {
            line: 14,
            character: 8,
          },
          end: {
            line: 34,
            character: 28,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should only flag missing Link header if max query parameter, offset parameter is present', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-link-header.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When returning a paginated collection, include a "Link" header in the response',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
        ],
        range: {
          start: {
            line: 29,
            character: 14,
          },
          end: {
            line: 34,
            character: 25,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should flag responses from an endpoint with an ID that is not last', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative-id-not-last.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When returning a paginated collection, include a "max" query parameter',
        path: [
          'paths',
          '/test/{id}/children',
          'get',
        ],
        range: {
          start: {
            line: 14,
            character: 8,
          },
          end: {
            line: 34,
            character: 25,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When supporting offset-based pagination, operations include a "offset" query parameter',
        path: [
          'paths',
          '/test/{id}/children',
          'get',
        ],
        range: {
          start: {
            line: 14,
            character: 8,
          },
          end: {
            line: 34,
            character: 25,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'Pagination is designed using a \'max\' query parameter and \'Link\' headers per RFC 5988.; When returning a paginated collection, include a "Link" header in the response',
        path: [
          'paths',
          '/test/{id}/children',
          'get',
          'responses',
          '200',
        ],
        range: {
          start: {
            line: 26,
            character: 14,
          },
          end: {
            line: 34,
            character: 25,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should not flag responses without a collection', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-collection.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
  test('should not flag a response that already has a max query parameter, offset parameter and a Link header', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-all-present.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
  test('should not flag responses that end with an id', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive-no-id.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
