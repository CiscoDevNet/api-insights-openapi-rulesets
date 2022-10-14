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

export default (responseBody, context) => {
  // TODO: Add support for "additionalProperties"
  // https://swagger.io/docs/specification/data-models/data-types/#additionalProperties
  // Be safe, use optional chaining
  // Format detection taken from https://github.com/stoplightio/spectral/blob/HEAD/src/rulesets/oas/functions/typedEnum.ts


  const formats = context?.documentInventory?.document?.formats;
  const isOAS2Format = formats instanceof Set && Array.from(formats)?.[0].displayName === 'OpenAPI 2.0 (Swagger)';

  if (isOAS2Format) { return responseBody?.schema?.properties; }

  // Assume oas3 by default if not caught by above conditional branch
  return responseBody?.content?.['application/json']?.schema?.properties;
};
