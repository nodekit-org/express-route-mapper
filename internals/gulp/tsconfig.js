module.exports = {
  "compilerOptions": {
    "allowSyntheticDefaultImports": false,
    // "allowJs": true,
    "baseUrl": "./",
    "declaration": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "module": "commonjs",
    // "noEmit": true,
    "moduleResolution": "node",
    "lib": [
      "es6",
      "es7"
    ],
    "strictNullChecks": true,
    "target": "es6"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "**/*/__temp"
  ],
};