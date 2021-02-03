import axios from 'axios';
import parser, { X2jOptions } from 'fast-xml-parser';
import he from 'he';
import { NewBoardGameItemModel } from '../Models/BoardGameItem.entity';
import { AttrObj, JsonCollection, JsonCollectionSingleItem } from '../../types/RawBoardGameItems';

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

const parseXML = (response: any) => {
    const jsonCollection = parser.parse(response, xmlOptions) as any; // [matt] TYPE THIS

    if (!!jsonCollection?.errors?.error) {
        console.log('\x1b[44m%s \x1b[0m', '[matt] ERROR ');

        throw new Error(jsonCollection?.errors?.error?.message);
    }

    if (jsonCollection && !!jsonCollection?.message) {
        console.log('\x1b[44m%s \x1b[0m', '[matt] MESSAGE');

        // [matt] Need to do retries for this. Maybe a redis job??
        return new Error('They are timing us out');
    }

    return jsonCollection;
};

export const getCollectionFromBGG = async (username: string) => {
    try {
        const response = (
            await axios.get<string>(
                `https://www.boardgamegeek.com/xmlapi2/collection?username=${username}&version=1&stats=1&own=1`,
            )
        ).data;

        return parseXML(response) as JsonCollection;
    } catch (err) {
        throw new Error(err);
    }
};

// NewBoardGameItemModel
export const parseSingleBoardGame = (rawItem: JsonCollectionSingleItem) => {
    const item = rawItem.items.item;
    const itemName =
        typeof item.name === 'object' && (item.name as AttrObj).attr
            ? (item.name as AttrObj).attr['@_value']
            : (item.name as AttrObj[]).find((nameItem) => nameItem.attr['@_type'] === 'primary').attr['@_value'];

    console.log('\x1b[42m%s \x1b[0m', '[matt] item.sta', item.statistics.ratings);
    return {
        objectId: item.attr['@_id'],
        name: itemName,
        yearPublished: item.yearpublished.attr['@_value'],
        image: item.image,
        description: item.description,
        thumbnail: item.thumbnail,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        stats: {
            minPlayers: item.minplayers.attr['@_value'],
            maxPlayers: item.maxplayers.attr['@_value'],
            minPlayTime: item.minplaytime.attr['@_value'],
            maxPlayTime: item.maxplaytime.attr['@_value'],
            playingTime: item.playingtime.attr['@_value'],
        },
        ratingStats: {
            usersRated: item.statistics.ratings.usersrated.attr['@_value'],
            average: item.statistics.ratings.average.attr['@_value'],
            bayesAverage: item.statistics.ratings.bayesaverage.attr['@_value'],
            stdDeviation: item.statistics.ratings.stddev.attr['@_value'],
            median: item.statistics.ratings.median.attr['@_value'],
            numWeights: item.statistics.ratings.numweights.attr['@_value'],
            averageWeight: item.statistics.ratings.averageweight.attr['@_value'],
        },
    } as NewBoardGameItemModel;
};

export const getSingleBoardGameFromBGG = async (gameIds: string[]) => {
    const idsToSend = gameIds.join(',');

    try {
        const response = (
            await axios.get<string>(`https://www.boardgamegeek.com/xmlapi2/thing?id=${idsToSend}&videos=1&stats=1`)
        ).data;

        const rawItem = parseXML(response) as JsonCollectionSingleItem;

        return parseSingleBoardGame(rawItem) as NewBoardGameItemModel;
    } catch (err) {
        throw new Error(err);
    }
};
