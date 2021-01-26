import mongoose from 'mongoose';

const bggCollection = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true }
);

export const BggCollection = mongoose.model('BggCollection', bggCollection);
