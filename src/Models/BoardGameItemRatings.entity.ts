import { Column } from 'typeorm';

export interface BoardGameItemRatingsModel {
    usersRated: string;
    average: string;
    bayesAverage: string;
    stdDeviation: string;
    median: string;
}

export class BoardGameItemRatingsEntity {
    @Column()
    usersRated: string;

    @Column()
    average: string;

    @Column()
    bayesAverage: string;

    @Column()
    stdDeviation: string;

    @Column()
    median: string;

    constructor(usersRated: string, average: string, bayesAverage: string, stdDeviation: string, median: string) {
        this.usersRated = usersRated;
        this.average = average;
        this.bayesAverage = bayesAverage;
        this.stdDeviation = stdDeviation;
        this.median = median;
    }
}
