import axios from 'axios';
import parser, { X2jOptions } from 'fast-xml-parser';
import he from 'he';
import { JsonCollection, JsonCollectionSingleItem } from '../../types/RawBoardGameItems';

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

export const getSingleBoardGameFromBGG = async (gameIds: string[]) => {
    const idsToSend = gameIds.join(',');

    try {
        const response = (
            await axios.get<string>(`https://www.boardgamegeek.com/xmlapi2/thing?id=${idsToSend}&videos=1&stats=1`)
        ).data;

        return parseXML(response) as JsonCollectionSingleItem;
    } catch (err) {
        throw new Error(err);
    }
};
