import mongoose from 'mongoose';

const bggBoardgameItem = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true }
);

export const BggBoardgameItem = mongoose.model(
    'BggBoardgameItem',
    bggBoardgameItem
);
