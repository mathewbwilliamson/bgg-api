import mongoose, { Document, model, Model } from 'mongoose';

export interface BoardGameItemDocument extends Document {
    objectId: string;
    name: string;
    yearPublished: number;
    image: string;
    thumbnail: string;
}

export type BoardGameItemModel = Model<BoardGameItemDocument>;

const BggBoardgameItemSchema = new mongoose.Schema<BoardGameItemDocument>(
    {
        objectId: {
            type: String,
            unique: true,
            required: true,
        },
        name: String,
        yearPublished: Number,
        image: String,
        thumbnail: String,
    },
    { timestamps: true },
);

export const BggBoardgameItem = model<BoardGameItemDocument, BoardGameItemModel>(
    'BggBoardgameItem',
    BggBoardgameItemSchema,
);
