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

/** Initializes page. */
function init() {
  loadSearchListPage();
}

/**
 * Loads the search results with names that match the searched text.
 */
function loadSearchListPage() {
  const schoolsDataList = JSON.parse(localStorage.getItem('schoolsDataList'));
  const resultsList = document.getElementById('results-list');

  schoolsDataList.forEach((school) => {
    const id = school.id;
    const name = school.name;
    const city = school.city;
    const state = school.state;

    // Create a link for the school that redirects to college info page.
    link = document.createElement('a');
    link.setAttribute('onclick', `loadSchool(${id})`);
    link.innerText = `${name} - ${city}, ${state}`;

    // Add each link to the HTML list as a link to the college page.
    listItem = document.createElement('li');
    listItem.appendChild(link);
    listItem.setAttribute('class', 'pointer');
    resultsList.appendChild(listItem);
  })
}

/**
 * Iterates over array of different schools data and saves the school that
 * matches the schoolId into local storage.
 * @param {number} schoolId
 */
function loadSchool(schoolId) {
  const schoolsFetchedDataList = JSON.parse(localStorage.getItem('schoolsFetchedDataList'));
  schoolsFetchedDataList.forEach((school) => {
    if (schoolId == school['id']) {
      localStorage.setItem('schoolId', schoolId);
      localStorage.setItem('currentSchool', JSON.stringify(school));
      location.href = `/college-info.html?id=${schoolId}`;
      
    }
  })
}

init();
