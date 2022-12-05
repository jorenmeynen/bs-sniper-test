import { getPlayerProfile, getAllScoresById, getScoresByIdAndPage, getScoresByIdAndSongCount } from "../../backend/getPlayerScores.js";

export default async (req, res) => {
    if (req.method === "GET") {
        const ss_id = req.query["ss_id"];
        const page = req.query["page_number"];
        respondScoresJSON(res, ss_id, page);
    }
}

async function respondScoresJSON(res, ss_id = "76561198084876475", page_number = "1") {
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

