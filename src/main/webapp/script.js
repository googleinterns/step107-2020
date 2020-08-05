// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Initializes page.
 */
function init() {
  prepSearchButton();
  setSchoolNames();
  autocomplete(document.getElementById('school-search'), localStorage.getItem('schoolNames'));
}

/**
 * Inserts the school name into the college scoreboard API link and
 *     returns the complete link.
 * @param {string} schoolName
 * @return {string}
 */
function getLinkBySchoolName(schoolName) {
  return ('https://api.data.gov/ed/collegescorecard/v1/schools.json?' +
      'api_key=C8Uyh2jQCmfjfKN3qwqwcJOi77c5k3V6zM7cRFgJ&school.name=' +
      `${schoolName}&fields=id,school.city,school.name,school.state,school` +
      '.school_url,school.ownership,school.minority_serving.' +
      'historically_black,latest.admissions.admission_rate.overall,' +
      'latest.admissions.sat_scores.average.overall,latest.admissions' +
      '.act_scores.midpoint.cumulative,latest.cost.tuition,latest.cost' +
      '.avg_net_price,latest.student.size,latest.student.demographics' +
      '.race_ethnicity.white,latest.student.demographics.race_ethnicity' +
      '.black,latest.student.demographics.race_ethnicity.hispanic,' +
      'latest.student.demographics.race_ethnicity.asian,latest' +
      '.student.demographics.race_ethnicity.aian,latest.student.demographics' +
      '.race_ethnicity.nhpi,latest.student.demographics.race_ethnicity' +
      '.two_or_more,latest.student.demographics.race_ethnicity' +
      '.non_resident_alien,latest.student.demographics.race_ethnicity' +
      '.unknown,latest.student.demographics.men,latest.student' +
      '.demographics.women,latest.completion.completion_rate_4yr_100nt,' +
      'school.main_campus,school.institutional_characteristics.level');
}

/**
 * Inserts the school name into the college scoreboard API link and
 *     returns the list of school names in the API.
 * @param {string} schoolName
 * @return {string}
 */
function setSchoolNames(){
  searchValue = document.getElementById('school-search')
  fetch(getLinkBySchoolName(searchValue))
      .then((response) => response.text())
      .then((data) => {
        const parsedData = JSON.parse(data);
        schoolsFetchedDataList = parsedData['results'];
        const schoolNames = [];

        schoolsFetchedDataList.forEach((school) => {
          const id = getIdFromApiData(school);
          const name = getBasicSchoolInfo(school, 'name');

          // Saves school info that willl be displayed in search list.
          const schoolData = name;
    

          schoolNames.push(schoolData);
      });
    localStorage.setItem('schoolNames', schoolNames);
    });
}

/**
 * @param {!Object} data
 * @return {number} School ID.
 */
function getIdFromApiData(data) {
  return data['id'];
}

/**
 * Returns basic school info.
 * @param {!Object} data
 * @param {string} infoName Specific info to be extracted. Name defined by
 *     College Scorecard API.
 * @return {string} School name, city, or state.
 */
function getBasicSchoolInfo(data, infoName) {
  return data[`school.${infoName}`];
}

/** Sets the event listener to search school. */
function prepSearchButton() {
  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', () => loadSearchResults());
}

/** Fetches search results from API and saves in local storage. */
function loadSearchResults() {
  const searchValue = document.getElementById('school-search').value;

  fetch(getLinkBySchoolName(searchValue))
      .then((response) => response.text())
      .then((data) => {
        const parsedData = JSON.parse(data);
        schoolsFetchedDataList = parsedData['results'];

        // Holds basic school data to be displayed on search results page.
        const schoolsDataList = [];

        // Holds schoolId => schoolInfo in data dictionary for O(1) retrieval.
        const schoolIdToInfoDataDictionary = {};

        schoolsFetchedDataList.forEach((school) => {
          const id = getIdFromApiData(school);
          const name = getBasicSchoolInfo(school, 'name');
          const city = getBasicSchoolInfo(school, 'city');
          const state = getBasicSchoolInfo(school, 'state');

          // Saves school info that willl be displayed in search list.
          const schoolData = {
            id: id,
            name: name,
            city: city,
            state: state,
          };

          schoolsDataList.push(schoolData);

          // Saves complete school data as object for O(1) retrieval.
          schoolIdToInfoDataDictionary[id] = school;
        });

        localStorage.setItem('schoolsDataList',
            JSON.stringify(schoolsDataList));
        localStorage.setItem('schoolIdToInfoDataDictionary',
            JSON.stringify(schoolIdToInfoDataDictionary));
        location.href = '/search-results.html';
      });
}

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) { return false;}
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click", function(e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) { //up
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  });

function addActive(x) {
  /*a function to classify an item as "active":*/
  if (!x) return false;
  removeActive(x);
  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = (x.length - 1);
  x[currentFocus].classList.add("autocomplete-active");
}

function removeActive(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("autocomplete-active");
  }
}

function closeAllLists(elmnt) {
  var x = document.getElementsByClassName("autocomplete-items");
  for (var i = 0; i < x.length; i++) {
    if (elmnt != x[i] && elmnt != inp) {
    x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

init();
