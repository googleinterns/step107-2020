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

function getSchoolInfo() {
  // Get school data from API.
  fetch('https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=C8Uyh2jQCmfjfKN3qwqwcJOi77c5k3V6zM7cRFgJ&school.name=Harvard%20University&fields=id,school.city,school.name,school.state,school.school_url,school.ownership,school.minority_serving.historically_black,latest.admissions.admission_rate.overall,latest.admissions.sat_scores.average.overall,latest.admissions.act_scores.midpoint.cumulative,latest.cost.tuition,latest.cost.avg_net_price,latest.student.size,latest.student.demographics.race_ethnicity.white,latest.student.demographics.race_ethnicity.black,latest.student.demographics.race_ethnicity.hispanic,latest.student.demographics.race_ethnicity.asian,latest.student.demographics.race_ethnicity.aian,latest.student.demographics.race_ethnicity.nhpi,latest.student.demographics.race_ethnicity.two_or_more,latest.student.demographics.race_ethnicity.non_resident_alien,latest.student.demographics.race_ethnicity.unknownhttps://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=C8Uyh2jQCmfjfKN3qwqwcJOi77c5k3V6zM7cRFgJ&school.name=Harvard%20University&fields=id,school.city,school.name,school.state,school.school_url,school.ownership,school.minority_serving.historically_black,latest.admissions.admission_rate.overall,latest.admissions.sat_scores.average.overall,latest.admissions.act_scores.midpoint.cumulative,latest.cost.tuition,latest.cost.avg_net_price,latest.student.size,latest.student.demographics.race_ethnicity.white,latest.student.demographics.race_ethnicity.black,latest.student.demographics.race_ethnicity.hispanic,latest.student.demographics.race_ethnicity.asian,latest.student.demographics.race_ethnicity.aian,latest.student.demographics.race_ethnicity.nhpi,latest.student.demographics.race_ethnicity.two_or_more,latest.student.demographics.race_ethnicity.non_resident_alien,latest.student.demographics.men,latest.student.demographics.women,latest.completion.completion_rate_4yr_100nt')
}