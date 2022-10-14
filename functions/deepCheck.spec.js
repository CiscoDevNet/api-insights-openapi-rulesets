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

import deepCheck from './deepCheck.js';
describe('deepCheck', () => {
  const opts = {
    prerequisite: [
      'hello',
      'world',
    ],
    search: 'test',
  };

  describe('TrackingID samples', () => {
    const trackingIdOptions = {
      prerequisite: ['headers'],
      search: 'TrackingID',
    };

    test('should flag if nothing is submitted to the function', () => {
      expect.assertions(1);
      expect(deepCheck(undefined, trackingIdOptions)).toEqual([
        {
          message: 'An expected pathway is missing. Prerequisite: "headers", search: "TrackingID"',
        },
      ]);
    });
    test('should flag if there is no TrackingID header', () => {
      const spec = {
        headers: {
          'X-Some-Special-Header': {
            schema: {
              type: 'string',
            },
          },
          'X-Another-Special-Header': {
            schema: {
              type: 'string',
            },
          },
        },
      };

      expect.assertions(1);
      expect(deepCheck(spec, trackingIdOptions)).toEqual([
        {
          message: 'An expected pathway is missing. Prerequisite: "headers", search: "TrackingID"',
        },
      ]);
    });
    test('should not flag if there is a TrackingID header', () => {
      const spec = {
        headers: {
          'X-Some-Special-Header': {
            schema: {
              type: 'string',
            },
          },
          trackingid: {
            schema: {
              type: 'string',
            },
          },
          'X-Another-Special-Header': {
            schema: {
              type: 'string',
            },
          },
        },
      };

      expect.assertions(1);
      expect(deepCheck(spec, trackingIdOptions)).toBeUndefined();
    });
  });
  test('should be able to handle a deep check with prerequisites fulfilled', () => {
    const spec = {
      hello: {
        world: {
          test: 'this is a test',
        },
      },
    };

    expect.assertions(1);
    expect(deepCheck(spec, opts)).toBeUndefined();
  });
  test('should flag a deep check that has incomplete prerequisites', () => {
    const spec = {
      hello: {},
    };

    expect.assertions(1);
    expect(deepCheck(spec, opts)).toEqual([
      {
        message: 'An expected pathway is missing. Prerequisite: "hello,world", search: "test"',
      },
    ]);
  });
});
