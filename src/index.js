import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { refs } from './js/refs.js';
import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

refs.searchBoxCountry.addEventListener(
  'input',
  debounce(onSearch, DEBOUNCE_DELAY)
);

function onSearch() {
  const nameOfCountry = refs.searchBoxCountry.value.trim();
  if (nameOfCountry === '') {
    clearMarkupContent();
    return;
  }

  fetchCountries(nameOfCountry)
    .then(response => {
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
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearMarkupContent();
    });
}

function countrySearchMarkup({ name, flags }) {
  const countryMarkup = `<li class="country-list__item"><img src="${flags.svg}" width="25" height="20" alt="${name.official}"> ${name.official} </li>`;
  refs.countryList.insertAdjacentHTML('beforeend', countryMarkup);
}

function countryDescriptionMarkup({
  name,
  flags,
  capital,
  population,
  languages,
}) {
  const countryDescriptionMarkup = `<p class="country-main"><img src="${
    flags.svg
  }" width="30px" height="25px" alt="${name.official}">${name.official}</p>
        <ul class="country-description">
          <li>Capital: ${capital}</li>
          <li>Population: ${population}</li>
          <li>languages: ${Object.values(languages)} </li>
          </ul>`;
  refs.countryInfo.insertAdjacentHTML('beforeend', countryDescriptionMarkup);
}

function clearMarkupContent() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
