const core = require('@actions/core');
const { addedDiff } = require('deep-object-diff');
const fs = require('fs/promises');
/** @type {import('just-extend').default} */
// @ts-expect-error typings don't handle CJS properly, but this works
const extend = require('just-extend');
const path = require('path');

(async function main() {
  try {
    const rawMappings = core.getInput('mappings');
    if (!rawMappings) return core.setFailed('mappings not defined');
    const splitMappings = rawMappings.split(',');
    const mappings = new Map();
    splitMappings.forEach(m => {
      const [root, sub] = m.trim().split('=>');
      mappings.set(sub.trim(), root.trim());
    });
    
    for (const [sub, root] of mappings.entries()) {
      core.startGroup(sub);
      const parsedSub = await getParsed(sub);
      const parsedRoot = await getParsed(root);

      core.info(`Copying new strings from ${root}.json to ${sub}.json...`);
      const diff = addedDiff(parsedSub, parsedRoot);
      const updated = extend(true, parsedSub, diff);
      core.info(`Writing updated ${sub}.json...`);
      await fs.writeFile(localePath(sub), JSON.stringify(updated, null, 2), 'utf-8');
      core.info('Done');
      core.endGroup();
    }
  } catch (err) {
    core.setFailed(err.message);
  }
}());

async function getParsed(locale) {
  core.info(`Retrieving ${locale}.json...`);
  const raw = await fs.readFile(localePath(locale), 'utf-8');
  return JSON.parse(raw);
}

function localePath(locale) {
  return path.join(__dirname, '../../../src/localize/languages/', `${locale}.json`);
}
