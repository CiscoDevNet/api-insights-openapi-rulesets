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

import casing from '@stoplight/spectral-functions/dist/casing';
import commonAbbreviations from './commonAbbreviations.js';

/**
 * Common abbreviations are removed from each value before a casing check, such
 * as IO. For example, 'streamIO' is considered valid to us, but it is neither
 * pascal nor camelcase, but after removing the 'IO' abbreviation, 'stream'
 * passes camelcase. Note: abbreviations in value are only removed if
 * capitalized, so 'function' will not become 'functn', etc.
 *
 * We do this as we have not yet found a reliable way to limit the number
 * of capitals letters through pure regex, and the casing functions themselves
 * do not validate all of the words we want (i.e. 'streamIO). Using a list of
 * defined acronyms allows us to be more lenient with casing overall, which is
 * our goal.
 */
const removeCommonAbbreviations = (value) => {
  commonAbbreviations.forEach((abbreviation) => {
    if (value.includes(abbreviation)) {
      value = value.replace(abbreviation, '');
    }
  });

  return value;
};

/**
 * Checks for correct
 * @param {string} value to check
 * @returns if the value is pascal or camel case ('PasCamelCase') and contains only non-numerical
 * symbolic characters (characters in alphabet only)
 */
const isPascalOrCamelCase = (value) => {
  // Spectral casing returns undefined when valid and object when not
  return (!casing(value, { type: 'pascal' }) || !casing(value, { type: 'camel' }));
};

export default function (value) {
  if (isPascalOrCamelCase(value)) {
    return true;
  }

  /* If word contains abbreviations from commonAbbreviations list, remove the
    abbreviations, e.g. 'IOstream' -> 'stream'. */
  const modifiedValue = removeCommonAbbreviations(value);

  return isPascalOrCamelCase(modifiedValue);
}

