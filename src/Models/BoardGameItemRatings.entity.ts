import { Column } from 'typeorm';

export type BoardGameItemRatingsFromCollection = Omit<BoardGameItemRatingsModel, 'numWeights' | 'averageWeight'>;
export interface BoardGameItemRatingsModel {
    usersRated: string;
    average: string;
    bayesAverage: string;
    stdDeviation: string;
    median: string;
    numWeights: number;
    averageWeight: number;
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

    @Column()
    numWeights: number;

    @Column()
    averageWeight: number;

    constructor(
        usersRated: string,
        average: string,
        bayesAverage: string,
        stdDeviation: string,
        median: string,
        numWeights: number,
        averageWeight: number,
    ) {
        this.usersRated = usersRated;
        this.average = average;
        this.bayesAverage = bayesAverage;
        this.stdDeviation = stdDeviation;
        this.median = median;
        this.numWeights = numWeights;
        this.averageWeight = averageWeight;
    }
}
