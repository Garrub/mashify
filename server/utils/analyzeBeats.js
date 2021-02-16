const PITCH_DIST_THRESH = 20;
const TIMBRE_DIST_THRESH = 30;
const LOUDNESS_THRESH = -40;

const arrayAvg = (arr) => {
  var summed = arr.reduce((totals, subArr) => {
    subArr.forEach((x, i) => totals[i] += x);
    return totals;
  });
  var avg = [];
  summed.forEach(total => avg.push(total / arr.length));
  return avg;
};

const decorateBeats = (beats, segments) => {
  // beats shape
  //// start
  //// duration
  //// confidence

  // segment shape (partial)
  //// start
  //// duration
  //// confidence
  //// pitch
  //// timbre
  //// loudness
  var seg = 0;

  for (var i = 0; i < beats.length; i++) {
    var data = {
      pitches: [],
      timbre: [],
      maxLoudness: []
    };
    //when at the last beat, average all remaining segments
    //console.log(i, '/', beats.length - 1);
    while ((seg < segments.length) && ((i === beats.length - 1) || (beats[i + 1] && segments[seg].start <= beats[i + 1].start))) {
      data.pitches.push(segments[seg].pitches);
      data.timbre.push(segments[seg].timbre);
      data.maxLoudness.push(segments[seg].loudness_max);
      seg++;
    }
    beats[i].pitches = data.pitches.length > 0 ? arrayAvg(data.pitches) : null;
    beats[i].timbre = data.timbre.length > 0 ? arrayAvg(data.timbre) : null;
    beats[i].maxLoudness = data.maxLoudness.length > 0 ? data.maxLoudness.reduce((sum, curr) => sum + curr) / data.maxLoudness.length : null;

  };

};

const getEuclideanDistance = (v1, v2) => {
  if (v1.length !== v2.length) {
    return null;
  }
  if (v1.length === 0) {
    return 0;
  }
  return Math.sqrt(v1.map((val, i) => (val - v2[i]) ** 2).reduce((tot, cur) => tot + cur));
};

const getMatchingBeats = (beats1, beats2, same) => {
  //I: two sets of beats with pitches and timbre data
  //O: list of matches:
  //// 0: song1 beat data
  //// 1: song2 beat data
  //// 2: object with:
  ////// pitchDistance
  ////// timbreDistance
  //C: only add pair to list if pitchDistance is under PITCH_DIST_THRESH and timbreDistance is under TIMBRE_DIST_THRESH
  //E: if max loudness is below LOUDNESS_THRESH, ignore the pair
  var matches = [];
  for (var i = 0; i < beats1.length; i++) {
    if (beats1[i].pitches === null || beats1[i].maxLoudness < LOUDNESS_THRESH) {
      continue;
    }
    var minDist = {}
    for (var j = 0; j < beats2.length; j++) {
      if (same === 'same' && i === j) {
        continue;
      }
      if (beats2[j].pitches === null || beats2[j].maxLoudness < LOUDNESS_THRESH) {
        continue;
      }
      var pitchDist = getEuclideanDistance(beats1[i].pitches, beats2[j].pitches);
      if (pitchDist > PITCH_DIST_THRESH) {
        continue;
      }
      var timbreDist = getEuclideanDistance(beats1[i].timbre, beats2[j].timbre);
      if (timbreDist > TIMBRE_DIST_THRESH) {
        continue;
      }
      var overall = Math.sqrt(5 * timbreDist ** 2 + pitchDist ** 2);
      if (minDist.pitches === undefined) {
        minDist.pitches = pitchDist;
        minDist.timbre = timbreDist;
        minDist.overall = overall
        minDist.index = j;
      } else if (overall < minDist.overall) {
        minDist.pitches = pitchDist;
        minDist.timbre = timbreDist;
        minDist.overall = overall;
        minDist.index = j;
      }
    }
    if (minDist.index !== undefined) {
      matches.push([beats1[i], beats2[minDist.index], minDist]);
    }
  }
  var timeIndexedMatches = {};
  matches.forEach(match => {
    timeIndexedMatches[match[0].start] = match[1].start;
  });
  return timeIndexedMatches;

};

module.exports = {decorateBeats, getMatchingBeats};