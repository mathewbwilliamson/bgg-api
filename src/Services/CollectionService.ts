import axios from 'axios';
import parser, { X2jOptions } from 'fast-xml-parser';
import he from 'he';
import { BoardGameItem } from '../../types/BoardGameItems';
import { RawBoardGameItem } from '../../types/RawBoardGameItems';
import { NewBoardGameItemModel } from '../Models/BoardGameItem.entity';
import { collectionRepo } from '../../index';

const xmlOptions: Partial<X2jOptions> = {
    attributeNamePrefix: '@_',
    attrNodeName: 'attr', // default is 'false'
    textNodeName: '#text',
    ignoreAttributes: false,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: true,
    trimValues: true,
    cdataTagName: '__cdata', // default is 'false'
    cdataPositionChar: '\\c',
    parseTrueNumberOnly: false,
    arrayMode: false, // "strict"
    attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }), // default is a=>a
    tagValueProcessor: (val, tagName) => he.decode(val), // default is a=>a
    stopNodes: ['parse-me-as-string'],
};

const getCollectionFromBGG = async (username: string) => {
    try {
        return (
            await axios.get<string>(
                `https://www.boardgamegeek.com/xmlapi2/collection?username=${username}&version=1&stats=1&own=1`,
            )
        ).data;
    } catch (err) {
        throw new Error(err);
    }
};

const parseBoardgameItem = (item: RawBoardGameItem) => {
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

export const loadItemsFromCollectionIntoDb = async (username: string) => {
    const collectionXml = await getCollectionFromBGG(username);
    const boardgameObject: any = {};

    const jsonCollection = parser.parse(collectionXml, xmlOptions) as any;

    if (!!jsonCollection?.errors?.error) {
        console.log('\x1b[44m%s \x1b[0m', '[matt] HERE 3 ERRPR ');

        throw new Error(jsonCollection?.errors?.error?.message);
    }

    if (jsonCollection && !!jsonCollection?.message) {
        console.log('\x1b[44m%s \x1b[0m', '[matt] MESSAGE');

        // [matt] Need to do retries for this. Maybe a redis job??
        return new Error('They are timing us out');
    }

    // [matt] Remove the count when closer to being done, we want ALL the items in the db
    let count = 0;

    try {
        for (const item of jsonCollection.items.item) {
            if (count < 31) {
                const parsedItem = parseBoardgameItem(item);
                console.log('\x1b[42m%s \x1b[0m', '[matt] item', item.stats.rating);
                const newBoardGameItemForDb: NewBoardGameItemModel = {
                    objectId: parsedItem.objectId,
                    image: parsedItem.image,
                    name: parsedItem.name,
                    thumbnail: parsedItem.thumbnail,
                    yearPublished: parsedItem.yearPublished,
                    stats: {
                        minPlayers: parsedItem.stats.minPlayers,
                        maxPlayers: parsedItem.stats.maxPlayers,
                        minPlayTime: parsedItem.stats.minPlayTime,
                        maxPlayTime: parsedItem.stats.maxPlayTime,
                        playingTime: parsedItem.stats.playingTime,
                        playersWhoOwnThisGame: parsedItem.stats.playersWhoOwnThisGame,
                    },
                    ratingStats: {
                        usersRated: parsedItem.ratingStats.usersRated,
                        average: parsedItem.ratingStats.average,
                        bayesAverage: parsedItem.ratingStats.bayesAverage,
                        stdDeviation: parsedItem.ratingStats.stdDeviation,
                        median: parsedItem.ratingStats.median,
                    },
                };

                collectionRepo.upsertBoardGameItem(newBoardGameItemForDb);

                boardgameObject[parsedItem.objectId] = { ...parsedItem };
            }
            count = count + 1;
        }
    } catch (err) {
        console.log(jsonCollection, err);
        return new Error(err);
    }

    return { message: `${jsonCollection.items.item.length} records added to the DB` };
};
