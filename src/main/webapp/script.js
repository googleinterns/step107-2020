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
 * Fethces the data from the College ScoreCard API and populates the college
 * info html page with the appropriate information.
 */
function loadSchoolInfo() {
  const schoolSearch = document.getElementById('school-search').value;

  // Get School Data from API.
  fetch(getLink(schoolSearch))
      .then((response) => response.text())
      .then((data) => {
        const parsedData = JSON.parse(data);
        let schools = parsedData['results'];
        
        // Get main campus
        let dataResults = getMainCampus(schools);

        // Basic School Information Variables.
        const ownership = getOwnership(dataResults)
        const id = getID(dataResults);
        const name = getSchoolInfo(dataResults, 'name');
        const city = getSchoolInfo(dataResults, 'city');
        const state = getSchoolInfo(dataResults, 'state');

        // Cost Statistics Variables.
        const inStateTuition = getCostInfo(dataResults, 'in_state');
        const outOfStateTuition = getCostInfo(dataResults, 'out_of_state');
        
        // Admissions Statistics Variables.
        const acceptanceRate = getAcceptanceRate(dataResults);
        const avgSAT = getSATInfo(dataResults, 'average.overall');
        const avgACT = getACTInfo(dataResults, 'midpoint.cumulative');

        // Student Statistic Variables.
        const numStudents = getNumStudents(dataResults);
        const numMen = getGender(dataResults, 'men') * numStudents;
        const numWomen = getGender(dataResults, 'women') * numStudents;
        const graduationRate4yr = getGraduationRate(data);
        const numWhiteStudents = getRace(dataResults, 'white') * numStudents;
        const numAsianStudents = getRace(dataResults, 'asian') * numStudents;
        const numBlackStudents = getRace(dataResults, 'black') * numStudents;
        const numHispanicStudents =
            getRace(dataResults, 'hispanic') * numStudents;
        const numIndigenousStudents =
            getRace(dataResults, 'aian') * numStudents;
        const numMultiracialStudents =
            getRace(dataResults, 'two_or_more') * numStudents;
        const numUnreportedRaceStudnets = (getRace(dataResults, 'unknown') +
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
        admissionsDiv.append(`Average SAT Score: ${avgSAT}`);
        admissionsDiv.append(`Average ACT Score: ${avgACT}`);

        // Students Section.
        const studentsDiv = document.getElementById("students");
        studentsDiv.innerHTML = '';
        studentsDiv.append(`Population: ${numStudents} Students`);
        studentsDiv.append(`4 Year Graduation Rate: ${graduationRate4yr}%`);



        // Draw charts.
        drawRaceChart(numWhiteStudents, numAsianStudents, numBlackStudents, 
            numHispanicStudents, numIndigenousStudents, numMultiracialStudents, 
            numUnreportedRaceStudnets);
        drawGenderChart(numMen, numWomen);
    
  });
}

/**
 * Inserts the school name into the API link to the college scoreboard and 
 * returns the link.
 * @param {string} schoolName
 */
function getLink(schoolName) {
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

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawRaceChart);
google.charts.setOnLoadCallback(drawGenderChart);

/**
 * Creates Donut Pie Chart displaying racial breakdown.
 */
function drawRaceChart(numWhiteStudents, numAsianStudents, numBlackStudents, 
    numHispanicStudents, numIndigenousStudents, numMultiracialStudents, 
    numUnreportedRaceStudnets) {
      let data = google.visualization.arrayToDataTable([
        ['Race', 'Percentage'],
        ['White', numWhiteStudents],
        ['Asian', numAsianStudents],
        ['Black', numBlackStudents],
        ['Hispanic', numHispanicStudents],
        ['Indigenous Ameircan/Alaskan', numIndigenousStudents],
        ['Two or More Races', numMultiracialStudents],
        ["Unreported", numUnreportedRaceStudnets],
      ]);

      let options = {
        title: 'Breakdown by Race',
        pieHole: 0.4,
        colors: ['#C6ACA4', '#A4C5C6', '#FFEB99', 
            '#856C8B', '#C6BDA4', '#D4EBD0', '#C68B77'],
      };

      let chart = new google.visualization.PieChart
          (document.getElementById('race-piechart'));
      chart.draw(data, options);
}

/**
 * Creates Donut Pie Chart displaying gender breakdown.
 */
function drawGenderChart(numMen, numWomen) {
  let data = google.visualization.arrayToDataTable([
      ['Gender', 'Percentage'],
      ['Men', numMen],
      ['Women', numWomen],
  ]);

  let options = {
      title: 'Breakdown by Gender',
      pieHole: 0.4,
      colors: ['#D4EBD0', '#A4C5C6'],
  };

  let chart = new google.visualization.PieChart
      (document.getElementById('gender-piechart'));
  chart.draw(data, options);
}

 /**
 * Finds and returns the main campus from a list of main and satellite campuses
 * of the same name.
 * @param {!Array<object>} schools This is the array of school objects returned
 * from a fetch query.
 */
function getMainCampus(schools) {
  if (schools.length == 1) {
    return schools[0];
  } else {
    main = {}
    schools.forEach((campus) => {
        if (campus['school.main_campus'] == 1) {
          main = campus;
        }
    });
    return main;
    }
}

 /**
 * Returns whether the school is public or private.
 * @param {object} data
 */
function getOwnership(data) {
  if (data['school.ownership'] == 1) {
    return 'public';
  } else {
    return 'private';
  }
}

 /**
 * Returns school ID.
 * @param {object} data
 */
function getID(data) {
  return data['root.id'];
}

/**
 * Returns basic school info.
 * @param {object} data
 * @param {string} infoName Specific info to be extracted. Name defined by
 * College Scorecard API
 */
function getSchoolInfo(data, infoName) {
  return data[`school.${infoName}`];
}

/**
 * Returns cost info.
 * @param {object} data
 * @param {string} infoName Specific info to be extracted. Name defined by
 * College Scorecard API
 */
function getCostInfo(data, infoName) {
  return data[`latest.cost.tuition.${infoName}`];
}

/**
 * Returns acceptance rate as a percentage out of 100.
 * @param {object} data
 */
function getAcceptanceRate(data) {
  return data['latest.admissions.admission_rate.overall'] * 100;
}

/**
 * Returns SAT info.
 * @param {object} data
 * @param {string} infoName Specific SAT info to be extracted. Name defined by
 * College Scorecard API
 */
function getSATInfo(data, infoName) {
  return data[`latest.admissions.sat_scores.${infoName}`];
}

/**
 * Returns ACT info.
 * @param {object} data
 * @param {string} infoName Specific ACT info to be extracted. Name defined by
 * College Scorecard API
 */
function getACTInfo(data, infoName) {
  return data[`latest.admissions.act_scores.${infoName}`];
}

/**
 * Returns number of students.
 * @param {object} data
 */
function getNumStudents(data) {
  return data['latest.student.size'];
}

/**
 * Returns the race count of students as decimal out of 1.
 * @param {object} data
 * @param {string} race Name defined by College Scorecard API
 */
function getRace(data, race) {
  return data[`latest.student.demographics.race_ethnicity.${race}`];
}

/**
 * Returns the race count of students as decimal out of 1.
 * @param {object} data
 * @param {string} gender Name defined by College Scorecard API
 */
function getGender(data, gender) {
  return data[`latest.student.demographics.${gender}`];
}

/**
 * Returns 4 year graduation rate as a percentage out of 100.
 * @param {object} data
 */
function getGraduationRate(data) {
  return (data['latest.completion.completion_rate_4yr_100nt'] * 100);
}