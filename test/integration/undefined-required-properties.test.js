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

const { describe, expect, it } = require('@jest/globals');
const { Spectral } = require('@stoplight/spectral-core');
const ruleset = require('../../validation.js').default;

describe('Integration Tests - undefined-required-properties', () => {
  let spectral;

  beforeEach(() => {
    spectral = new Spectral();
    spectral.setRuleset(ruleset);
  });

  describe('should detect undefined required properties', () => {
    it('should catch missing severities property', async () => {
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
                        $ref: '#/components/schemas/ThresholdAnomaly'
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
            ThresholdAnomaly: {
              type: 'object',
              properties: {
                commonAnomaly: {
                  type: 'object',
                  description: 'Common anomaly configuration'
                }
                // severities property is missing but listed in required
              },
              required: ['commonAnomaly', 'severities']
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      // Should have at least 1 error for undefined-required-properties
      // The rule runs on multiple paths, so we might get duplicates
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasSeveritiesError = undefinedRequiredErrors.some(
        error => error.message.includes("'severities' is not defined")
      );
      expect(hasSeveritiesError).toBe(true);
      
      // Check that at least one error points to the correct schema
      const schemaErrors = undefinedRequiredErrors.filter(
        error => error.path.includes('components') && 
                 error.path.includes('schemas') && 
                 error.path.includes('ThresholdAnomaly')
      );
      expect(schemaErrors.length).toBeGreaterThanOrEqual(1);
    });

    it('should catch multiple missing required properties', async () => {
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
            TestSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                }
                // email and age are missing but listed in required
              },
              required: ['name', 'email', 'age']
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      // Should have at least 2 errors for undefined-required-properties
      // The rule runs on multiple paths, so we might get duplicates
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors.length).toBeGreaterThanOrEqual(2);
      
      // Check that we have the expected error messages
      const errorMessages = undefinedRequiredErrors.map(error => error.message);
      const hasEmailError = errorMessages.some(msg => msg.includes("'email' is not defined"));
      const hasAgeError = errorMessages.some(msg => msg.includes("'age' is not defined"));
      
      expect(hasEmailError).toBe(true);
      expect(hasAgeError).toBe(true);
    });

    it('should catch missing properties in response schemas', async () => {
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
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string'
                          }
                          // name is missing but listed in required
                        },
                        required: ['id', 'name']
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
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors).toHaveLength(1);
      expect(undefinedRequiredErrors[0].message).toContain("'name' is not defined");
    });

    it('should catch missing properties in request body schemas', async () => {
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
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string'
                        }
                        // description is missing but listed in required
                      },
                      required: ['title', 'description']
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
        }
      };

      const results = await spectral.run(document);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors).toHaveLength(1);
      expect(undefinedRequiredErrors[0].message).toContain("'description' is not defined");
    });

    it('should catch missing properties in parameter schemas', async () => {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {
          '/test': {
            get: {
              parameters: [
                {
                  name: 'filter',
                  in: 'query',
                  schema: {
                    type: 'object',
                    properties: {
                      category: {
                        type: 'string'
                      }
                      // status is missing but listed in required
                    },
                    required: ['category', 'status']
                  }
                }
              ],
              responses: {
                '200': {
                  description: 'OK'
                }
              }
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors).toHaveLength(1);
      expect(undefinedRequiredErrors[0].message).toContain("'status' is not defined");
    });
  });

  describe('should not flag valid schemas', () => {
    it('should pass when all required properties are defined', async () => {
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
                        $ref: '#/components/schemas/ValidSchema'
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
                name: {
                  type: 'string'
                },
                email: {
                  type: 'string',
                  format: 'email'
                },
                age: {
                  type: 'integer'
                }
              },
              required: ['name', 'email', 'age']
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors).toHaveLength(0);
    });

    it('should pass when schema has no required array', async () => {
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
                        $ref: '#/components/schemas/NoRequiredSchema'
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
            NoRequiredSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                }
              }
              // No required array
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors).toHaveLength(0);
    });

    it('should pass when schema is not an object type', async () => {
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
                        $ref: '#/components/schemas/StringSchema'
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
            StringSchema: {
              type: 'string',
              required: ['someProperty'] // This should be ignored for non-object schemas
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors).toHaveLength(0);
    });
  });
});
