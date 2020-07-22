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
 * Hides reviews when client wantes to see college-info.
 */
function hideReviews() {
  document.getElementById('comment-body').style.visibility = 'hidden';
  document.getElementsById('main-info').style.display = 'initial';
}

/**
 * Hides college info when client requests to see reviews
 */
function hideSchoolInfo() {
  document.getElementById('comment-body').style.display = 'initial';
  document.getElementsById('main-info').style.visibility = 'hidden';
}
/**
 * Adds load school info page function to search button.
 */
function init() {
  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', () => loadSchoolInfo());
}

/**
 * Fetches the data from the College ScoreCard API and populates the college
 *     info html page with the appropriate information.
 */
function loadSchoolInfo() {
  const schoolSearch = sessionStorage.getItem('schoolList');

  // Get School Data from API.
  fetch(getLinkBySchoolName(schoolSearch))
      .then((response) => response.text())
      .then((data) => {
        const parsedData = JSON.parse(data);
        const schools = parsedData['results'];

        // Get main campus
        const dataResults = getMainCampus(schools);

        // Basic School Information Variables.
        const id = getIdFromApiData(dataResults);
        const ownership = getOwnership(dataResults);
        const name = getSchoolInfo(dataResults, 'name');
        const city = getSchoolInfo(dataResults, 'city');
        const state = getSchoolInfo(dataResults, 'state');

        // Cost Statistics Variables.
        const inStateTuition = getCostInfo(dataResults, 'in_state');
        const outOfStateTuition = getCostInfo(dataResults, 'out_of_state');

        // Admissions Statistics Variables.
        const acceptanceRate = getAcceptanceRate(dataResults);
        const avgSat = getSatInfo(dataResults, 'average.overall');
        const avgAct = getActInfo(dataResults, 'midpoint.cumulative');

        // Student Statistic Variables.
        const numStudents = getNumStudents(dataResults);
        const numMen = getGender(dataResults, 'men') * numStudents;
        const numWomen = getGender(dataResults, 'women') * numStudents;
        const graduationRate4yr = getGraduationRate(dataResults);
        const numWhiteStudents = getRace(dataResults, 'white') * numStudents;
        const numAsianStudents = getRace(dataResults, 'asian') * numStudents;
        const numBlackStudents = getRace(dataResults, 'black') * numStudents;
        const numHispanicStudents =
            getRace(dataResults, 'hispanic') * numStudents;
        const numIndigenousStudents =
            getRace(dataResults, 'aian') * numStudents;
        const numMultiracialStudents =
            getRace(dataResults, 'two_or_more') * numStudents;
        const numUnreportedRaceStudents = (getRace(dataResults, 'unknown') +
            getRace(dataResults, 'non_resident_alien')) * numStudents;

        // Set School ID to link to reviews page.
        const reviewsPageLink = document.getElementById('reviews-button');
        reviewsPageLink.setAttribute('href', `/comments.html?school-id=${id}`);

        // Name Section.
        schoolHeader = document.getElementById('school-name');
        schoolHeader.innerHTML = '';
        schoolHeader.append(dataResults['school.name']);

        // Description Section.
        const schoolDesc = document.getElementById('school-desc');
        schoolDesc.innerHTML = '';
        schoolDesc.append(`${name} is a ${ownership} University 
            in ${city}, ${state}`);
        // Cost Section.
        const costDiv = document.getElementById('cost');
        costDiv.innerHTML = '';
        costDiv.append(`In-State Tuition: $${inStateTuition}`);
        costDiv.append(`Out-of-State Tuition: $${outOfStateTuition}`);

        // Admissions Section.
        const admissionsDiv = document.getElementById('admissions');
        admissionsDiv.innerHTML = '';
        admissionsDiv.append(`Acceptance Rate: ${acceptanceRate}%`);
        admissionsDiv.append(`Average SAT Score: ${avgSat}`);
        admissionsDiv.append(`Average ACT Score: ${avgAct}`);

        // Students Section.
        const studentsDiv = document.getElementById('students');
        studentsDiv.innerHTML = '';
        studentsDiv.append(`Population: ${numStudents} Students`);
        studentsDiv.append(`4 Year Graduation Rate: ${graduationRate4yr}%`);

        // Draw charts.
        drawRaceChart(numWhiteStudents, numAsianStudents, numBlackStudents,
            numHispanicStudents, numIndigenousStudents, numMultiracialStudents,
            numUnreportedRaceStudents);
        drawGenderChart(numMen, numWomen);
      });
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
        localStorage.setItem('schoolsFetchedDataList',
            JSON.stringify(schoolsFetchedDataList));
        const schoolsDataList = [];

        schoolsFetchedDataList.forEach((school) => {
          const id = getIdFromApiData(school);
          const name = getBasicSchoolInfo(school, 'name');
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
        localStorage.setItem('schoolsDataList',
            JSON.stringify(schoolsDataList));
        location.href = '/search-results.html';
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
  commentElement.innerText = name + ' posted ' + message + ' on ' + time;
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
 * Redirects home search to college info page after storing user input.
 */
function storeAndRedirect() {
  sessionStorage.clear();
  const schoolList = document.getElementById('school-search').value;
  sessionStorage.setItem('schoolList', schoolList);
  window.location.href = 'college-info.html';
}
init();
