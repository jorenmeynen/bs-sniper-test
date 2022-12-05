import { makePlaylist } from "../../backend/makePlaylist";

export default async (req, res) => {
    if (req.method === "GET") {
        makePlaylist(req, res, 'top');
    }
}