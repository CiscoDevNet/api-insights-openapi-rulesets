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

import getVersion from './getVersion.js';
import { describe, expect, jest, test } from '@jest/globals';

describe('getVersion', () => {
    const serverUrls = [
        {
          url: 'http://api.example1.com/v1.2/',
          version: 'v1.2'
        },
        {
          url: 'http://api.example1.com/v1',
          version: 'v1'
        }
      ]
      
      const paths = [
        {
          path: 'v2/my/bad/path',
          version: 'v2'
        },
        {
          path: '/v2.1.0/my/path',
          version: 'v2.1.0'
        },
        {
          path: '/api/v1/cloudonramp/saas',
          version: 'v1'
        },
        {
          path: '/api/v1/config-group',
          version: 'v1'
        },
        {
          path: '/api/v1/config-group/{configGroupId}',
          version: 'v1'
        },
        {
          path: '/api/v2/data/device/statistics/interfacestatistics/fields',
          version: 'v2'
        },
        {
          path: '/api/device/dhcpv6/intesface',
          version: ''
        },
        {
          path: '/api/v2.1.0/device/dhcpv6/intesface',
          version: 'v2.1.0'
        },
        {
          path: '/api/device/interface/ipv6Stats',
          version: ''
        },
        {
          path: '/api/device/ip/v4fib',
          version: ''
        },
        {
          path: '/api/device/ip/v6fib',
          version: ''
        },
        {
          path: '/api/device/ipsec/ikev1',
          version: ''
        },
        {
          path: '/api/device/ipsec/ikev2',
          version: ''
        },
        {
          path: '/api/device/ipv6/nd6',
          version: ''
        },
        {
          path: '/api/device/ndv6',
          version: ''
        },
        {
          path: '/api/device/omp/routes/advertised/ompIpv6',
          version: ''
        },
        {
          path: '/api/device/omp/routes/received/ompIpv6',
          version: ''
        },
        {
          path: '/api/device/ospf/v3interface',
          version: ''
        },
        {
          path: '/api/device/ospf/v3neighbor',
          version: ''
        },
        {
          path: '/api/device/policy/ipv6/accesslistassociations',
          version: ''
        },
        {
          path: '/api/device/policy/ipv6/accesslistcounters',
          version: ''
        },
        {
          path: '/api/device/policy/ipv6/accesslistnames',
          version: ''
        },
        {
          path: '/api/device/policy/ipv6/accesslistpolicers',
          version: ''
        },
        {
          path: '/api/device/roleBasedIpv6Counters',
          version: ''
        },
        {
          path: '/api/device/roleBasedIpv6Permissions',
          version: ''
        },
        {
          path: '/api/template/policy/definition/aclv6',
          version: ''
        },
        {
          path: '/api/template/policy/definition/aclv6/bulk',
          version: ''
        },
        {
          path: '/api/template/policy/definition/aclv6/multiple/{id}',
          version: ''
        },
        {
          path: '/api/template/policy/definition/aclv6/{id}',
          version: ''
        },
        {
          path: '/api/template/policy/definition/deviceaccesspolicyv6',
          version: ''
        },
        {
          path: '/api/template/policy/definition/deviceaccesspolicyv6/bulk',
          version: ''
        },
        {
          path: '/api/template/policy/definition/deviceaccesspolicyv6/multiple/{id}',
          version: ''
        }
      ]
      

      test('should return the version from the server urls', () => {
        serverUrls.forEach(serverUrl => {
            const version = getVersion(serverUrl.url);
            expect(version).toEqual(serverUrl.version);
            });
      });

      test('should return the version from the paths', () => {
        paths.forEach(path => {
            const version = getVersion(path.path);
            expect(version).toEqual(path.version);
        });
    });  
});

