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

/*
 * This is a list of all allowed codes for all methods.
 * Any codes not included in this list will be flagged as an ERROR.
 */
const commonCodes = [
  '200',
  '201',
  '202',
  '204',
  '301',
  '302',
  '303',
  '400',
  '401',
  '403',
  '404',
  '405',
  '406',
  '409',
  '410',
  '415',
  '422',
  '429',
  '500',
  '501',
  '503',
  '504',
  'default',
];
/*
 * This is a list of all disallowed codes per method.
 * If any of these codes are found for a given method it will
 * be flagged as an ERROR.
 */
const disallowedCodes = {
  delete: [
    '201',
    '202',
  ],
  get: [
    '201',
    '202',
    '204',
  ],
  patch: [
    '201',
    '202',
  ],
  post: ['204'],
  put: ['201'],
};

export default function (input, opts) {
  const { method = '' } = opts;
  // Get disallowed codes for method
  const disallowed = disallowedCodes[method.toLowerCase()];

  // ignore if the method is not GET, POST, PUT, PATCH, or DELETE
  if (!disallowed) {
    return;
  }

  // Filter out disallowed codes from common codes
  const acceptableCodes = commonCodes.filter((el) => {
    return disallowed.indexOf(el) < 0;
  });

  if (!acceptableCodes.includes(`${ input }`)) {
    return [
      {
        message: `${ input } is not an acceptable response code for ${ method.toUpperCase() }. My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges.`,
      },
    ];
  }
}
