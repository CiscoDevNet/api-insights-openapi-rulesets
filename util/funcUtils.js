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
import nlp from 'compromise';

/**
 * Determines if a word is a verb.
 * @param word.
 * @returns {Boolean} if word is a verb.
 */
export function isVerb(word) {
  return nlp(word).verbs().out('array').length > 0;
}

/**
 * Determines if a word is a noun.
 * @param word.
 * @returns {Boolean} if word is a noun.
 */
export function isNoun(word) {
  // pet can be verb or noun. This function will think single pet as verb.
  return nlp(word).nouns().out('array').length > 0;
  // return nlp(word).nouns().out('array').length > 0;
}

export function isObject(value) {
  return value !== null && typeof value === 'object';
}
