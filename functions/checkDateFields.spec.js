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

import checkDateFields from './checkDateFields.js';
const pathToTest = [
  'this',
  'is',
  'a',
  'test',
];

describe('checkDateFields', () => {
  test('should flag a common field name that is not a date-time', () => {
    const spec = {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        name: {
          type: 'string',
        },
        updatedAt: {
          type: 'string',
        },
      },
    };

    expect(checkDateFields(spec, {}, { path: pathToTest })).toEqual([
      {
        message: 'Field updatedAt should be type "string" with a format of "date-time".',
        path: [
          ...pathToTest,
          'properties',
          'updatedAt',
        ],
      },
    ]);
  });
  test('should flag a "date" field name that is not a date-time', () => {
    const spec = {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        name: {
          type: 'string',
        },
        startDate: {
          type: 'string',
        },
        endDate: {
          type: 'string',
          format: 'date',
        },
        date: {
          type: 'string',
        },
      },
    };

    expect(checkDateFields(spec, {}, { path: pathToTest })).toEqual([
      {
        message: 'Field startDate should be type "string" with a format of "date-time".',
        path: [
          ...pathToTest,
          'properties',
          'startDate',
        ],
      },
      {
        message: 'Field endDate should be type "string" with a format of "date-time".',
        path: [
          ...pathToTest,
          'properties',
          'endDate',
        ],
      },
      {
        message: 'Field date should be type "string" with a format of "date-time".',
        path: [
          ...pathToTest,
          'properties',
          'date',
        ],
      },
    ]);
  });
  test('should flag an array that should contain dates', () => {
    const spec = {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        name: {
          type: 'string',
        },
        startDates: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        endDates: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        dates: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    };

    expect(checkDateFields(spec, {}, { path: pathToTest })).toEqual([
      {
        message: 'Field startDates\'s items should be type "string" with a format of "date-time".',
        path: [
          ...pathToTest,
          'properties',
          'startDates',
          'items',
        ],
      },
      {
        message: 'Field endDates\'s items should be type "string" with a format of "date-time".',
        path: [
          ...pathToTest,
          'properties',
          'endDates',
          'items',
        ],
      },
      {
        message: 'Field dates\'s items should be type "string" with a format of "date-time".',
        path: [
          ...pathToTest,
          'properties',
          'dates',
          'items',
        ],
      },
    ]);
  });
  test('should pass fields flagged as date fields that are of type "date-time"', () => {
    const spec = {
      id: {
        type: 'number',
      },
      name: {
        type: 'string',
      },
      startDate: {
        type: 'string',
        format: 'date-time',
      },
      endDate: {
        type: 'string',
        format: 'date-time',
      },
      dates: {
        type: 'array',
        items: {
          type: 'string',
          format: 'date-time',
        },
      },
    };

    expect(checkDateFields(spec, {}, { path: pathToTest })).toBeUndefined();
  });
});
