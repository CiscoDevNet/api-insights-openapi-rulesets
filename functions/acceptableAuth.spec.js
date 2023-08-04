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

import acceptableAuth from './acceptableAuth.js';
describe('acceptableAuth', () => {
  test('should allow oauth2 (implicit, authorizationCode, clientCredentials) - oas3', () => {
    const res = acceptableAuth({
      flows: {
        authorizationCode: {},
        clientCredentials: {},
        implicit: {},
      },
      type: 'oauth2',
    });

    expect(res).toBeUndefined();
  });
  test('should allow oauth2 (application) - oas2', () => {
    const res = acceptableAuth({
      flow: 'application',
      type: 'oauth2',
    });

    expect(res).toBeUndefined();
  });
  test('should not allow oauth2 (password) - oas3', () => {
    const res = acceptableAuth({
      flows: {
        password: {},
      },
      type: 'oauth2',
    });

    expect(res).toEqual([
      {
        message: 'My API authenticates requests using access tokens; NOT username/passwords.',
      },
    ]);
  });
  test('should allow http (bearer) - oas3', () => {
    const res = acceptableAuth({
      scheme: 'bearer',
      type: 'http',
    });

    expect(res).toBeUndefined();
  });
  test('should not allow http (basic) - oas3', () => {
    const res = acceptableAuth({
      scheme: 'basic',
      type: 'http',
    });

    expect(res).toEqual([
      {
        message: 'My API authenticates requests using access tokens; NOT username/passwords.',
      },
    ]);
  });
  test('should not allow http (basic) - oas2', () => {
    const res = acceptableAuth({
      type: 'basic',
    });

    expect(res).toEqual([
      {
        message: 'My API authenticates requests using access tokens; NOT username/passwords.',
      },
    ]);
  });
  test('should allow apiKey', () => {
    const res = acceptableAuth({
      type: 'apiKey',
    });

    expect(res).toBeUndefined();
  });
  test('should allow openIdConnect - oas3', () => {
    const res = acceptableAuth({
      type: 'openIdConnect',
    });

    expect(res).toBeUndefined();
  });
});
