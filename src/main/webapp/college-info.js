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
 * Loads page info.
 */
function init() {
  loadSchoolInfo();
  loadComments();
}

/**
 * Loads the college data from an object passed in local storage.
 */
function loadSchoolInfo() {
  const infoDivId = 'info';
  const reviewsDivId = 'reviews';

  const infoNavButton = document.getElementById(`${infoDivId}-nav`);
  const reviewsNavButton = document.getElementById(`${reviewsDivId}-nav`);

  infoNavButton.classList.add('active');
  infoNavButton.addEventListener('click',
      () => toggleElementsDisplay(infoDivId, reviewsDivId));
  reviewsNavButton.addEventListener('click',
      () => toggleElementsDisplay(reviewsDivId, infoDivId));

  const dataResults = JSON.parse(localStorage.getItem('currentSchool'));

  // Load the Visualization API and the corechart package.
  chartsPromise = google.charts.load('current', {packages: ['corechart']});

  // Basic School Information Variables.
  const ownership = getOwnership(dataResults);
  const name = getBasicSchoolInfo(dataResults, 'name');
  const city = getBasicSchoolInfo(dataResults, 'city');
  const state = getBasicSchoolInfo(dataResults, 'state');

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
  chartsPromise.then(() => {
    drawRaceChart(numWhiteStudents, numAsianStudents, numBlackStudents,
        numHispanicStudents, numIndigenousStudents, numMultiracialStudents,
        numUnreportedRaceStudents);
    drawGenderChart(numMen, numWomen);
  });
}

/**
 * Creates Donut Pie Chart displaying racial breakdown.
 * @param {number} numWhiteStudents
 * @param {number} numAsianStudents
 * @param {number} numBlackStudents
 * @param {number} numHispanicStudents
 * @param {number} numIndigenousStudents
 * @param {number} numMultiracialStudents
 * @param {number} numUnreportedRaceStudents
 */
function drawRaceChart(numWhiteStudents, numAsianStudents, numBlackStudents,
    numHispanicStudents, numIndigenousStudents, numMultiracialStudents,
    numUnreportedRaceStudents) {
  const data = google.visualization.arrayToDataTable([
    ['Race', 'Percentage'],
    ['White', numWhiteStudents],
    ['Asian', numAsianStudents],
    ['Black', numBlackStudents],
    ['Hispanic', numHispanicStudents],
    ['Indigenous Ameircan/Alaskan', numIndigenousStudents],
    ['Two or More Races', numMultiracialStudents],
    ['Unreported', numUnreportedRaceStudents],
  ]);

  const options = {
    title: 'Breakdown by Race',
    pieHole: 0.4,
    colors: ['#C6ACA4', '#A4C5C6', '#FFEB99',
      '#856C8B', '#C6BDA4', '#D4EBD0', '#C68B77'],
  };

  const chart = new google.visualization.PieChart(document
      .getElementById('race-piechart'));
  chart.draw(data, options);
}

/**
 * Creates Donut Pie Chart displaying gender breakdown.
 * @param {number} numMen
 * @param {number} numWomen
 */
function drawGenderChart(numMen, numWomen) {
  const data = google.visualization.arrayToDataTable([
    ['Gender', 'Percentage'],
    ['Men', numMen],
    ['Women', numWomen],
  ]);

  const options = {
    title: 'Breakdown by Gender',
    pieHole: 0.4,
    colors: ['#D4EBD0', '#A4C5C6'],
  };

  const chart = new google.visualization.PieChart(document
      .getElementById('gender-piechart'));
  chart.draw(data, options);
}

/**
 * Returns whether the school is public or private.
 * @param {!Object} data
 * @return {string}
 */
function getOwnership(data) {
  if (data['school.ownership']) {
    return 'public';
  } else {
    return 'private';
  }
}

/**
 * Returns basic school info.
 * @param {!Object} data
 * @param {string} infoName Specific info to be extracted. Name defined by
 * College Scorecard API.
 * @return {string} School name, city, or state.
 */
function getBasicSchoolInfo(data, infoName) {
  return data[`school.${infoName}`];
}

/**
 * @param {!Object} data
 * @param {string} infoName Specific info to be extracted. Name defined by
 *     College Scorecard API.
 * @return {number} Cost.
 */
function getCostInfo(data, infoName) {
  return data[`latest.cost.tuition.${infoName}`];
}

/**
 * @param {!Object} data
 * @return {number} Acceptance rate as a percentage out of 100.
 */
function getAcceptanceRate(data) {
  return data['latest.admissions.admission_rate.overall'] * 100;
}

/**
 * @param {!Object} data
 * @param {string} infoName Specific SAT info to be extracted. Name defined by
 *     College Scorecard API.
 * @return {number} SAT Section Score.
 */
function getSatInfo(data, infoName) {
  return data[`latest.admissions.sat_scores.${infoName}`];
}

/**
 * @param {!Object} data
 * @param {string} infoName Specific ACT info to be extracted. Name defined by
 *     College Scorecard API.
 * @return {number} ACT Section Score
 */
function getActInfo(data, infoName) {
  return data[`latest.admissions.act_scores.${infoName}`];
}

/**
 * @param {!Object} data
 * @return {number} Total enrolled students.
 */
function getNumStudents(data) {
  return data['latest.student.size'];
}

/**
 * @param {!Object} data
 * @param {string} race Name defined by College Scorecard API.
 * @return {number} Race proportion of students as a decimal out of 1.
 */
function getRace(data, race) {
  return data[`latest.student.demographics.race_ethnicity.${race}`];
}

/**
 * @param {!Object} data
 * @param {string} gender Name defined by College Scorecard API.
 * @return {number} Gender proportion of students as a decimal out of 1.
 */
function getGender(data, gender) {
  return data[`latest.student.demographics.${gender}`];
}

/**
 * @param {!Object} data
 * @return {number} 4 year graduation rate as a percentage out of 100.
 */
function getGraduationRate(data) {
  return (data['latest.completion.completion_rate_4yr_100nt'] * 100)
      .toFixed(1);
}

/** Adds comments to page. */
function loadComments() {
  const reviewsDiv = document.getElementById('reviews');
  reviewsDiv.style.display = 'none';
  const id = localStorage.getItem('schoolId');
  prepReviewForm(id);
  fetch(`/data?id=${id}`)
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
  submitReviewForm.setAttribute('action', `/data?id=${id}`);
  const idInputElement = document.getElementById('school-id');
  idInputElement.setAttribute('value', id);
}

/**
 * Sets the hidden elements to be shown and the shown elements hidden.
 * ID for buttons that will be used to show an element must be the same as the
 * name of that element ID with "-nav" at the end.
 * @param {string} showId HTML ID of element that is hidden and will be shown.
 * @param {string} hideId HTML ID of element that is shown and will be hidden.
 */
function toggleElementsDisplay(showId, hideId) {
  const elemnetToHide = document.getElementById(hideId);
  const elementToShow = document.getElementById(showId);

  elemnetToHide.style.display = 'none';
  elementToShow.style.display = 'block';

  const navButtonToHide = document.getElementById(`${hideId}-nav`);
  const navButtonToShow = document.getElementById(`${showId}-nav`);
  
  navButtonToHide.classList.remove('active');
  navButtonToShow.classList.add('active');
}

init();
