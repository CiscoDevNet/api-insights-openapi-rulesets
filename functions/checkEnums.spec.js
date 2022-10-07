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

import checkForBooleanEnums from './checkEnums.js';
const testEnums = [
  [
    'yes',
    'no',
  ],
  [
    'on',
    'off',
  ],
  [
    'true',
    'false',
  ],
];

describe('checkEnums', () => {
  describe('shouldMatch set to "false"', () => {
    const testOptions = {
      enums: testEnums,
      shouldMatch: false,
      caseSensitive: false,
    };

    test('should pass valid enums', () => {
      expect.assertions(4);
      const expected1 = [
        'yes',
        'no',
        'maybe',
      ];
      const expected2 = [
        'hello',
        'goodbye',
      ];
      const expected1Clone = [...expected1];
      const expected2Clone = [...expected2];

      expect(checkForBooleanEnums(expected1Clone, testOptions)).toBeUndefined();
      expect(checkForBooleanEnums(expected2Clone, testOptions)).toBeUndefined();
      // Make sure our original arrays were not modified.
      expect(expected1Clone).toEqual(expected1);
      expect(expected2Clone).toEqual(expected2);
    });
    test('should fail enums that could easily be replaced by booleans', () => {
      expect.assertions(6);
      const expected1 = [
        'no',
        'yes',
      ];
      const expected2 = [
        'false',
        'true',
      ];
      const expected3 = [
        'off',
        'on',
      ];
      const expected1Clone = [...expected1];
      const expected2Clone = [...expected2];
      const expected3Clone = [...expected3];

      expect(checkForBooleanEnums(expected1Clone, testOptions)).toEqual([
        {
          message: 'Given matches target enums.',
        },
      ]);
      expect(checkForBooleanEnums(expected2Clone, testOptions)).toEqual([
        {
          message: 'Given matches target enums.',
        },
      ]);
      expect(checkForBooleanEnums(expected3Clone, testOptions)).toEqual([
        {
          message: 'Given matches target enums.',
        },
      ]);
      // Make sure our original arrays were not modified.
      expect(expected1Clone).toEqual(expected1);
      expect(expected2Clone).toEqual(expected2);
      expect(expected3Clone).toEqual(expected3);
    });
  });
  describe('case sensitivity', () => {
    test('with case sensitivity - should fail enums that are the same but different cases', () => {
      expect.assertions(2);
      const testOptions = {
        enums: testEnums,
        shouldMatch: true,
        caseSensitive: true,
      };
      const expected = [
        'TrUe',
        'FaLsE',
      ];
      const expectedClone = [...expected];

      expect(checkForBooleanEnums(expectedClone, testOptions)).toEqual([
        {
          message: 'Given does not match target enums.',
        },
      ]);
      expect(expectedClone).toEqual(expected);
    });
    test('no case sensitivity - should pass enums that are the same but different cases', () => {
      expect.assertions(2);
      const testOptions = {
        enums: testEnums,
        shouldMatch: true,
        caseSensitive: false,
      };
      const expected = [
        'TrUe',
        'FaLsE',
      ];
      const expectedClone = [...expected];

      expect(checkForBooleanEnums(expectedClone, testOptions)).toBeUndefined();
      expect(expectedClone).toEqual(expected);
    });
  });
  test('should not throw an error if an object is passed in', () => {
    expect.assertions(1);
    const testOptions = {
      enums: testEnums,
      shouldMatch: true,
      caseSensitive: false,
    };

    expect(checkForBooleanEnums({}, testOptions)).toBeUndefined();
  });
});
