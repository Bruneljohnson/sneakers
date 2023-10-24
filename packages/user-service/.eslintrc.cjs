module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.eslint.json", "./packages/*/tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "jest"],
  root: true,
  rules: {
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/require-await": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unnecessary-type-assertion": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "no-trailing-spaces": ["error", { skipBlankLines: true }],
    "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@typescript-eslint/no-unused-vars": "warn"
      }
    }
  ],
  env: {
    jest: true,
  },
  ignorePatterns: ["jest.config.ts", "bin/","lib", "coverage","cdk.out"],
};
