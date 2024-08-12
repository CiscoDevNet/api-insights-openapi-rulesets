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

import commonAbbreviations from './commonAbbreviations.js';
import  identifyCasingType  from './identifyCasingType.js';

const removeCommonAbbreviations = (string) => {
  const regex = new RegExp(`\\b(${ commonAbbreviations.join('|') })\\b`, 'g');

  return string.replace(regex, '').trim();
};

const checkConsistency = (strings) => {
  const cleanedStrings = strings.map(removeCommonAbbreviations).filter(Boolean);

  const casingCounts = cleanedStrings.reduce((acc, str) => {
    const type = identifyCasingType(str);

    acc[type] = (acc[type] || 0) + 1;

    return acc;
  }, {});

  const relevantTypes = Object.keys(casingCounts).filter((type) => type !== 'lowercase' && type !== 'unknown');

  const isConsistent = relevantTypes.length <= 1;

  if (!isConsistent) {
    const foundTypes = relevantTypes.length > 0 ? relevantTypes : ['lowercase', 'unknown'].filter((type) => casingCounts[type]);
    const typeDescriptions = foundTypes.map((type) => ({
      'camelCase': 'camel',
      'PascalCase': 'Pascal',
      'kebab-case': 'kebab',
      'snake_case': 'snake',
      'unknown': 'unknown',
    }[type] || type)).join(', ');

    return {
      message: `Inconsistent casing types detected. Found: ${ typeDescriptions }.`,
    };
  }

  return null; // Consistency found or acceptable ambiguity with 'lowercase'
};

export default checkConsistency;
