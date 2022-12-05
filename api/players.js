import { handleError } from "../backend/errorHandler.js";
import { searchPlayers } from "../backend/searchPlayers.js";

export default async (req, res) => {
    if (req.method === "GET") {
        const search = req.query["search"];
        respondPlayerSearch(res, search);
    }
}

async function respondPlayerSearch(res, ss_id = "joren") {
    try {
        const res_players = await searchPlayers(ss_id);
        if (res_players.status !== 200) throw res_players;

        res.json(res_players.data);
    }
    catch (error) { handleError(error, res) }

    res.end();
}
