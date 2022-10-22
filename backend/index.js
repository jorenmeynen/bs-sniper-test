import express, { urlencoded } from "express";
import cors from "cors";

import { getPlayerProfile, getAllScoresById, getScoresByIdAndPage, getScoresByIdAndSongCount } from "./getPlayerScores.js";
import { getCSVData } from "./getRelevantData.js";
import { input_id, input_id_again, input_buttons } from "./form_content.js";
import { searchPlayers } from "./searchPlayers.js";


const app = express();
const port = process.env.PORT || 5000;
app.use(urlencoded({ extended: false }));

app.use(cors());
// app.use(cors({ origin: "*" }));
// app.use(cors({
//   origins: [
//     "https://ss-details.herokuapp.com",
//     "http://localhost:4200",
//   ]
// }));

app.get("/favicon.ico", (req, res) => "your favicon");

app
  .route("/")
  .get((req, res) => res.send(input_id()))
  .post((req, res) => res.redirect(`/${req.body.ss_id}/form`));

app.route("/players").get((req, res) => {
  const search = req.query["search"];
  respondPlayerSearch(res, search);
});

app.route("/profile").get((req, res) => {
  const ss_id = req.query["ss_id"];
  respondProfileJSON(res, ss_id);
});

app.route("/scores/full").get((req, res) => {
  const ss_id = req.query["ss_id"];
  respondAllScoresJSON(res, ss_id);
});

app.route("/track/recent").get( async (req, res) => {
  makePlaylist(req, res, 'recent');
})
app.route("/track/top").get( async (req, res) => {
  makePlaylist(req, res, 'top');
})


async function makePlaylist(req, res, sort='recent') {
  const ss_id = req.query["ss_id"];
  const song_count = (req.query["song_count"] <= 100) ? req.query["song_count"] : 100;
  const page_number = req.query["page_number"];
  const last_request = req.query["last_request"];

  const now = new Date().getTime();
  const new_page = (now - last_request < 30 * 1000) ? +page_number + 1 : 1;

  const base_url = `${req.protocol}://${req.get("host")}${req.route.path}`;
  let syncUrl = `${base_url}`;
  syncUrl += `/?ss_id=${ss_id}`;
  syncUrl += `&song_count=${song_count}`;
  syncUrl += (page_number > 0) ? `&page_number=${new_page}` : "&page_number=1";
  syncUrl += `&last_request=${now}`;

  console.log(syncUrl);

  try {
    const res_player_data = await getPlayerProfile(ss_id);
    
    if (res_player_data.status !== 200) {
      console.log("error getting player:", res_player_data);
      res.json({
        "playlistTitle": "Error - Player not found",
        "customData": {
          "ReadOnly": true,
          "AllowDuplicates": "0",
          "syncURL": syncUrl
        },
      });
      res.end();
      return;
    };

    const player_name = res_player_data.data.name;
    console.log(`Getting ${ss_id}, most recent songs: ${song_count}`);

    const response_scores_data = await getScoresByIdAndSongCount(ss_id, song_count, new_page, sort);
    if (response_scores_data.status !== 200) {
      console.log("error getting scores:", res_player_data);
      res.json({
        "playlistTitle": "Error - No scores found",
        "customData": {
          "ReadOnly": true,
          "AllowDuplicates": "0",
          "syncURL": syncUrl
        },
      });
      res.end();
      return;
    };

    const playlist = buildPlaylist(syncUrl, response_scores_data.data);

    playlist.playlistTitle = `Track ${sort} ${player_name}${new_page > 1 ? `, page ${new_page}` : ""}`;
    playlist.playlistAuthor = "ss-details.heruokuapp.com";
    playlist.playlistDescription = `${ss_id} - ${player_name} - ${song_count} Most Recent Songs`;

    res.json(playlist);
  }
  catch (error) { handleError(error, res) }

  res.end();
}

function buildPlaylist(syncUrl, score_data) {
  const playlist = {
    "playlistTitle": "test1",
    "playlistAuthor": "test1",
    "playlistDescription": "test1",
    "customData": {
      "ReadOnly": true,
      "AllowDuplicates": "0",
      "syncURL": syncUrl,
    },
    "songs": []
  };

  for (let i = 0; i < score_data.playerScores.length; i++) {
    const playerScore = score_data.playerScores[i];
    const lb = playerScore.leaderboard;

    const songIndex = playlist.songs.findIndex(song => song.hash === lb.songHash);
    let [difficulty, gameMode] = lb.difficulty.difficultyRaw.split("_").filter(Boolean);
    gameMode = gameMode.replace("Solo", "");

    if (songIndex !== -1) {
      playlist.songs[songIndex].difficulties.push({
        characteristic: gameMode,
        name: difficulty,
      });
    } else {
      playlist.songs.push({
        "hash": lb.songHash,
        "songName": lb.songName,
        "difficulties": [{
          characteristic: gameMode,
          name: difficulty,
        }]
      });
    }
  }

  return playlist;
}



app.get("/scores", (req, res) => {
  const ss_id = req.query["ss_id"];
  const page = req.query["page_number"];
  respondScoresJSON(res, ss_id, page);
});

app.get("/playlist", (req, res) => {
  const ss_id = req.query["ss_id"];
  const name = req.query["name"];
  const songCount = req.query["songCount"];
  const playlistTitle = req.query["playlistTitle"];
  const playlistSongs = req.query["playlistSongs"];
  console.log(`${ss_id} ${name} - made playlist '${playlistTitle}' with ${songCount} songs: ${playlistSongs}`);
  res.send();
});

// --- < To be removed > ---
app.route("/:ss_id").get((req, res) => {
  const ss_id = req.params.ss_id;
  respondAllScoresJSON(res, ss_id);
});
app.route("/:ss_id/form").get((req, res) => {
  const ss_id = req.params.ss_id;
  getFormContent(res, ss_id);
});
app.route("/:ss_id/form/json").get((req, res) => {
  const ss_id = req.params.ss_id;
  respondAllScoresJSON(res, ss_id);
});
app.route("/:ss_id/form/csv").get((req, res) => {
  const ss_id = req.params.ss_id;
  downloadCSV(res, ss_id);
});
// --- </ To be removed > ---


app.listen(port, () => console.log(`Example app listening on port ${port}`));

async function respondProfileJSON(res, ss_id) {
  try {
    const res_player_data = await getPlayerProfile(ss_id);
    if (res_player_data.status !== 200) throw res_player_data;

    res.json(res_player_data.data);
  }
  catch (error) { handleError(error, res) }

  res.end();
}

async function respondPlayerSearch(res, ss_id) {
  try {
    const res_players = await searchPlayers(ss_id);
    if (res_players.status !== 200) throw res_players;

    res.json(res_players.data);
  }
  catch (error) { handleError(error, res) }

  res.end();
}

async function respondAllScoresJSON(res, ss_id) {
  try {
    const res_player_data = await getPlayerProfile(ss_id);
    if (res_player_data.status !== 200) throw res_player_data;

    const score_list = await getAllScoresById(ss_id, res_player_data.data);

    res.json(score_list);
  }
  catch (error) { handleError(error, res) }

  res.end();
}

async function respondScoresJSON(res, ss_id, page_number) {
  try {
    console.log(`Getting ${ss_id}, page number ${page_number}`);
    const response_scores_data = await getScoresByIdAndPage(ss_id, page_number);
    if (response_scores_data.status !== 200) throw response_scores_data;
    console.log(`Got ${ss_id}, ${response_scores_data.data.playerScores.length} plays`);

    res.json(response_scores_data.data);
  }
  catch (error) { handleError(error, res) }

  res.end();
}

async function downloadCSV(res, ss_id) {
  try {
    const res_player_data = await getPlayerProfile(ss_id);
    if (res_player_data.status !== 200) throw res_player_data;

    const score_list = await getAllScoresById(ss_id, res_player_data.data);
    const csv_content = getCSVData(score_list);
    const now = new Date().toISOString();
    const file_name = `ss-data-${res_player_data.data.name}-${now}.csv`;

    res.attachment(file_name).send(csv_content);
  }
  catch (error) { handleError(error, res) }

  res.end();
}

async function getFormContent(res, ss_id) {
  const response_player_data = await getPlayerProfile(ss_id);

  var content = "";
  if (response_player_data.status === 404) {
    content += `<h1>ID not found, try again.</h1>`;
    content += input_id_again(ss_id);
  } else {
    content += `<h1>${response_player_data.data.name}</h1>`;
    content += input_buttons(ss_id);
  }

  res.setHeader("Content-Type", "text/html");
  res.send(content);
}

function handleError(error, res) {
  if (error.status === 404) res.sendStatus(404);
  else if (error.status === 403) res.status(403).send(error.data);
  else if (error.status === 422) res.status(422).send(error.data);
  else if (error.status === 500) res.status(500).send(error.data);
  else {
    console.error(error);
    res.status(error.status).send(error.data);
  }
}