export interface BoardGameCollectionDocument extends Document {
    objectId: string;
    name: string;
    yearPublished: number;
    image: string;
    thumbnail: string;
}
