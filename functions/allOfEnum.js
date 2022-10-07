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

'use strict';
export default function (input, opts) {
  if (!input || !Array.isArray(input)) {
    return;
  }

  const copiedVal = input.map((val) => val.toLowerCase());
  const values = opts?.values ?? '';
  const missingValues = [];

  for (const value of values) {
    if (!copiedVal.includes(value.toLowerCase())) {
      missingValues.push(value);
    }
  }

  if (missingValues.length > 0) {
    return [
      {
        message: `The following values are missing from the enum: ${ missingValues.toString() }.`,
      },
    ];
  }
}

