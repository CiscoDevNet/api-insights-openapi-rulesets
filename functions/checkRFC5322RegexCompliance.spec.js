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

import checkRFC5322RegexCompliance from './checkRFC5322RegexCompliance.js';
describe('checkRFC5322RegexCompliance', () => {
  test('should pass a valid regex', () => {
    const res = checkRFC5322RegexCompliance('^(((Mon|Tue|Wed|Thu|Fri|Sat|Sun)),\\s[0-9]{1,2})\\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s([0-9]{4})\\s([0-9]{2}):([0-9]{2})(:([0-9]{2}))?\\sGMT$');

    expect(res).toBeUndefined();
  });
  test('should fail a regex that does not require a comma', () => {
    const res = checkRFC5322RegexCompliance('^(((Mon|Tue|Wed|Thu|Fri|Sat|Sun))[,]?\\s[0-9]{1,2})\\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s([0-9]{4})\\s([0-9]{2}):([0-9]{2})(:([0-9]{2}))?\\sGMT$');

    expect(res).toEqual([
      {
        message: 'The regex pattern used does not pass basic linting sample checks - should not have matched case Thu 8 Apr 2021 19:06:27 GMT (Comma required after Day of Week)',
      },
    ]);
  });
});
