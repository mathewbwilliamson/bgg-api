import axios from 'axios';
import parser, { X2jOptions } from 'fast-xml-parser';
import he from 'he';
import { BoardGameItem } from '../../types/BoardGameItems';

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

const parseBoardgameItem = (item: any) => {
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
        status: 'NONE',
        numplays: 0,
    } as BoardGameItem;
};

export const getCollection = async (username: string) => {
    const collectionXml = await getCollectionFromBGG(username);
    const boardgameObject: any = {};

    const jsonCollection = parser.parse(collectionXml, xmlOptions) as any;

    if (!!jsonCollection?.errors?.error) {
        throw new Error(jsonCollection?.errors?.error?.message);
    }

    if (jsonCollection && !!jsonCollection?.message) {
        // [matt] Need to do retries for this. Maybe a redis job??
        return new Error('They are timing us out');
    }

    try {
        // jsonCollection.items.item.forEach(async (item: any, idx: number) => {
        //     if (idx === 600 || idx === 50 || idx === 100 || idx === 200 || idx === 500) {
        //         console.log('/////////////////////////////////////////////////////////////////////////');
        //         // console.log(idx, item);
        //         // console.log('PARSED ITEM', parseBoardgameItem(item));
        //         // console.log('RATING', item.stats.rating.ranks.rank);
        //         const parsedItem = parseBoardgameItem(item);
        //         const two = new models.BggBoardgameItem({
        //             objectId: parsedItem.objectId,
        //             name: parsedItem.name,
        //             yearPublished: parsedItem.yearPublished,
        //             image: parsedItem.image,
        //             thumbnail: parsedItem.thumbnail,
        //         });

        //         await two.save();
        //         console.log('\x1b[42m%s \x1b[0m', '[matt] thing', two);

        //         boardgameObject[parsedItem.objectId] = { ...parsedItem };
        //     }
        // });
        const boardGameArray: any[] = [];
        let count = 0;
        for (const item of jsonCollection.items.item) {
            if (count === 600 || count === 50 || count === 100 || count === 200 || count === 500) {
                console.log('/////////////////////////////////////////////////////////////////////////');
                // console.log(count, item);
                // console.log('PARSED ITEM', parseBoardgameItem(item));
                // console.log('RATING', item.stats.rating.ranks.rank);
                const parsedItem = parseBoardgameItem(item);
                boardGameArray.push({
                    objectId: parsedItem.objectId,
                    name: parsedItem.name,
                    yearPublished: parsedItem.yearPublished,
                    image: parsedItem.image,
                    thumbnail: parsedItem.thumbnail,
                });
                // console.log('\x1b[41m%s \x1b[0m', '[matt] parsedItem', parsedItem);
                // const two = await new models.BggBoardgameItem({
                //     objectId: parsedItem.objectId,
                //     name: parsedItem.name,
                //     yearPublished: parsedItem.yearPublished,
                //     image: parsedItem.image,
                //     thumbnail: parsedItem.thumbnail,
                // });
                // two.collection.save();

                // await two.save();
                // console.log('\x1b[42m%s \x1b[0m', '[matt] thing', two);

                boardgameObject[parsedItem.objectId] = { ...parsedItem };
            }
            count = count + 1;
        }

        console.log('\x1b[42m%s \x1b[0m', '[matt] boargameObject', boardgameObject);
    } catch (err) {
        console.log(jsonCollection, err);
        return new Error(err);
    }

    return boardgameObject;
};
