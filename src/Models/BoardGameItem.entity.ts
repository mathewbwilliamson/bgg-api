import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

export interface NewBoardGameItemEntity {
    objectId: string;
    name: string;
    yearPublished: number;
    image: string;
    thumbnail: string;
    status: string;
}

export interface BoardGameItemEntity extends NewBoardGameItemEntity {
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

    @Column()
    status: string;
}
