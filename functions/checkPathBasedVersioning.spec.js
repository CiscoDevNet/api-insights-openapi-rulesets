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

import checkPathBasedVersioning from './checkPathBasedVersioning.js';
const hasVersionErrorMsg = 'API uses path-based versioning.';
const onlyMajorErrorMsg = 'API shows only major version numbers on the path; not the revision numbers.';

describe('checkPathBasedVersioning', () => {
  test('should check version in servers - oas3', () => {
    const res = checkPathBasedVersioning({
      openapi: '3.0.3',
      servers: [
        {
          url: 'https://example.com/v1',
        },
      ],
    }, { onlyMajor: false, specVersion: 'oas3' });

    expect(res).toBeUndefined();
  });
  test('should throw error if no version - oas3', () => {
    const res = checkPathBasedVersioning({
      openapi: '3.0.3',
      servers: [
        {
          url: 'https://example.com/',
        },
      ],
      paths: {
        '/test': {},
      },
    }, { onlyMajor: false, specVersion: 'oas3' });

    expect(res).toEqual([
      {
        message: hasVersionErrorMsg,
      },
    ]);
  });
  test('should check version in basePath - oas2', () => {
    const res = checkPathBasedVersioning({
      swagger: '2.0',
      basePath: 'example.com/v1',
    }, { onlyMajor: false, specVersion: 'oas2' });

    expect(res).toBeUndefined();
  });
  test('should throw error if no version - oas2', () => {
    const res = checkPathBasedVersioning({
      swagger: '2.0',
      basePath: 'example.com',
      paths: {
        '/test': {},
      },
    }, { onlyMajor: false, specVersion: 'oas2' });

    expect(res).toEqual([
      {
        message: hasVersionErrorMsg,
      },
    ]);
  });
  test('should check version in endpoint paths - oas2', () => {
    const res = checkPathBasedVersioning({
      swagger: '2.0',
      basePath: 'example.com/v1',
      paths: {
        '/test/v1': {},
      },
    }, { onlyMajor: false, specVersion: 'oas2' });

    expect(res).toBeUndefined();
  });
  test('should check version in endpoint paths - oas3', () => {
    const res = checkPathBasedVersioning({
      openapi: '3.0.3',
      servers: [
        {
          url: 'https://example.com/v1',
        },
      ],
      paths: {
        '/test/v1': {},
      },
    }, { onlyMajor: false, specVersion: 'oas3' });

    expect(res).toBeUndefined();
  });
  test('should check version in endpoint paths - oas3', () => {
    const res = checkPathBasedVersioning({
      openapi: '3.0.3',
      servers: [
        {
          url: 'https://example.com/v1',
        },
      ],
      paths: {
        '/test/v1': {},
      },
    }, { onlyMajor: false, specVersion: 'oas3' });

    expect(res).toBeUndefined();
  });
  test('should check revision numbers in version - oas3', () => {
    const res = checkPathBasedVersioning({
      openapi: '3.0.3',
      servers: [
        {
          url: 'https://example.com/',
        },
      ],
    }, { onlyMajor: true, specVersion: 'oas3' });

    expect(res).toEqual([
      {
        message: onlyMajorErrorMsg,
      },
    ]);
  });
  test('should check revision numbers in version', () => {
    const res = checkPathBasedVersioning({
      openapi: '3.0.3',
      servers: [
        {
          url: 'https://example.com/v1.0',
        },
      ],
    }, { onlyMajor: true, specVersion: 'oas3' });

    expect(res).toEqual([
      {
        message: onlyMajorErrorMsg,
      },
    ]);
  });
});
