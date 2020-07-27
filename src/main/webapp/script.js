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
        
        const schoolsDataList = [];
        const schoolsFetchedDataById = {};

        schoolsFetchedDataList.forEach((school) => {
          const id = getIdFromApiData(school);
          const name = getBasicSchoolInfo(school, 'name');
          const city = getBasicSchoolInfo(school, 'city');
          const state = getBasicSchoolInfo(school, 'state');
          
          // Save school info that willl be displayed in search list.
          const schoolData = {
            id: id,
            name: name,
            city: city,
            state: state,
          };

          schoolsDataList.push(schoolData);

          //Save complete school data as object for O(1) retrieval.
          schoolsFetchedDataById[id] = school;
        });
        localStorage.setItem('schoolsDataList',
            JSON.stringify(schoolsDataList));
        localStorage.setItem('schoolsFetchedDataById',
            JSON.stringify(schoolsFetchedDataById));
        location.href = '/search-results.html';
      });
}

init();
