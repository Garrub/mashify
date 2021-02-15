const PITCH_DIST_THRESH = 0.1;
const TIMBRE_DIST_THRESH = 0.1;
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

const decorateBeats = (beats, segments, cb) => {
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
    while (((i === beats.length - 1) && (seg < segments.length)) || (beats[i + 1] && segments[seg].start <= beats[i + 1].start)) {
      data.pitches.push(segments[seg].pitches);
      data.timbre.push(segments[seg].timbre);
      data.maxLoudness.push(segments[seg].loudness_max);
      seg++;
    }
    beats[i].pitches = data.pitches.length > 0 ? arrayAvg(data.pitches) : null;
    beats[i].timbre = data.timbre.length > 0 ? arrayAvg(data.timbre) : null;
    beats[i].maxLoudness = data.maxLoudness.length > 0 ? data.maxLoudness.reduce((sum, curr) => sum + curr) / data.maxLoudness.length : null;

  };

  cb(null, beats);

};

const getMatchingBeats = (beats1, beats2) => {
  //I: two sets of beats with pitches and timbre data
  //O: list of pairs:
  //// 0: song1 beat data
  //// 1: song2 beat data
  //// 2: object with:
  ////// pitchDistance
  ////// timbreDistance
  //C: only add pair to list if pitchDistance is under PITCH_DIST_THRESH and timbreDistance is under TIMBRE_DIST_THRESH
  //E: if max loudness is below LOUDNESS_THRESH, ignore the pair
};

module.exports = decorateBeats;