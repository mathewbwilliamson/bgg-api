import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

interface BoardGameItemInitializer {
    objectId: string;
    name: string;
    yearPublished: number;
    image: string;
    thumbnail: string;
    status: string;
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
