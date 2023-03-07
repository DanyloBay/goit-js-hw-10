const BASE_URL = 'https://restcountries.com/v3.1/name/';

async function fetchCountries(name) {
  try {
    const response = await fetch(
      `${BASE_URL}${name}?fields=name,capital,population,flags,languages`
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export { fetchCountries };
