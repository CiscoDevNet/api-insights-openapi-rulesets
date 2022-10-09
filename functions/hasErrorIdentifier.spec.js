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

import hasErrorIdentifier from './hasErrorIdentifier.js';


const contextGen = (format) => {
  return {
    documentInventory: {
      document: {
        formats: new Set([{ displayName: format }]),
      },
    },
  };
};

describe('hasErrorIdentifier', () => {
  test('should error for a completely missing input', () => {
    expect.assertions(1);
    expect(hasErrorIdentifier(null, {}, { documentInventory: { document: { formats: contextGen('OpenAPI 3.0') } } }))
            .toEqual([
              {
                message: 'Error representations include an identifier to help with troubleshooting.',
              },
            ]);
  });
  describe('openapi 3', () => {
    const context = {
      documentInventory: {
        document: {
          formats: contextGen('OpenAPI 3.0'),
        },
      },
    };

    test('should error if there is no object returned', () => {
      const spec = {
        content: {
          'application/json': {
            schema: {
              type: 'number',
            },
          },
        },
      };

      expect(hasErrorIdentifier(spec, {}, context))
                .toEqual([
                  {
                    message: 'Error representations include an identifier to help with troubleshooting.',
                  },
                ]);
    });
    test('should error if there is no valid tracking property in the response', () => {
      const spec = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      expect(hasErrorIdentifier(spec, {}, context))
                .toEqual([
                  {
                    message: 'Error representations include an identifier to help with troubleshooting.',
                  },
                ]);
    });
    test('should pass with a valid tracking property ("code") in the response', () => {
      const spec = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                CODE: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      expect(hasErrorIdentifier(spec, {}, context)).toBeUndefined();
    });
    test('should pass with a valid tracking property ("code") in the response if nested one level', () => {
      const spec = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                ERROR: {
                  type: 'object',
                  properties: {
                    CODE: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      };

      expect(hasErrorIdentifier(spec, {}, context)).toBeUndefined();
    });
    test('should pass with a valid tracking property ("trackingId") in the response', () => {
      const spec = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                trackingID: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      expect(hasErrorIdentifier(spec, {}, context)).toBeUndefined();
    });
    test('should pass with a valid tracking property ("trackingId") in the response if nested one level', () => {
      const spec = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                ERROR: {
                  type: 'object',
                  properties: {
                    CODE: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      };

      expect(hasErrorIdentifier(spec, {}, context)).toBeUndefined();
    });
  });
  describe('openapi 2', () => {
    const context = contextGen('OpenAPI 2.0 (Swagger)');

    test('should error if there is no object returned', () => {
      const spec = {
        schema: {
          type: 'number',
        },
      };

      expect(hasErrorIdentifier(spec, {}, context))
                .toEqual([
                  {
                    message: 'Error representations include an identifier to help with troubleshooting.',
                  },
                ]);
    });
    test('should error if there is no valid tracking property in the response', () => {
      const spec = {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
          },
        },
      };

      expect(hasErrorIdentifier(spec, {}, context))
                .toEqual([
                  {
                    message: 'Error representations include an identifier to help with troubleshooting.',
                  },
                ]);
    });
    test('should pass with a valid tracking property ("code") in the response', () => {
      const spec = {
        schema: {
          type: 'object',
          properties: {
            CODE: {
              type: 'string',
            },
          },
        },
      };

      expect(hasErrorIdentifier(spec, {}, context)).toBeUndefined();
    });
    test('should pass with a valid tracking property ("code") in the response if nested one level', () => {
      const spec = {
        schema: {
          type: 'object',
          properties: {
            ERROR: {
              type: 'object',
              properties: {
                CODE: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      expect(hasErrorIdentifier(spec, {}, context)).toBeUndefined();
    });
    test('should pass with a valid tracking property ("trackingId") in the response', () => {
      const spec = {
        schema: {
          type: 'object',
          properties: {
            trackingID: {
              type: 'string',
            },
          },
        },
      };

      expect(hasErrorIdentifier(spec, {}, context)).toBeUndefined();
    });
    test('should pass with a valid tracking property ("trackingId") in the response if nested one level', () => {
      const spec = {
        schema: {
          type: 'object',
          properties: {
            ERROR: {
              type: 'object',
              properties: {
                CODE: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      expect(hasErrorIdentifier(spec, {}, context)).toBeUndefined();
    });
  });
});
