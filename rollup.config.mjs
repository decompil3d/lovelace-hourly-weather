import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import visualizer from 'rollup-plugin-visualizer';
import ignore from './rollup-plugins/ignore';
import { ignoreTextfieldFiles } from './elements/ignore/textfield';
import { ignoreSelectFiles } from './elements/ignore/select';
import { ignoreSwitchFiles } from './elements/ignore/switch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const dev = process.env.ROLLUP_WATCH;
if (dev) console.log('Development build');

const serveopts = {
  contentBase: ['./dist'],
  host: '0.0.0.0',
  port: '5000',
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const plugins = [
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.TIPPY_CSS': JSON.stringify(
      fs.readFileSync(path.join(__dirname, 'node_modules/tippy.js/dist/tippy.css'), 'utf8'))
  }),
  nodeResolve({}),
  commonjs({
    include: [
      'node_modules/is-valid-css-color/**'
    ]
  }),
  typescript(),
  json(),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled'
  }),
  dev && serve(serveopts),
  !dev && terser(),
  ignore({
    files: [...ignoreTextfieldFiles, ...ignoreSelectFiles, ...ignoreSwitchFiles].map((file) => require.resolve(file)),
  }),
  visualizer()
];

export default [
  {
    input: 'src/hourly-weather.ts',
    output: {
      file: 'dist/hourly-weather.js',
      format: 'es',
      inlineDynamicImports: true
    },
    plugins: [...plugins],
  },
];
