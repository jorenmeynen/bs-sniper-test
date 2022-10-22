export function getCSVData(score_list) {
  const song_data_list = [];

  for (const song of score_list) {
    const song_data = getRelevantData(song);
    song_data_list.push(song_data);
  }

  const csv_data = convertToCSV(song_data_list);
  return csv_data;
}

// const fs = require("fs");
// let db_file = "db.txt";
// let main_file_name = "Tseska-2022-02-18";
// let playerScores = [];

// try {
//   const data = fs.readFileSync(db_file, "utf8");
//   playerScores = data
//     .split("\n")
//     .filter(Boolean)
//     .map((e) => JSON.parse(e));
// } catch (err) {
//   console.error(err);
// }

// const song_ids = [];
// let song_multi = false;
// playerScores.forEach(e => {
//     const current_id = e.leaderboard.difficulty.leaderboardId;
//     if (song_ids.includes(current_id)) {
//         song_multi = true;
//     }
//     song_ids.push(current_id)
// })

// function writeFile(content) {
//   fs.writeFile(`${main_file_name}.tsv`, content, function (err) {
//     if (err) throw err;
//     console.log("Saved!");
//   });
// }

// https://stackoverflow.com/questions/11257062/converting-json-object-to-csv-format-in-javascript
function convertToCSV(arr, separator="\t") {
  const array = [Object.keys(arr[0])].concat(arr);
  return array.map((it) => Object.values(it).join(separator)).join("\n");
}

function getRelevantData(song) {
  const song_data = {
    "lb_acc": song.score.baseScore / song.leaderboard.maxScore,
    lb_difficulty: song.leaderboard.difficulty.difficulty,
    lb_id: song.leaderboard.id,
    lb_ranked: song.leaderboard.ranked,
    lb_stars: song.leaderboard.stars,
    lb_songName: song.leaderboard.songName,

    score_badCuts: song.score.badCuts,
    score_baseScore: song.score.baseScore,
    score_fullCombo: song.score.fullCombo,
    score_hasReplay: song.score.hasReplay,
    score_hmd: song.score.hmd,
    score_id: song.score.id,
    score_maxCombo: song.score.maxCombo,
    score_missedNotes: song.score.missedNotes,
    score_modifiedScore: song.score.modifiedScore,
    score_modifiers: song.score.modifiers,
    score_multiplier: song.score.multiplier,
    score_pp: song.score.pp,
    score_rank: song.score.rank,
    score_timeSet: song.score.timeSet,
    score_weight: song.score.weight,
  };
  return song_data;
}
