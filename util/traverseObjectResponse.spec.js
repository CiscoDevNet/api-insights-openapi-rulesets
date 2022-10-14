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

import traverseObjectResponse from './traverseObjectResponse.js';
import { jest } from '@jest/globals';
describe('traverseObjectResponse', () => {
  const counterFn = jest.fn((spec, name, path) => {
    expect(spec).toBeTruthy();
    expect(name).toBeTruthy();
    expect(path).toBeTruthy();
    expect(path.length).toBeGreaterThan(0);
  });

  beforeEach(() => {
    counterFn.mockClear();
  });
  test('should be able to handle a normal input', () => {
    expect.assertions(9);
    const spec = {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
        },
        name: {
          type: 'string',
        },
      },
    };

    traverseObjectResponse(spec, counterFn);
    expect(counterFn).toHaveBeenCalledTimes(2);
  });
  test('should be able to handle nested input', () => {
    expect.assertions(21);
    const spec = {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
        },
        name: {
          type: 'string',
        },
        more: {
          type: 'object',
          properties: {
            hello: {
              type: 'string',
            },
            world: {
              type: 'string',
            },
          },
        },
      },
    };

    traverseObjectResponse(spec, counterFn);
    expect(counterFn).toHaveBeenCalledTimes(5);
  });
  test('should be able to handle basic arrays', () => {
    expect.assertions(1);
    const spec = {
      type: 'array',
      items: {
        type: 'number',
      },
    };

    traverseObjectResponse(spec, counterFn);
    expect(counterFn).toHaveBeenCalledTimes(0);
  });
  test('should be able to handle a basic array with an object', () => {
    expect.assertions(9);
    const spec = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
          },
          name: {
            type: 'string',
          },
        },
      },
    };

    traverseObjectResponse(spec, counterFn);
    expect(counterFn).toHaveBeenCalledTimes(2);
  });
  test('should be able to handle an array with an object with nested objects', () => {
    expect.assertions(45);
    const spec = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
          },
          name: {
            type: 'string',
          },
          test: {
            type: 'object',
            properties: {
              hello: {
                type: 'string',
              },
              world: {
                type: 'string',
              },
              more: {
                type: 'object',
                properties: {
                  lorem: {
                    type: 'number',
                  },
                  ipsum: {
                    type: 'string',
                  },
                },
              },
              evenMore: {
                type: 'object',
                properties: {
                  lorem: {
                    type: 'string',
                  },
                  ipsum: {
                    type: 'number',
                  },
                },
              },
            },
          },
        },
      },
    };

    traverseObjectResponse(spec, counterFn);
    expect(counterFn).toHaveBeenCalledTimes(11);
  });
  test('should be able to handle a wonderfully complex input', () => {
    expect.assertions(69);
    const spec = {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        name: {
          type: 'string',
        },
        amount: {
          type: 'number',
        },
        accounts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              accountId: {
                type: 'number',
              },
              name: {
                type: 'string',
              },
            },
          },
        },
        customers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              customerId: {
                type: 'number',
              },
              name: {
                type: 'string',
              },
              accounts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    accountId: {
                      type: 'number',
                    },
                    name: {
                      type: 'string',
                    },
                  },
                },
              },
              sites: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    streetAddress: {
                      type: 'string',
                    },
                    city: {
                      type: 'string',
                    },
                    state: {
                      type: 'string',
                    },
                    zipCode: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    traverseObjectResponse(spec, counterFn);
    expect(counterFn).toHaveBeenCalledTimes(17);
  });
  test('should find an object in a deep nested array', () => {
    expect.assertions(9);
    const spec = {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                id: {
                  type: 'number',
                },
              },
            },
          },
        },
      },
    };

    traverseObjectResponse(spec, counterFn);
    expect(counterFn).toHaveBeenCalledTimes(2);
  });
});
