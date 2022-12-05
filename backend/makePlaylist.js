import { handleError } from "./errorHandler.js";
import { getPlayerProfile, getScoresByIdAndSongCount } from "./getPlayerScores.js";

export async function makePlaylist(req, res, sort = 'recent') {
    const ss_id = req.query["ss_id"];
    const song_count = (req.query["song_count"] <= 100) ? req.query["song_count"] : 100;
    const page_number = req.query["page_number"];
    const last_request = req.query["last_request"];

    const now = new Date().getTime();
    const new_page = (now - last_request < 30 * 1000) ? +page_number + 1 : 1;

    console.log("req:", req)
    console.log("req.url:", req.url)
    console.log("req.headers:", req.headers)
    console.log("req.headers.host:", req.headers.host)
    console.log("req.headers.x-forwarded-host:", req.headers["x-forwarded-host"])
    console.log("req.headers.referer:", req.headers.referer)

    // const base_url = `${req.protocol}://${req.get("host")}/api${req.route.path}`;

    const base_url = `${req.headers["x-forwarded-proto"]}://${req.headers["x-forwarded-host"]}${req.url}`;
    console.log("base_url:", base_url)
    let syncUrl = `${base_url}`;
    // syncUrl += `/?ss_id=${ss_id}`;
    // syncUrl += `&song_count=${song_count}`;
    // syncUrl += (page_number > 0) ? `&page_number=${new_page}` : "&page_number=1";
    // syncUrl += `&last_request=${now}`;

    console.log("syncUrl: ", syncUrl);

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
        playlist.playlistAuthor = "ss-sniper.heruokuapp.com";
        playlist.playlistDescription = `${ss_id} - ${player_name} - ${song_count} ${sort} Songs`;

        console.log(`Tracking playlist made or synced on ${ss_id} - ${player_name} - ${song_count} ${sort} Songs`);

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