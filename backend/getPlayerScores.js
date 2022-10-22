const BASE_URL = "https://scoresaber.com/api/player";
import axios from "axios";

export async function getPlayerProfile(player_id) {
  var response_player_data;
  await axios(`${BASE_URL}/${player_id}/full`)
    .then((response) => {
      response_player_data = response;
    })
    .catch((error) => {
      response_player_data = error.response;
    });
  return response_player_data;
}

export async function getScoresByIdAndPage(player_id, page_number) {
  const items_per_page = 100;
  let response_scores_data = [];
  
  await axios(`${BASE_URL}/${player_id}/scores?sort=recent&page=${page_number}&limit=${items_per_page}`)
    .then((response) => response_scores_data = response)
    .catch((error) => response_scores_data = error.response);

  return response_scores_data;
}

export async function getScoresByIdAndSongCount(player_id, song_count, page_number = 1, sort = "recent") {
  const items_per_page = (song_count <= 100) ? song_count : 100;
  let response_scores_data = [];

  await axios(`${BASE_URL}/${player_id}/scores?sort=${sort}&page=${page_number}&limit=${items_per_page}`)
    .then((response) => response_scores_data = response)
    .catch((error) => response_scores_data = error.response);

  return response_scores_data;
}


export async function getAllScoresById(player_id, player_data) {
  const player_name = player_data.name;
  const total_songs_played = player_data.scoreStats.totalPlayCount;
  const items_per_page = 100;

  const total_pages = Math.ceil(total_songs_played / items_per_page);
  console.log(`Getting ${player_name}, ${total_songs_played} plays in ${total_pages} pages`);

  const score_list = [];
  let new_urls = [];
  for (let i = 1; i <= total_pages; i++) {
    new_urls.push(
      axios.get(`${BASE_URL}/${player_id}/scores?sort=recent&page=${i}&limit=${items_per_page}`)
    );
  }

  while (new_urls.length !== 0) {
    var failed_urls = [];
    await Promise.allSettled(new_urls).then((responses) => {
      for (const res of responses) {
        if (res.status === "fulfilled") {
          score_list.push(...res.value.data.playerScores);
          continue;
        }

        if (["ETIMEDOUT", "ECONNRESET"].includes(res.reason.code)) {
          failed_urls.push(res.reason.config.url);
          continue;
        }

        if (res.reason.response.status === 429) {
          failed_urls.push(res.reason.config.url);
          continue;
        }

        if (res.reason.response.status === 404)
          continue;

        console.log(`${res.reason.config.url} with status ${res.reason.response.status}`);
      }
    });
    new_urls = failed_urls.map((url) => axios.get(url));

    if (failed_urls.length !== 0)
      console.log(`retrying`, failed_urls);
  }

  console.log(`Got ${player_name}, ${score_list.length} plays`);

  return score_list;
}
