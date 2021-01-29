import mongoose from 'mongoose';

const bggUserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true },
);

export const BggUser = mongoose.model('BggUser', bggUserSchema);
