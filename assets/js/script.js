const searchFormEl = document.getElementById('search-form');
const cityInputEl = document.getElementById('city-input');
const forecastContainerEl = document.querySelector('#forecast-container');
const fiveDayForecastEl = document.querySelector('#five-day-forecast');
const apiKey="4b271f2c8693e98196bc7672be995d17";

const formSubmitHandler = function (event) {
  event.preventDefault();
  const city = cityInputEl.value.trim();
  if (city) {
    getCoordinates(city);
    forecastContainerEl.textContent = '';
    cityInputEl.value = '';
  } else {
    alert('Please enter the city to view the weather forecast');
  }
};
searchFormEl.addEventListener('submit',formSubmitHandler);

const getCoordinates = function (city) {
  const  geocodingApiUrl=`http://api.openweathermap.org/geo/1.0/direct?q=${city},US&limit=1&appid=${apiKey}`
   fetch (geocodingApiUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log("Data:", data);
            getForecast(data);
          });
        } else {
          alert(`Error: ${response.statusText}`);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });
    };

const getForecast = function (data) {
  const weatherApiUrl = `api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}`;
  fetch(weatherApiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayRepos(data, user);
        });
      } else {
        alert(`Error: ${response.statusText}`);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
};

/*const getFeaturedRepos = function (language) {
  // The `q` parameter is what language we want to query, the `+is:featured` flag adds a filter to return only featured repositories
  // The `sort` parameter will instruct GitHub to respond with all of the repositories in order by the number of issues needing help
  const apiUrl = `https://api.github.com/search/repositories?q=${language}+is:featured&sort=help-wanted-issues`;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data.items, language);
      });
    } else {
      alert(`Error:${response.statusText}`);
    }
  });
};

const displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = 'No repositories found.';
    // Without a `return` statement, the rest of this function will continue to run and perhaps throw an error if `repos` is empty
    return;
  }

  repoSearchTerm.textContent = searchTerm;

  for (let repoObj of repos) {
    // The result will be `<github-username>/<github-repository-name>`
    let repoName = `${repoObj.owner.login}/${repoObj.name}`;

    let repoEl = document.createElement('div');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';

    let titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    let statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (repoObj.open_issues_count > 0) {
      statusEl.innerHTML =
        `<i class='fas fa-times status-icon icon-danger'></i>${repoObj.open_issues_count} issue(s)`;
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);*/

