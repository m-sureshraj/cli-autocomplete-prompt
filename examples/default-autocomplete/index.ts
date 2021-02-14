import { autoComplete, ListItem } from '../../src';

const list = [
  { label: 'lib/cli/index.js', value: 'lib/cli/index.js' },
  { label: 'lib/cli/print.js', value: 'lib/cli/print.js' },
  { label: 'lib/mocha/run.js', value: 'lib/mocha/run.js' },
  { label: 'foo.js', value: 'foo.js' },
  { label: 'bar.js', value: 'bar.js' },
  { label: 'cool.ts', value: 'cool.ts' },
  { label: '.eslintrc.js', value: '.eslintrc.js' },
  { label: '.nvmrc', value: '.nvmrc' },
];

(async () => {
  const options = {
    promptLabel: 'filter › ',
    list,
    onSubmit: (matches: ListItem[]) => matches.map(match => match.value),
    limit: 4,
  };
  const results = await autoComplete(options);

  console.log(results);
})();
