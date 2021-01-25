import express from 'express';
import axios from 'axios';
import parser, { X2jOptions } from 'fast-xml-parser';
import he from 'he';
import {BoardGameItem} from './types/BoardGameItems'

require('dotenv').config();

const app = express();
const port = process.env.PORT || '8000';

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

app.get('/', async (req, res) => {
    const collectionReq = await axios.get(
        'https://www.boardgamegeek.com/xmlapi2/collection?username=deviantmagick&version=1&stats=1&own=1'
    );

    const totalPlays = (await axios.get(
        'https://www.boardgamegeek.com/xmlapi2/plays?username=deviantmagick'
    )).data;

    const options: Partial<X2jOptions> = {
        attributeNamePrefix: '@_',
        attrNodeName: 'attr', //default is 'false'
        textNodeName: '#text',
        ignoreAttributes: false,
        ignoreNameSpace: false,
        allowBooleanAttributes: false,
        parseNodeValue: true,
        parseAttributeValue: true,
        trimValues: true,
        cdataTagName: '__cdata', //default is 'false'
        cdataPositionChar: '\\c',
        parseTrueNumberOnly: false,
        arrayMode: false, //"strict"
        attrValueProcessor: (val, attrName) =>
            he.decode(val, { isAttributeValue: true }), //default is a=>a
        tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
        stopNodes: ['parse-me-as-string'],
    };

    const boardgameObject: any = {}

    const collectionXml = collectionReq.data;
    const collectionStatus = collectionReq.status;
    const jsonCollection = parser.parse(
            collectionXml,
            options
        ) as any;
    const jsonPlays = parser.parse(
            totalPlays,
            options
        ) as any;
    
        console.log('\x1b[41m%s \x1b[0m', '[matt] jsonCollection', jsonCollection);
    if (jsonCollection && !!jsonCollection?.message) {
        // [matt] Need to do retries for this. Maybe a redis job??
        return res.status(202).send('They are timing us out')
    }

    try {
        jsonCollection.items.item.forEach(async (item: any, idx: number) => {
            if (
                idx === 600 ||
                idx === 50 ||
                idx === 100 ||
                idx === 200 ||
                idx === 500
            ) {
                console.log(
                    '/////////////////////////////////////////////////////////////////////////'
                );
                console.log(idx, item);
                console.log('PARSED ITEM', parseBoardgameItem(item));
                console.log('RATING', item.stats.rating.ranks.rank);
                const parsedItem = parseBoardgameItem(item);
                boardgameObject[parsedItem.objectId] = {...parsedItem}
                
            } 
        });
        console.log('\x1b[41m%s \x1b[0m', '[matt] totalPlays', jsonPlays.plays.play[0]);
        console.log('\x1b[42m%s \x1b[0m', '[matt] boargameObject', boardgameObject);
    } catch (e) {
        console.log(jsonCollection, e);
    }

    res.status(200).send('this is for BGG' + collectionStatus);
});

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
