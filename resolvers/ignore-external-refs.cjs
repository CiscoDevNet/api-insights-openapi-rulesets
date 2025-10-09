// Copyright 2024 Cisco Systems, Inc. and its affiliates.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Custom resolver for Spectral that behaves like the default resolver
 * but does not resolve external dependencies (e.g., URLs pointing to HTTP/HTTPS links).
 * This prevents network timeouts and 504 errors when processing OpenAPI specs
 * that contain external $ref attributes in examples (like SCIM specifications).
 * 
 * External references are returned as-is without modification, while internal
 * references (starting with #) are processed normally by the default resolver.
 */

const { Resolver } = require("@stoplight/json-ref-resolver");
const { URL } = require('url');

class CustomResolver extends Resolver {
  constructor() {
    super();
  }

  async resolve(ref, baseUri, options) {
    try {
      const parsedUrl = new URL(ref);

      if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
        if (process.env.DEBUG_SPECTRAL_RESOLVER) {
          console.log(`[CUSTOM-RESOLVER] Ignoring external $ref: '${parsedUrl.href}'`);
        }
        return ref;
      }
      
      return super.resolve(ref, baseUri, options);
      
    } catch (e) {
      if (process.env.DEBUG_SPECTRAL_RESOLVER) {
        console.log(`[CUSTOM-RESOLVER] Deferring to default resolver for ref: '${ref}'`);
      }
      return super.resolve(ref, baseUri, options);
    }
  }
}
module.exports = new Resolver({
  resolvers: {
    http: new CustomResolver(),
    https: new CustomResolver()
  }
});
