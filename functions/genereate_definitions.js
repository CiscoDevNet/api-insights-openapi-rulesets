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

var fs = require('fs');
const path = require('path');
var files = fs.readdirSync(__dirname);


const createTypes = (file) => {
  const filename = path.parse(file).name;

  const data = `import { RulesetFunction } from "@stoplight/spectral-core"
declare module "${ filename }" {
  export = RulesetFunction;
}
`;

  fs.writeFileSync(`${ filename }.d.ts`, data);
};

const updatedFiles = files.filter((file) => {
  const filetype = path.parse(file).ext;

  return filetype === '.js' && !file.includes('spec');
});

updatedFiles.forEach((file) => createTypes(file));
