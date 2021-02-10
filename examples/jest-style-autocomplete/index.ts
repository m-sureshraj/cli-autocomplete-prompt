import { dim } from 'kleur';

import { JestStyleAutocomplete } from './JestStyleAutocomplete';
import { ListItem, AutocompleteOptions } from '../../src';

const list = [
  { label: 'lib/cli/index.js', value: 'lib/cli/index.js' },
  { label: 'lib/cli/print.js', value: 'lib/cli/print.js' },
  { label: 'lib/mocha/run.js', value: 'lib/mocha/run.js' },
  { label: '.eslintrc.js', value: { name: '.eslintrc.js', isDotFile: true } },
  { label: 'foo.js', value: undefined },
  { label: 'bar.js', value: 100 },
  { label: 'baz.txt', value: ['no idea'] },
  { label: 'cool.ts', value: null },
];

const options = {
  list,
  onSubmit: (matches: ListItem[]) => matches.map(match => match.value),
  promptLabel: dim(' filter › '),
};

// Method 1 - Event emitter
// const autocomplete = new JestStyleAutocomplete(options);
// autocomplete.on('submit', console.log);

// Method 2 - Async/Await
function jestStyleAutocomplete(options: AutocompleteOptions): Promise<void> {
  return new Promise(resolve => {
    const autocomplete = new JestStyleAutocomplete(options);
    autocomplete.on('submit', resolve);
  });
}

jestStyleAutocomplete(options)
  .then(results => {
    console.log(results);
  })
  .catch((error: Error) => {
    console.error(error);
  });
