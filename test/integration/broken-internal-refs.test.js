/**
 * Copyright 2022 Cisco Systems, Inc. and its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE/2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const { describe, expect, it } = require('@jest/globals');
const { Spectral } = require('@stoplight/spectral-core');
const ruleset = require('../../validation.js').default;

describe('Integration Tests - broken-internal-refs', () => {
  let spectral;

  beforeEach(() => {
    spectral = new Spectral();
    spectral.setRuleset(ruleset);
  });

  describe('should detect broken internal references', () => {
    it('should catch broken $ref in sibling properties', async () => {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {
          '/test': {
            get: {
              responses: {
                '200': {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/TestSchema'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            CommonAnomalyPolicy: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            },
            TestSchema: {
              type: 'object',
              properties: {
                commonAnomaly: {
                  $ref: '#/components/schemas/CommonAnomalyPolicy',
                  severities: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/PolicySeverity' // This reference is broken
                    }
                  }
                }
              }
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasPolicySeverityError = brokenRefErrors.some(
        error => error.message.includes("broken reference '#/components/schemas/PolicySeverity'")
      );
      expect(hasPolicySeverityError).toBe(true);
    });

    it('should catch multiple broken $refs in different locations', async () => {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {
          '/test': {
            get: {
              responses: {
                '200': {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/TestSchema'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            ValidSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            },
            TestSchema: {
              type: 'object',
              properties: {
                prop1: {
                  $ref: '#/components/schemas/ValidSchema',
                  nested: {
                    $ref: '#/components/schemas/NonExistent1' // Broken reference 1
                  }
                },
                prop2: {
                  $ref: '#/components/schemas/ValidSchema',
                  items: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/NonExistent2' // Broken reference 2
                    }
                  }
                }
              }
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThanOrEqual(2);
      
      // Check that we have the expected error messages
      const errorMessages = brokenRefErrors.map(error => error.message);
      const hasNonExistent1Error = errorMessages.some(msg => 
        msg.includes("broken reference '#/components/schemas/NonExistent1'")
      );
      const hasNonExistent2Error = errorMessages.some(msg => 
        msg.includes("broken reference '#/components/schemas/NonExistent2'")
      );
      
      expect(hasNonExistent1Error).toBe(true);
      expect(hasNonExistent2Error).toBe(true);
    });

    it('should catch broken $refs in deeply nested structures', async () => {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {
          '/test': {
            get: {
              responses: {
                '200': {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/TestSchema'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            ValidSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            },
            TestSchema: {
              type: 'object',
              properties: {
                data: {
                  $ref: '#/components/schemas/ValidSchema',
                  nested: {
                    deep: {
                      deeper: {
                        value: {
                          $ref: '#/components/schemas/DeepNonExistent' // Deeply nested broken reference
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasDeepError = brokenRefErrors.some(
        error => error.message.includes("broken reference '#/components/schemas/DeepNonExistent'")
      );
      expect(hasDeepError).toBe(true);
    });

    it('should catch broken $refs in array items', async () => {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {
          '/test': {
            get: {
              responses: {
                '200': {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/TestSchema'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            ValidSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            },
            TestSchema: {
              type: 'object',
              properties: {
                items: {
                  $ref: '#/components/schemas/ValidSchema',
                  arrayProp: [
                    {
                      $ref: '#/components/schemas/ArrayNonExistent' // Broken reference in array
                    }
                  ]
                }
              }
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasArrayError = brokenRefErrors.some(
        error => error.message.includes("broken reference '#/components/schemas/ArrayNonExistent'")
      );
      expect(hasArrayError).toBe(true);
    });

    it('should catch broken $refs in request body schemas', async () => {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {
          '/test': {
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/ValidSchema',
                      additionalProp: {
                        $ref: '#/components/schemas/RequestNonExistent' // Broken reference in request body
                      }
                    }
                  }
                }
              },
              responses: {
                '201': {
                  description: 'Created'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            ValidSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasRequestError = brokenRefErrors.some(
        error => error.message.includes("broken reference '#/components/schemas/RequestNonExistent'")
      );
      expect(hasRequestError).toBe(true);
    });

    it('should catch broken $refs in response schemas', async () => {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {
          '/test': {
            get: {
              responses: {
                '200': {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/ValidSchema',
                        responseProp: {
                          $ref: '#/components/schemas/ResponseNonExistent' // Broken reference in response
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            ValidSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasResponseError = brokenRefErrors.some(
        error => error.message.includes("broken reference '#/components/schemas/ResponseNonExistent'")
      );
      expect(hasResponseError).toBe(true);
    });
  });

  describe('should not flag valid references', () => {
    it('should pass when all $refs are valid', async () => {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {
          '/test': {
            get: {
              responses: {
                '200': {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/TestSchema'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            ValidSchema1: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            },
            ValidSchema2: {
              type: 'object',
              properties: {
                id: { type: 'string' }
              }
            },
            TestSchema: {
              type: 'object',
              properties: {
                prop1: {
                  $ref: '#/components/schemas/ValidSchema1',
                  nested: {
                    $ref: '#/components/schemas/ValidSchema2'
                  }
                }
              }
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      expect(brokenRefErrors).toHaveLength(0);
    });

    it('should pass when $ref has no sibling properties', async () => {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {
          '/test': {
            get: {
              responses: {
                '200': {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/TestSchema'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            ValidSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            },
            TestSchema: {
              type: 'object',
              properties: {
                prop1: {
                  $ref: '#/components/schemas/ValidSchema' // No sibling properties
                }
              }
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      expect(brokenRefErrors).toHaveLength(0);
    });

    it('should ignore external references', async () => {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {
          '/test': {
            get: {
              responses: {
                '200': {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/TestSchema'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            ValidSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            },
            TestSchema: {
              type: 'object',
              properties: {
                prop1: {
                  $ref: '#/components/schemas/ValidSchema',
                  externalRef: {
                    $ref: 'http://example.com/schema.json' // External reference - should be ignored
                  }
                }
              }
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      expect(brokenRefErrors).toHaveLength(0);
    });
  });
});
