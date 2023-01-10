import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchFieldRef: document.querySelector('#search-box'),
  countryListRef: document.querySelector('.country-list'),
  countryInfoRef: document.querySelector('.country-info'),
};

refs.searchFieldRef.addEventListener(
  'input',
  debounce(onSearch, DEBOUNCE_DELAY)
);

function onSearch(e) {
  const countryName = e.target.value.trim();
  if (countryName === '') {
    clearData();
    return;
  }
  fetchCountries(countryName).then(checkReceivedData).catch(onFetchError);
}

function checkReceivedData(countries) {
  if (countries.length > 10) {
    getInfoMessage();
  } else if (countries.length <= 10 && countries.length > 1) {
    renderCountriesList(countries);
  } else if (countries.length === 1) {
    renderCurrentCountry(countries);
  }
}

function getInfoMessage() {
  clearData();
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function renderCountriesList(countries) {
  const markup = countries
    .map(country => {
      const {
        name: { official, common },
        flags: { svg },
      } = country;
      return `<li>
                  <div class='country-title'>
                    <img src="${svg}" alt="${common}" class='country-flag' />
                    <p class='country-tag'>${official}</p>
                  </div>
                </li>`;
    })
    .join('');
  refs.countryListRef.innerHTML = markup;
  refs.countryInfoRef.innerHTML = '';
}

function renderCurrentCountry(countries) {
  const markup = countries
    .map(country => {
      const {
        name: { official, common },
        flags: { svg },
        capital,
        population,
        languages,
      } = country;
      return `<div class='country-title'>
                <img src="${svg}" alt="${common}" class='country-flag' />
                <h2 class='country-name'>${official}</h2>
              </div>
              <p><b>Capital:</b> ${capital}</p>
              <p><b>Population:</b> ${population}</p>
              <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>`;
    })
    .join('');
  refs.countryListRef.innerHTML = '';
  refs.countryInfoRef.innerHTML = markup;
}

function onFetchError() {
  clearData();
  Notify.failure('Oops, there is no country with that name');
}

function clearData() {
  refs.countryListRef.innerHTML = '';
  refs.countryInfoRef.innerHTML = '';
}
