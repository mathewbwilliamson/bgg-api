import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';
import { BoardGameItemRatingsEntity, BoardGameItemRatingsModel } from './BoardGameItemRatings.entity';
import { BoardGameItemStatsEntity, BoardGameItemStatsModel } from './BoardGameItemStats.entity';

export interface NewBoardGameItemModel {
    objectId: string;
    name: string;
    yearPublished: number;
    image: string;
    thumbnail: string;
    stats: BoardGameItemStatsModel;
    ratingStats: BoardGameItemRatingsModel;
}

export interface BoardGameItemModel extends NewBoardGameItemModel {
    id: ObjectID;
}
@Entity()
export class BoardGameItemEntity {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    objectId: string;

    @Column()
    name: string;

    @Column()
    yearPublished: number;

    @Column()
    image: string;

    @Column()
    thumbnail: string;

    @Column((type) => BoardGameItemStatsEntity)
    stats: BoardGameItemStatsEntity;

    @Column((type) => BoardGameItemRatingsEntity)
    ratingStats: BoardGameItemRatingsEntity;
}
