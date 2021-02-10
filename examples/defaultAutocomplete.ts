import { autoComplete } from '../src';

const list = [
  { label: 'lib/cli/index.js', value: 'lib/cli/index.js' },
  { label: 'lib/cli/print.js', value: 'lib/cli/print.js' },
  { label: 'lib/mocha/run.js', value: 'lib/mocha/run.js' },
  { label: '.eslintrc.js', value: { name: '.eslintrc.js', isDotFile: true } },
  { label: 'foo.js', value: 'foo.js' },
  { label: 'bar.js', value: 'bar.js' },
  { label: 'cool.ts', value: 'cool.ts' },
];

autoComplete({
  list,
  onSubmit: matches => matches.map(match => match.value),
  limit: 3,
})
  .then(results => {
    console.log(results);
  })
  .catch((error: Error) => {
    console.error(error);
  });
