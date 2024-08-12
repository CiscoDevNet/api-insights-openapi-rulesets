const identifyCasingType = (string) => {
  if (/^[a-z]+$/.test(string)) return 'lowercase';
  if (/^[a-z]+(?:-[a-z]+)+$/.test(string)) return 'kebab-case';
  if (/^[a-z]+(?:_[a-z]+)+$/.test(string)) return 'snake_case';
  if (/^[A-Z][^A-Z]*$/.test(string)) return 'PascalCase';
  if (/^[A-Z][a-z]*((?:[A-Z][a-z]*)*)$/.test(string)) return 'PascalCase';
  if (/^[a-z]+(?:[A-Z][a-z]*)+$/.test(string)) return 'camelCase';

  return 'unknown';
};

export default identifyCasingType;

