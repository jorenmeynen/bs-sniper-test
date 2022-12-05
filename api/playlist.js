export default async (req, res) => {
    if (req.method === "GET") {
        const ss_id = req.query["ss_id"];
        const name = req.query["name"];
        const songCount = req.query["songCount"];
        const playlistTitle = req.query["playlistTitle"];
        const playlistSongs = req.query["playlistSongs"];
        console.log(`${ss_id} ${name} - made playlist '${playlistTitle}' with ${songCount} songs: ${playlistSongs}`);
        res.send();
    }
}
