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
 * Adds load school info page function to search button.
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


/** Adds comments to page. */
function loadComments() {
  const id = getSchoolIdFromUrl();
  prepReviewForm(id);
  fetch(`/data?school-id=${id}`)
      .then((response) => response.json()).then((comments) => {
        const commentListItem = document.getElementById('comments-container');
        comments.forEach((comment) => {
          commentListItem.appendChild(createCommentElement(comment.name,
              comment.message, comment.time));
        });
      });
}

/**
 * @param {string} name The name of the user who commented.
 * @param {string} message The message body of a comment post.
 * @param {string} time The time of a comment post.
 * @return {!HTMLParagraphElement}} A comment paragraph item.
 */
function createCommentElement(name, message, time) {
  const commentElement = document.createElement('p');
  commentElement.innerText = `${name} posted ${message} on ${time}`;
  return commentElement;
}

/**
 * Adds ID to form submission.
 * @param {number} id
 */
function prepReviewForm(id) {
  const submitReviewForm = document.getElementById('submit-review');
  submitReviewForm.setAttribute('action', `/data?school-id=${id}`);
  const idInputElement = document.getElementById('school-id');
  idInputElement.setAttribute('value', id);
}

/**
 * @return {number} ID from page URL.
 */
function getSchoolIdFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('school-id');
  return id;
}

/**
 * Sets the event listener to search school.
 */
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
        localStorage.setItem('schoolsFetchedDataList', 
            JSON.stringify(schoolsFetchedDataList));
        let schoolsDataList = [];

        schoolsFetchedDataList.forEach((school) => {
          const id = getIdFromApiData(school);
          const name = getBasicSchoolInfo(school,'name');
          const city = getBasicSchoolInfo(school, 'city');
          const state = getBasicSchoolInfo(school, 'state');

          const schoolData = {
              id: id,
              name: name,
              city: city,
              state: state,
          };

          schoolsDataList.push(schoolData);
        });
        console.log(JSON.stringify(schoolsDataList));
        localStorage.setItem('schoolsDataList', 
            JSON.stringify(schoolsDataList));
        location.href = '/search-results.html';
      });
}

init();
