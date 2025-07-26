import fs from 'fs';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import ignore from './rollup-plugins/ignore';
import { ignoreTextfieldFiles } from './elements/ignore/textfield';
import { ignoreSelectFiles } from './elements/ignore/select';
import { ignoreSwitchFiles } from './elements/ignore/switch';
import { defineConfig } from 'rollup';

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
