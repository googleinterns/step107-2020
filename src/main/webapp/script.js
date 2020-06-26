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
 * Varaibles for API data
 * latest.admissions.act_scores.midpoint.cumulative
 * latest.admissions.admission_rate.overall
 * latest.admissions.sat_scores.average.overall
 * latest.completion.completion_rate_4yr_100nt
 * latest.cost.avg_net_price.other_academic_year
 * latest.cost.avg_net_price.overall
 * latest.cost.avg_net_price.private
 * latest.cost.avg_net_price.program_year
 * latest.cost.avg_net_price.public
 * latest.cost.tuition.in_state
 * latest.cost.tuition.out_of_state
 * latest.cost.tuition.program_year
 * latest.student.demographics.men
 * latest.student.demographics.race_ethnicity.aian
 * latest.student.demographics.race_ethnicity.asian
 * latest.student.demographics.race_ethnicity.black
 * latest.student.demographics.race_ethnicity.hispanic
 * latest.student.demographics.race_ethnicity.nhpi
 * latest.student.demographics.race_ethnicity.non_resident_alien
 * latest.student.demographics.race_ethnicity.two_or_more
 * latest.student.demographics.race_ethnicity.unknown
 * latest.student.demographics.race_ethnicity.white
 * latest.student.demographics.women
 * latest.student.size
 * school.city
 * school.minority_serving.historically_black
 * school.name
 * school.ownership
 * school.school_url
 * school.state
 */
function getSchoolInfo() {
  // Get school data from API.
  const link = 'https://api.data.gov/ed/collegescorecard/v1/schools.json?' +
      'api_key=C8Uyh2jQCmfjfKN3qwqwcJOi77c5k3V6zM7cRFgJ&school.name=Harvard' +
      '%20University&fields=id,school.city,school.name,school.state,school' +
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
      '.demographics.women,latest.completion.completion_rate_4yr_100nt'

  fetch(link)
  .then((response) => response.text())
  .then((data) => {
    const dataResults = JSON.parse(data).results[0];
    console.log(dataResults);
    schoolHeader = document.getElementById('school-name');
    schoolHeader.append(dataResults['school.name']);

    let ownership = '';
    if (dataResults['school.ownership'] == 1) {
      ownership = 'public';
    } else {
      ownership = 'private'
    }
    schoolDesc = document.getElementById('school-desc');
    schoolDesc.append(dataResults['school.name'] + 'is a ' + ownership + 
        ' University in ' + dataResults['school.city'] + ', ' + 
        dataResults['school.state']);

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    const raceHeader = 'latest.student.demographics.race_ethnicity.';
    function drawChart() {
      var data = google.visualization.arrayToDataTable([
        ['Race', 'Percentage'],
        ['White', dataResults[raceHeader + 'white'] * dataResults['latest.student.size']],
        ['Asian', dataResults[raceHeader + 'asian'] * dataResults['latest.student.size']],
        ['Black', dataResults[raceHeader + 'black'] * dataResults['latest.student.size']],
        ['Hispanic', dataResults[raceHeader + 'hispanic'] * dataResults['latest.student.size']],
        ['Indigenous Ameircan/Alaskan', dataResults[raceHeader + 'aian'] * dataResults['latest.student.size']],
        ['Two or More Races', dataResults[raceHeader + 'two_or_more'] * dataResults['latest.student.size']],
        ["Unreported", (dataResults[raceHeader + 'unknown'] + dataResults[raceHeader + 'non_resident_alien']) * dataResults['latest.student.size']],
      ]);

      var options = {
        title: 'Racial Demographic Breakdown',
        pieHole: 0.4,
        colors: ['#D4EBD0', '#A4C5C6', 'FFEB99', '856C8B'],
      };

      var chart = new google.visualization.PieChart
          (document.getElementById('race-piechart'));
      chart.draw(data, options);
    }
  });
}

