import { basename } from 'path';

import { dim } from 'kleur';

import { JestStyleAutocomplete } from './JestStyleAutocomplete';
import { ListItem, AutocompleteOptions } from '../../src';
import { data } from './data';

const options = {
  list: data.map((value: string) => ({ label: value, value })),
  onSubmit: (matches: ListItem[]) =>
    matches.map(match => basename(match.value as string)),
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

(async () => {
  const results = await jestStyleAutocomplete(options);
  console.log(results);
})();
