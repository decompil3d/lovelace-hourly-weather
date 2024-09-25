import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import ignore from './rollup-plugins/ignore.mjs';
import * as ignoreTextfield from './elements/ignore/textfield.mjs';
const { ignoreTextfieldFiles } = ignoreTextfield;
import * as ignoreSelect from './elements/ignore/select.mjs';
const { ignoreSelectFiles } = ignoreSelect;
import * as ignoreSwitch from './elements/ignore/switch.mjs';
const { ignoreSwitchFiles } = ignoreSwitch;
import { defineConfig } from 'rollup';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

export default defineConfig({
  input: ['src/hourly-weather.ts'],
  output: {
    file: 'dist/hourly-weather.js',
    format: 'es',
    sourcemap: true,
    inlineDynamicImports: true
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.TIPPY_CSS': JSON.stringify(
        fs.readFileSync(path.join(__dirname, 'node_modules/tippy.js/dist/tippy.css'), 'utf8'))
    }),
    resolve(),
    commonjs({
      include: [
        'node_modules/is-valid-css-color/**'
      ]
    }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          inlineSourceMap: false
        }
      }
    }),
    json(),
    babel({
      exclude: 'node_modules/**',
    }),
    terser(),
    serve({
      contentBase: './dist',
      host: '0.0.0.0',
      port: 5555,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }),
    ignore({
      files: [...ignoreTextfieldFiles, ...ignoreSelectFiles, ...ignoreSwitchFiles].map((file) => require.resolve(file)),
    }),
  ],
})
