const { autoComplete } = require('../src/index');

const list = [
    { value: 'hello.js', label: 'foo' },
    { value: 'foo.js', label: 'bar' },
    { value: 'zee.js', label: 'baz' },
];

autoComplete({
    list,
    format: ({ value }: { value: string }) => value,
}).then(results => {
    console.log(results);
}).catch(error => {
    console.error(error);
});
