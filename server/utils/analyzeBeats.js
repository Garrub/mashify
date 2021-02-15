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
      timbres: []
    };
    while (segments[seg].start <= beats[i + 1].start) {
      data.pitches.push(segments[seg].pitch);
      data.timbres.push(segments[seg].timbre);
      seg++;
    }

  };


};