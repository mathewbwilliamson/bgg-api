import { Column } from 'typeorm';

export interface BoardGameItemStatsModel {
    minPlayers: number;
    maxPlayers: number;
    minPlayTime: number;
    maxPlayTime: number;
    playingTime: number;
    playersWhoOwnThisGame: number;
}

export class BoardGameItemStatsEntity {
    @Column()
    minPlayers: number;

    @Column()
    maxPlayers: number;

    @Column()
    minPlayTime: number;

    @Column()
    maxPlayTime: number;

    @Column()
    playingTime: number;

    @Column()
    playersWhoOwnThisGame: number;

    constructor(
        minPlayers: number,
        maxPlayers: number,
        minPlayTime: number,
        maxPlayTime: number,
        playingTime: number,
        playersWhoOwnThisGame: number,
    ) {
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
        this.minPlayTime = minPlayTime;
        this.maxPlayTime = maxPlayTime;
        this.playingTime = playingTime;
        this.playersWhoOwnThisGame = playersWhoOwnThisGame;
    }
}
