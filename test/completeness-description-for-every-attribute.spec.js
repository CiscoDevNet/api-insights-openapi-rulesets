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
import ruleset from '../completeness';

const ruleName = 'description-for-every-attribute';
const resPath = path.join(__dirname, `resources/completeness-${ ruleName }`);

describe(`completeness: ${ruleName}`, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });

  test('should NOT require description on requestBody (requestBody.description is optional per OpenAPI spec)', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/requestBody-no-description.json`);
    const res = await spectral.run(spec.toString());

    // Filter results to only check for requestBody-related errors
    const requestBodyErrors = res.filter(r => 
      r.path && r.path.includes('requestBody') && !r.path.includes('content')
    );

    // There should be NO errors for missing requestBody description
    expect(requestBodyErrors).toEqual([]);
  });

  test('should still require description on parameters', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/parameter-no-description.json`);
    const res = await spectral.run(spec.toString());

    // Should have error for parameter without description
    const paramErrors = res.filter(r => 
      r.path && r.path.includes('parameters')
    );

    expect(paramErrors.length).toBeGreaterThan(0);
    expect(paramErrors[0].code).toBe(ruleName);
  });

  test('should still require description on responses', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/response-no-description.json`);
    const res = await spectral.run(spec.toString());

    // Should have error for response without description
    const responseErrors = res.filter(r => 
      r.path && r.path.includes('responses')
    );

    expect(responseErrors.length).toBeGreaterThan(0);
    expect(responseErrors[0].code).toBe(ruleName);
  });

  test('should pass when all required descriptions are present', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.json`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});

