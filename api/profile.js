import { handleError } from "../backend/errorHandler.js";
import { getPlayerProfile } from "../backend/getPlayerScores.js";


export default async (req, res) => {
    if (req.method === "GET") {
        const ss_id = req.query["ss_id"];
        respondProfileJSON(res, ss_id);
    }
}



async function respondProfileJSON(res, ss_id = "76561198084876475") {
    try {
        const res_player_data = await getPlayerProfile(ss_id);
        if (res_player_data.status !== 200) throw res_player_data;

        res.json(res_player_data.data);
    }
    catch (error) { handleError(error, res) }

    res.end();
}
