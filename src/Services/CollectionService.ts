import { BoardGameItem } from '../../types/BoardGameItems';
import { RawBoardGameItemFromCollection } from '../../types/RawBoardGameItems';
import { NewBoardGameItemFromCollection, NewBoardGameItemModel } from '../Models/BoardGameItem.entity';
import { collectionRepo } from '../../index';
import { getCollectionFromBGG, getSingleBoardGameFromBGG } from './BoardGameGeekService';

const parseBoardgameItemFromCollection = (item: RawBoardGameItemFromCollection) => {
    return {
        objectId: item.attr['@_objectid'],
        collectionId: item.attr['@_collid'],
        attributes: {
            objectType: item.attr['@_objecttype'],
            subtype: item.attr['@_subtype'],
        },
        image: item.image,
        name: item.name['#text'],
        yearPublished: item.yearpublished,
        thumbnail: item.thumbnail,
        stats: {
            minPlayTime: item.stats.attr['@_minplaytime'],
            maxPlayTime: item.stats.attr['@_maxplaytime'],
            minPlayers: item.stats.attr['@_minplayers'],
            maxPlayers: item.stats.attr['@_maxplayers'],
            playersWhoOwnThisGame: item.stats.attr['@_numowned'],
            playingTime: item.stats.attr['@_playingtime'],
        },
        ratingStats: {
            usersRated: item.stats.rating.usersrated.attr['@_value'],
            average: item.stats.rating.average.attr['@_value'],
            bayesAverage: item.stats.rating.bayesaverage.attr['@_value'],
            stdDeviation: item.stats.rating.stddev.attr['@_value'],
            median: item.stats.rating.median.attr['@_value'],
        },
        status: {
            owned: item.status.attr['@_own'],
            prevOwned: item.status.attr['@_prevowned'],
            forTrade: item.status.attr['@_fortrade'],
            want: item.status.attr['@_want'],
            wantToPlay: item.status.attr['@_wanttoplay'],
            wantToBuy: item.status.attr['@_wanttobuy'],
            wishlist: item.status.attr['@_wishlist'],
            preOrdered: item.status.attr['@_preordered'],
            lastModified: item.status.attr['@_lastmodified'],
        },
        numplays: item.numplays,
    } as BoardGameItem;
};

const transformBoardgameItemToDbFormat: (item: BoardGameItem) => NewBoardGameItemFromCollection = (item) => {
    return {
        objectId: item.objectId,
        image: item.image,
        name: item.name,
        thumbnail: item.thumbnail,
        yearPublished: item.yearPublished,
        createdAt: String(new Date()),
        updatedAt: String(new Date()),
        stats: {
            minPlayers: item.stats.minPlayers,
            maxPlayers: item.stats.maxPlayers,
            minPlayTime: item.stats.minPlayTime,
            maxPlayTime: item.stats.maxPlayTime,
            playingTime: item.stats.playingTime,
            playersWhoOwnThisGame: item.stats.playersWhoOwnThisGame,
        },
        ratingStats: {
            usersRated: item.ratingStats.usersRated,
            average: item.ratingStats.average,
            bayesAverage: item.ratingStats.bayesAverage,
            stdDeviation: item.ratingStats.stdDeviation,
            median: item.ratingStats.median,
        },
    };
};

export const loadItemsFromCollectionIntoDb = async (username: string) => {
    const fullCollection = await getCollectionFromBGG(username);

    // [matt] Remove the count when closer to being done, we want ALL the items in the db
    let count = 0;

    try {
        for (const item of fullCollection.items.item) {
            if (count < 4) {
                const parsedItem = parseBoardgameItemFromCollection(item);

                // [matt] NewBoardGameItemModel
                const singleBoardGameItem = (await getSingleBoardGameFromBGG([
                    parsedItem.objectId,
                ])) as NewBoardGameItemModel;

                const collectionBoardGameItem: NewBoardGameItemFromCollection = transformBoardgameItemToDbFormat(
                    parsedItem,
                );

                const newBoardGameItemForDb: NewBoardGameItemModel = {
                    ...collectionBoardGameItem,
                    ...singleBoardGameItem,
                };

                collectionRepo.upsertBoardGameItem(newBoardGameItemForDb);
            }
            count = count + 1;
        }
    } catch (err) {
        console.log(fullCollection, err);
        return new Error(err);
    }

    return { message: `${fullCollection.items.item.length} records added to the DB` };
};
