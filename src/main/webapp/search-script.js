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

  // Check if no schools match that result.
  if (!schoolsDataList.length) {
    const listItem = document.createElement('li');
    listItem.innerText = 'No Schools Match Your Search';
    resultsList.appendChild(listItem);
  } else {
    schoolsDataList.forEach((school) => {
      const id = school.id;
      const name = school.name;
      const city = school.city;
      const state = school.state;

      // Create a link for the school that redirects to college info page.
      const link = document.createElement('a');
      link.addEventListener('click', () => loadSchool(id));
      link.innerText = `${name} - ${city}, ${state}`;

      // Add each link to the HTML list as a link to the college page.
      const listItem = document.createElement('li');
      listItem.appendChild(link);
      listItem.setAttribute('class', 'clickable');
      resultsList.appendChild(listItem);
    });
  }
}

/**
 * Iterates over array of different schools data and saves the school that
 * matches the schoolId into local storage.
 * @param {number} schoolId
 */
function loadSchool(schoolId) {
  const schoolIdToInfoDataDictionary =
      JSON.parse(localStorage.getItem('schoolIdToInfoDataDictionary'));
  const currentSchool = schoolIdToInfoDataDictionary[schoolId];

  localStorage.setItem('schoolId', schoolId);
  localStorage.setItem('currentSchool', JSON.stringify(currentSchool));
  location.href = `/college-info.html?id=${schoolId}`;
}

init();
