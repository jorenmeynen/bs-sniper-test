import { getPlayerProfile, getAllScoresById, getScoresByIdAndPage, getScoresByIdAndSongCount } from "../../backend/getPlayerScores.js";
import { handleError } from "../../backend/errorHandler.js";

export default async (req, res) => {
    if (req.method === "GET") {
        const ss_id = req.query["ss_id"];
        respondAllScoresJSON(res, ss_id);
    }
}



async function respondAllScoresJSON(res, ss_id = "76561198084876475") {
    try {
        const res_player_data = await getPlayerProfile(ss_id);
        if (res_player_data.status !== 200) throw res_player_data;

        const score_list = await getAllScoresById(ss_id, res_player_data.data);

        res.json(score_list);
    }
    catch (error) { handleError(error, res) }

    res.end();
}

// Router.route("/scores/full").get((req, res) => {
//     const ss_id = req.query["ss_id"];
//     respondAllScoresJSON(res, ss_id);
// });