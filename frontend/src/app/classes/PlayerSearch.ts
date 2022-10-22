import { Player } from "./player";

export class PlayerSearch {
    metadata: {
        itemsPerPage: number;
        page: number;
        total: number;
    }
    players: Player[]
}