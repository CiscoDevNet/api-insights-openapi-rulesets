/**
 * Copyright 2022 Cisco Systems, Inc. and its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE/2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const { describe, expect, it } = require('@jest/globals');
const { Spectral } = require('@stoplight/spectral-core');
const { readFileSync } = require('fs');
const { join } = require('path');
const ruleset = require('../../validation.js').default;

describe('Integration Tests - undefined-required-properties YAML Files', () => {
  let spectral;

  beforeEach(() => {
    spectral = new Spectral();
    spectral.setRuleset(ruleset);
  });

  describe('undefined-required-properties rule', () => {
    it('should detect undefined required properties in 3.0.x file', async () => {
      const yamlPath = join(__dirname, '../resources/undefined-required-properties/undefined-required-properties-3.0.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasSeveritiesError = undefinedRequiredErrors.some(
        error => error.message.includes("'severities' is not defined")
      );
      expect(hasSeveritiesError).toBe(true);
    });

    it('should detect undefined required properties in 3.1.x file', async () => {
      const yamlPath = join(__dirname, '../resources/undefined-required-properties/undefined-required-properties-3.1.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasSeveritiesError = undefinedRequiredErrors.some(
        error => error.message.includes("'severities' is not defined")
      );
      expect(hasSeveritiesError).toBe(true);
    });

    it('should detect undefined required properties in device interface scope', async () => {
      const yamlPath = join(__dirname, '../resources/undefined-required-properties/device-interface-scope-3.0.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasSwitchIdError = undefinedRequiredErrors.some(
        error => error.message.includes("'switchid' is not defined")
      );
      expect(hasSwitchIdError).toBe(true);
    });

    it('should detect undefined required properties in smart switch integration', async () => {
      const yamlPath = join(__dirname, '../resources/undefined-required-properties/smart-switch-integration-3.0.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasSwitchNameError = undefinedRequiredErrors.some(
        error => error.message.includes("'switchName' is not defined")
      );
      expect(hasSwitchNameError).toBe(true);
    });

    it('should detect undefined required properties in base permit deny entry', async () => {
      const yamlPath = join(__dirname, '../resources/undefined-required-properties/base-permit-deny-entry-3.0.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasProtocolError = undefinedRequiredErrors.some(
        error => error.message.includes("'protocol' is not defined")
      );
      expect(hasProtocolError).toBe(true);
    });

    it('should detect undefined required properties in summary properties', async () => {
      const yamlPath = join(__dirname, '../resources/undefined-required-properties/summary-properties-3.0.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasTypeError = undefinedRequiredErrors.some(
        error => error.message.includes("'type' is not defined")
      );
      expect(hasTypeError).toBe(true);
    });

    it('should detect undefined required properties in device interface complete scenario', async () => {
      const yamlPath = join(__dirname, '../resources/undefined-required-properties/device-interface-complete-3.0.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors.length).toBeGreaterThanOrEqual(4);
      
      // Check that we have the expected error messages
      const errorMessages = undefinedRequiredErrors.map(error => error.message);
      const hasSwitchIdError = errorMessages.some(msg => msg.includes("'switchid' is not defined"));
      const hasVlanIdError = errorMessages.some(msg => msg.includes("'vlanId' is not defined"));
      const hasPortNumberError = errorMessages.some(msg => msg.includes("'portNumber' is not defined"));
      const hasConfigurationError = errorMessages.some(msg => msg.includes("'configuration' is not defined"));
      
      expect(hasSwitchIdError).toBe(true);
      expect(hasVlanIdError).toBe(true);
      expect(hasPortNumberError).toBe(true);
      expect(hasConfigurationError).toBe(true);
    });

    it('should detect undefined required properties in smart switch complete scenario', async () => {
      const yamlPath = join(__dirname, '../resources/undefined-required-properties/smart-switch-complete-3.0.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors.length).toBeGreaterThanOrEqual(4);
      
      // Check that we have the expected error messages
      const errorMessages = undefinedRequiredErrors.map(error => error.message);
      const hasSwitchNameError = errorMessages.some(msg => msg.includes("'switchName' is not defined"));
      const hasIncludeMetricsError = errorMessages.some(msg => msg.includes("'includeMetrics' is not defined"));
      const hasConfigurationError = errorMessages.some(msg => msg.includes("'configuration' is not defined"));
      const hasResultError = errorMessages.some(msg => msg.includes("'result' is not defined"));
      
      expect(hasSwitchNameError).toBe(true);
      expect(hasIncludeMetricsError).toBe(true);
      expect(hasConfigurationError).toBe(true);
      expect(hasResultError).toBe(true);
    });

    it('should detect undefined required properties in security policies complete scenario', async () => {
      const yamlPath = join(__dirname, '../resources/undefined-required-properties/security-policies-complete-3.0.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors.length).toBeGreaterThanOrEqual(4);
      
      // Check that we have the expected error messages
      const errorMessages = undefinedRequiredErrors.map(error => error.message);
      const hasProtocolError = errorMessages.some(msg => msg.includes("'protocol' is not defined"));
      const hasPriorityError = errorMessages.some(msg => msg.includes("'priority' is not defined"));
      const hasDestinationError = errorMessages.some(msg => msg.includes("'destination' is not defined"));
      const hasRulesError = errorMessages.some(msg => msg.includes("'rules' is not defined"));
      
      expect(hasProtocolError).toBe(true);
      expect(hasPriorityError).toBe(true);
      expect(hasDestinationError).toBe(true);
      expect(hasRulesError).toBe(true);
    });

    it('should detect undefined required properties in reports summary complete scenario', async () => {
      const yamlPath = join(__dirname, '../resources/undefined-required-properties/reports-summary-complete-3.0.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors.length).toBeGreaterThanOrEqual(4);
      
      // Check that we have the expected error messages
      const errorMessages = undefinedRequiredErrors.map(error => error.message);
      const hasTypeError = errorMessages.some(msg => msg.includes("'type' is not defined"));
      const hasGroupByError = errorMessages.some(msg => msg.includes("'groupBy' is not defined"));
      const hasFormatError = errorMessages.some(msg => msg.includes("'format' is not defined"));
      const hasMetadataError = errorMessages.some(msg => msg.includes("'metadata' is not defined"));
      
      expect(hasTypeError).toBe(true);
      expect(hasGroupByError).toBe(true);
      expect(hasFormatError).toBe(true);
      expect(hasMetadataError).toBe(true);
    });

    it('should pass for valid schema with all required properties defined', async () => {
      const yamlPath = join(__dirname, '../resources/undefined-required-properties/valid-schema-3.0.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const undefinedRequiredErrors = results.filter(
        result => result.code === 'undefined-required-properties'
      );
      
      expect(undefinedRequiredErrors).toHaveLength(0);
    });
  });
});