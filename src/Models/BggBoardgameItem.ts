import mongoose from 'mongoose';

const bggBoardgameItem = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        collectionId: {
            type: String,
            unique: true,
            required: true,
        },
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
    { timestamps: true }
);

export const BggBoardgameItem = mongoose.model(
    'BggBoardgameItem',
    bggBoardgameItem
);
