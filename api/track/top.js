import { makePlaylist } from "../../backend/makePlaylist.js";

export default async (req, res) => {
    if (req.method === "GET") {
        makePlaylist(req, res, 'top');
    }
}