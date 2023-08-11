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

const shouldMatch = [
  'Wed, 13 Oct 2021 07:45:44 GMT',
  'Sat, 3 Jul 2021 23:03:02 GMT',
  'Mon, 7 Jun 2021 19:22:15 GMT',
  'Thu, 30 Sep 2021 15:17:22 GMT',
  'Wed, 24 Aug 2016 18:41:30 GMT', // Example from style guide
];
const shouldNotMatch = {
  'Fri, 12 Feb 2021 19:07:09 +0100': 'Only GMT offset allowed',
  'Mon, 11 Jan 2021 19:06:55 -0400': 'Only GMT offset allowed',
  'Tue, 28 Sep 2021 19:07:32 -0000': 'Only GMT offset allowed',
  'Tue, 28 Sep 2021 19:07:32 +0000': 'Only GMT offset allowed',
  'Thu 8 Apr 2021 19:06:27 GMT': 'Comma required after Day of Week',
  'Thu, 10 Jun 2021 5:31:50 GMT': 'Hour-minute-day should have 2 digits',
  'Thu, 10 Jun 2021 19:6:29 GMT': 'Hour-minute-day should have 2 digits',
  'Thu, 10 Jun 2021 19:22:3 GMT': 'Hour-minute-day should have 2 digits',
};

export default function (input) {
  try {
    const regex = new RegExp(input);

    // eslint-disable-next-line no-restricted-syntax
    for (const sample of shouldMatch) {
      if (!regex.exec(sample)) {
        return [
          {
            message: `The regex pattern used does not pass basic linting sample checks - should have matched case ${ sample }`,
          },
        ];
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const [sample, msg] of Object.entries(shouldNotMatch)) {
      if (regex.exec(sample)) {
        return [
          {
            message: `The regex pattern used does not pass basic linting sample checks - should not have matched case ${ sample } (${ msg })`,
          },
        ];
      }
    }
  } catch (err) {
    return [
      {
        message: 'Failed to parse regex',
      },
    ];
  }
}
