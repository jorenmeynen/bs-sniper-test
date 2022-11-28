const BASE_URL = "https://scoresaber.com/api";
import axios from "axios";

export async function searchPlayers(search_term) {
  var response_player_data;
  await axios(`${BASE_URL}/players?search=${search_term}`)
    .then((response) => {
      response_player_data = response;
    })
    .catch((error) => {
      response_player_data = error.response;
    });
  return response_player_data;
}