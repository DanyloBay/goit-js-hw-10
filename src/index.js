import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { refs } from './js/refs.js';
import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const onSearch = async () => {
  const nameOfCountry = refs.searchBoxCountry.value.trim();
  if (nameOfCountry === '') {
    clearMarkupContent();
    return;
  }

  try {
    const response = await fetchCountries(nameOfCountry);
    clearMarkupContent();
    let isNotifyDisplayed = false;
    response.map(({ name, flags, capital, population, languages }) => {
      if (response.length > 10 && !isNotifyDisplayed) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        isNotifyDisplayed = true;
        return;
      } else if (response.length > 2 && response.length < 10) {
        countrySearchMarkup({ name, flags });
      } else if (response.length === 1) {
        countryDescriptionMarkup({
          name,
          flags,
          capital,
          population,
          languages,
        });
      }
    });
  } catch (error) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
    clearMarkupContent();
  }
};

const countrySearchMarkup = async ({ name, flags }) => {
  const countryMarkup =
    await `<li class="country-list__item"><img src="${flags.svg}" width="25" height="20" alt="${name.official}"> ${name.official} </li>`;
  return await refs.countryList.insertAdjacentHTML('beforeend', countryMarkup);
};

const countryDescriptionMarkup = async ({
  name,
  flags,
  capital,
  population,
  languages,
}) => {
  const countryDescriptionMarkup = await `<p class="country-main"><img src="${
    flags.svg
  }" width="30px" height="25px" alt="${name.official}">${name.official}</p>
        <ul class="country-description">
          <li>Capital: ${capital}</li>
          <li>Population: ${population}</li>
          <li>languages: ${Object.values(languages)} </li>
          </ul>`;
  return await refs.countryInfo.insertAdjacentHTML(
    'beforeend',
    countryDescriptionMarkup
  );
};

const clearMarkupContent = () => {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
};

refs.searchBoxCountry.addEventListener(
  'input',
  debounce(onSearch, DEBOUNCE_DELAY)
);
