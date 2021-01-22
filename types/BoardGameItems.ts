export interface BoardGameItem {
    attributes: {
        subtype: string;
        objectType: string;
    };
    collectionId: string;
    objectId: string;
    name: string;
    yearPublished: number;
    image: string;
    thumbnail: string;
    stats: {
        minPlayers: number;
        maxPlayers: number;
        minPlayTime: number;
        maxPlayTime: number;
        playingTime: number;
        playersWhoOwnThisGame: number;
    };
    ratingStats: {
        // collectionRating: string | number;
        usersRated: string;
        average: string;
        bayesAverage: string;
        stdDeviation: string;
        median: string;
        ranks?: any;
    };
    status: string;
    numplays: number;
    version?: {
        item: {
            image: string;
            thumbnail: string;
            link: any;
            name: string;
            yearpublished: string;
            productcode: string;
            width: string;
            length: string;
            depth: string;
            weight: string;
        };
    };
}
