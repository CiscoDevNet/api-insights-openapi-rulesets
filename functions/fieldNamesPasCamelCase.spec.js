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

import fieldNamesPasCamelCase from './fieldNamesPasCamelCase';

describe('fieldNamesPasCamelCase', () => {
  test('should pass a word with proper PasCamelCase: \'StreamIO\'', () => {
    expect(fieldNamesPasCamelCase('StreamIO', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should pass a word with proper PascalCase: \'StreamIo\'', () => {
    expect(fieldNamesPasCamelCase('StreamIo', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should pass a word with proper camelCase: \'streamIo\'', () => {
    expect(fieldNamesPasCamelCase('streamIO', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should pass an abbreviation with proper PasCamelCase: \'IO\'', () => {
    expect(fieldNamesPasCamelCase('IO', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should pass an abbreviation with proper PascalCase: \'Io\'', () => {
    expect(fieldNamesPasCamelCase('Io', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should pass an abbreviation with proper camelCase: \'iO\'', () => {
    expect(fieldNamesPasCamelCase('iO', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should pass an abbreviation that is all lowercase: \'io\'', () => {
    expect(fieldNamesPasCamelCase('io', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should pass a word with abbreviation at beginning with proper PasCamelCase: \'IOStream\'', () => {
    expect(fieldNamesPasCamelCase('IOStream', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should pass a word with abbreviation at end with proper PasCamelCase: \'StreamIO\'', () => {
    expect(fieldNamesPasCamelCase('StreamIO', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should detect a PasCamelCase word with non-word chars: \'Stream.IO\'', () => {
    expect(fieldNamesPasCamelCase('Stream.IO', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeTruthy();
  });

  test('should detect a word with hyphens: \'My-Name\'', () => {
    expect(fieldNamesPasCamelCase('My-Name', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeTruthy();
  });

  test('should detect a word with underscores: \'My_Name\'', () => {
    expect(fieldNamesPasCamelCase('My_Name', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeTruthy();
  });

  test('should pass the word \'_id\', which is one of the exceptions', () => {
    expect(fieldNamesPasCamelCase('_id', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should pass the word \'x-cisco-data-classification\', which is one of the exceptions', () => {
    expect(fieldNamesPasCamelCase('x-cisco-data-classification', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should pass parameter objects in the header, which is one of the exceptions', () => {
    expect(fieldNamesPasCamelCase({ name: 'Content-Type', in: 'header' }, null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should pass definitive valid words from git issue', () => {
    expect(fieldNamesPasCamelCase('IOStream', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();

    expect(fieldNamesPasCamelCase('StreamIO', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();

    expect(fieldNamesPasCamelCase('deviceSN', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();

    expect(fieldNamesPasCamelCase('deviceID', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();

    expect(fieldNamesPasCamelCase('DeviceID', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();

    expect(fieldNamesPasCamelCase('pathASNs', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();

    expect(fieldNamesPasCamelCase('dscpCP', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();

    expect(fieldNamesPasCamelCase('awsVPC', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should detect definitive invalid words from git issue', () => {
    expect(fieldNamesPasCamelCase('snake_case', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeTruthy();
  });

  test('should pass strings that do not start with numbers', () => {
    expect(fieldNamesPasCamelCase('lessThan30DaysCount', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();

    expect(fieldNamesPasCamelCase('greaterThan30LessThan60DaysCount', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();

    expect(fieldNamesPasCamelCase('greaterThan60LessThan90DaysCount', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();

    expect(fieldNamesPasCamelCase('greaterThan90DaysCount', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeUndefined();
  });

  test('should detect strings that start with numbers', () => {
    expect(fieldNamesPasCamelCase('30DaysCount', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeTruthy();

    expect(fieldNamesPasCamelCase('30LessThan60DaysCount', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeTruthy();

    expect(fieldNamesPasCamelCase('60LessThan90DaysCount', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeTruthy();

    expect(fieldNamesPasCamelCase('90DaysCount', null, {
      path: [
        'path',
        'to',
        'value',
      ],
    })).toBeTruthy();
  });
});

