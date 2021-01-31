import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

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
