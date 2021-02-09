import { Autocomplete, AutocompleteOptions } from './Autocomplete';

function autoComplete(options: AutocompleteOptions): Promise<void> {
  return new Promise(resolve => {
    const autocomplete = new Autocomplete(options);

    autocomplete.on('submit', matches => {
      resolve(matches);
    });
  });
}

export { Autocomplete, AutocompleteOptions, autoComplete };
