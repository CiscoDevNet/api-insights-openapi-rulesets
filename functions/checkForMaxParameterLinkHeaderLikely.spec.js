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

import checkForMaxParameterLinkHeaderLikely from './checkForMaxParameterLinkHeaderLikely.js';
// Some constants for assisting with cutting down bulk on test cases.
const path = [
  'paths',
  '/test',
];
const maxQueryMessage = {
  message: 'When returning a paginated collection, include a "max" query parameter',
  path: [...path],
};
const linkHeaderMessage = {
  message: 'When returning a paginated collection, include a "Link" header in the response',
  path: [
    ...path,
    'responses',
    '200',
  ],
};
const bothMessages = [
  maxQueryMessage,
  linkHeaderMessage,
];
const contextGen = (format) => ({
  rule: {
    formats: new Set([{ displayName: format }]),
  },
  path,
});

describe('checkForMaxParameterLinkHeaderLikely', () => {
  describe('openapi 3.0', () => {
    const context = contextGen('OpenAPI 3.0');

    describe('negative test cases', () => {
      test('should not flag an endpoint that does not return a collection', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    type: 'number',
                  },
                },
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toBeUndefined();
      });
      test('should not flag an endpoint that returns an object with a second-level array', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      description: {
                        type: 'string',
                      },
                      childItems: {
                        properties: {
                          items: {
                            type: 'array',
                          },
                        },
                        type: 'object',
                      },
                    },
                    type: 'object',
                  },
                },
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toBeUndefined();
      });
      test('should not flag a non-200 endpoint that returns an object encasing an array', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '204': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      items: {
                        type: 'array',
                      },
                    },
                    type: 'object',
                  },
                },
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toBeUndefined();
      });
      test('should not flag anything if both max query parameter and Link response header exist', () => {
        expect.assertions(1);
        const endpoint = {
          parameters: [
            {
              in: 'query',
              name: 'max',
            },
          ],
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      items: {
                        type: 'array',
                      },
                    },
                    type: 'object',
                  },
                },
              },
              headers: {
                Link: {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toBeUndefined();
      });
      test('should not flag undefined input', () => {
        expect.assertions(1);
        expect(checkForMaxParameterLinkHeaderLikely(undefined, undefined, context)).toBeUndefined();
      });
      test('should not flag an endpoint that has multiple first-level child arrays ', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      anarray: {
                        type: 'array',
                      },
                      someObject: {
                        type: 'object',
                      },
                      anotherArray: {
                        type: 'array',
                      },
                    },
                    type: 'object',
                  },
                },
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toBeUndefined();
      });
    });
    describe('positive test cases', () => {
      test('should flag an endpoint that returns an array', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                  },
                },
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toEqual(bothMessages);
      });
      test('should flag an endpoint that has a single first-level child array', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      anarray: {
                        type: 'array',
                      },
                    },
                    type: 'object',
                  },
                },
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toEqual(bothMessages);
      });
      test('should flag an endpoint that has a child with name items', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      somedata: {
                        type: 'integer',
                      },
                      items: {
                        type: 'array',
                      },
                    },
                    type: 'object',
                  },
                },
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toEqual(bothMessages);
      });
      test('should only flag missing Link header if max query parameter exists', () => {
        expect.assertions(1);
        const endpoint = {
          parameters: [
            {
              in: 'query',
              name: 'max',
            },
          ],
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      items: {
                        type: 'array',
                      },
                    },
                    type: 'object',
                  },
                },
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toEqual([linkHeaderMessage]);
      });
      test('should only flag missing max query parameter if Link header exists', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      items: {
                        type: 'array',
                      },
                    },
                    type: 'object',
                  },
                },
              },
              headers: {
                Link: {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toEqual([maxQueryMessage]);
      });
      test('should only flag missing Link header if max query parameter exists', () => {
        expect.assertions(1);
        const endpoint = {
          parameters: [
            {
              in: 'query',
              name: 'max',
            },
          ],
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      items: {
                        type: 'array',
                      },
                    },
                    type: 'object',
                  },
                },
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toEqual([linkHeaderMessage]);
      });
    });
  });
  describe('openapi (swagger) 2.0', () => {
    const context = contextGen('OpenAPI 2.0 (Swagger)');

    describe('negative test cases', () => {
      test('should not flag an endpoint that does not return a collection', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              schema: {
                type: 'number',
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toBeUndefined();
      });
      test('should not flag an endpoint that returns an object with a second-level array', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              schema: {
                properties: {
                  description: {
                    type: 'string',
                  },
                  childItems: {
                    properties: {
                      items: {
                        type: 'array',
                      },
                    },
                    type: 'object',
                  },
                },
                type: 'object',
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toBeUndefined();
      });
      test('should not flag a non-200 endpoint that returns an object encasing an array', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '204': {
              schema: {
                properties: {
                  items: {
                    type: 'array',
                  },
                },
                type: 'object',
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toBeUndefined();
      });
      test('should not flag anything if both max query parameter and Link response header exist', () => {
        expect.assertions(1);
        const endpoint = {
          parameters: [
            {
              in: 'query',
              name: 'max',
            },
          ],
          responses: {
            '200': {
              schema: {
                properties: {
                  items: {
                    type: 'array',
                  },
                },
                type: 'object',
              },
              headers: {
                Link: {
                  type: 'string',
                },
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toBeUndefined();
      });
      test('should not flag undefined input', () => {
        expect.assertions(1);
        expect(checkForMaxParameterLinkHeaderLikely(undefined, undefined, context)).toBeUndefined();
      });
      test('should not flag an endpoint that has multiple first-level child arrays ', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              schema: {
                properties: {
                  anarray: {
                    type: 'array',
                  },
                  anObject: {
                    type: 'object',
                  },
                  anotherarray: {
                    type: 'array',
                  },
                },
                type: 'object',
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toBeUndefined();
      });
    });
    describe('positive test cases', () => {
      test('should flag an endpoint that returns an array', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              schema: {
                type: 'array',
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toEqual(bothMessages);
      });
      test('should flag an endpoint that returns an object encasing an array as the only first level child', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              schema: {
                properties: {
                  anarray: {
                    type: 'array',
                  },
                },
                type: 'object',
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toEqual(bothMessages);
      });
      test('should flag an endpoint that has a child with name items', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              schema: {
                properties: {
                  somedata: {
                    type: 'integer',
                  },
                  items: {
                    type: 'array',
                  },
                },
                type: 'object',
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toEqual(bothMessages);
      });
      test('should only flag missing Link header if max query parameter exists', () => {
        expect.assertions(1);
        const endpoint = {
          parameters: [
            {
              in: 'query',
              name: 'max',
            },
          ],
          responses: {
            '200': {
              schema: {
                properties: {
                  items: {
                    type: 'array',
                  },
                },
                type: 'object',
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toEqual([linkHeaderMessage]);
      });
      test('should only flag missing max query parameter if Link header exists', () => {
        expect.assertions(1);
        const endpoint = {
          responses: {
            '200': {
              schema: {
                properties: {
                  items: {
                    type: 'array',
                  },
                },
                type: 'object',
              },
              headers: {
                Link: {
                  type: 'string',
                },
              },
            },
          },
        };

        expect(checkForMaxParameterLinkHeaderLikely(endpoint, undefined, context)).toEqual([maxQueryMessage]);
      });
    });
  });
});
