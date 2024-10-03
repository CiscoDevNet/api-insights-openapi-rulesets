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

import { isObject } from '../util/funcUtils.js';
import getVersion from '../util/getVersion.js';


/**
 * Checks if there is only one version in server urls and paths.
 * @param {string} targetVal The string to lint
 * @param {object} opts checks to do
 */
export default function (targetVal, opts) {
  if (!isObject(targetVal) || !isObject(targetVal.paths)) {
    return;
  }

  const checkServerURLMissing = opts?.check === 'server-url-missing' ?? '';

  if (checkServerURLMissing) {
    for (const { path, url } of getAllServerURLs(targetVal)) {
      const version = getVersion(url);

      if (version === '') {
        return [
          {
            message: 'no version in server urls or basePath.',
            path,
          },
        ];
      }
    }

    return;
  }

  const results = [];
  let serverFirstVersion = '';

  for (const { url } of getAllServerURLs(targetVal)) {
    const version = getVersion(url);

    if (version === '') {
      continue;
    }

    if (serverFirstVersion === '') {
      serverFirstVersion = version;
    }

    if (serverFirstVersion !== version) {
      results.push({
        message: 'multi versions in servers.',
        path: ['servers'],
      });

      break;
    }
  }

  const { paths } = targetVal;

  let pathFirstVersion = '';

  for (const { path } of getAllPaths(paths)) {

    // Is there a version identified on the path, considering the path fragments exceptions if any
    let version;
    if (opts && opts.exceptions) {
      version = getVersion(path, opts.exceptions);
    }
    else {
      version = getVersion(path);
    }
    if (version === '') {
      continue;
    }

    // Check if the version detected is acceptable
    if (pathFirstVersion === '') {
      if (serverFirstVersion !== '') {
        results.push({
          message: `the path should not include a version number when the \'servers.url\' attribute already does: \'servers.url\' version detected is /${serverFirstVersion}`,
          path: ['paths', path],
        });
      }

      pathFirstVersion = version;
    }

    if (pathFirstVersion !== version) {
      results.push({
        message: `more than one version has been detected across paths: /${pathFirstVersion} and /${version}`,
        path: ['paths', path],
      });
    }
  }

  return results;
}

function* getAllPaths(paths) {
  if (!isObject(paths)) {
    return;
  }

  const item = {
    path: '',
  };

  for (const path of Object.keys(paths)) {
    item.path = path;
    yield item;
  }
}

function* getAllServerURLs(doc) {
  const item = {
    path: [],
    url: '',
  };

  if (doc.swagger) {
    item.path = ['basePath'];
    item.url = doc.basePath || '';
    yield item;

    return;
  }

  if (!Array.isArray(doc.servers)) {
    return;
  }

  for (let i = 0; i < doc.servers.length; i++) {
    item.path = ['servers', i];

    let { url } = doc.servers[i];
    const vars = url.match(/{([^}]+)}/g);

    if (vars) {
      for (const v of vars) {
        url = url.replace(v, doc.servers[i].variables?.[v.slice(1, -1)]?.default);
      }
    }

    item.url = url;
    yield item;
  }
}
