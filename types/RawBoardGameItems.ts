export interface JsonCollection {
    items: { item: RawBoardGameItemFromCollection[] };
}

export interface JsonCollectionSingleItem {
    items: { item: RawBoardGameItemFromCollection[] };
}

export interface RawAttrValue {
    '@_value'?: number | string;
    '@_type'?: string;
    '@_id'?: number | string;
    '@_name'?: string;
    '@_sortindex'?: string;
}

export interface RawRanksItem extends RawAttrValue {
    '@_friendlyname': string;
    '@_bayesaverage': number;
}

export interface RawRank {
    attr: RawRanksItem;
}

export interface RawLink {
    attr: RawAttrValue;
}

export interface RawBoardGameItemFromCollection {
    attr: {
        '@_objecttype': string;
        '@_objectid': string;
        '@_subtype': string;
        '@_collid': string;
    };
    name: {
        '#text': string;
        attr: { '@_sortindex': number };
    };
    yearpublished: number;
    image: string;
    thumbnail: string;
    stats: {
        attr: {
            '@_minplayers': number;
            '@_maxplayers': number;
            '@_minplaytime': number;
            '@_maxplaytime': number;
            '@_playingtime': number;
            '@_numowned': number;
        };
        rating: {
            attr: RawAttrValue;
            usersrated: { attr: RawAttrValue };
            average: { attr: RawAttrValue };
            bayesaverage: { attr: RawAttrValue };
            stddev: { attr: RawAttrValue };
            median: { attr: RawAttrValue };
            ranks: RawRank | RawRank[];
        };
    };
    status: {
        attr: {
            '@_own': number;
            '@_prevowned': number;
            '@_fortrade': number;
            '@_want': number;
            '@_wanttoplay': number;
            '@_wanttobuy': number;
            '@_wishlist': number;
            '@_preordered': number;
            '@_lastmodified': string;
        };
    };
    numplays: number;
    version: {
        item: {
            attr: RawAttrValue;
            image: string;
            thumbnail: string;
            link: RawLink[];
            name: {
                attr: {
                    '@_type': string;
                    '@_sortindex': number;
                    '@_value': string;
                };
            };
            yearpublished: { attr: RawAttrValue };
            productcode: { attr: RawAttrValue };
            width: { attr: RawAttrValue };
            length: { attr: RawAttrValue };
            depth: { attr: RawAttrValue };
            weight: { attr: RawAttrValue };
        };
    };
}
export interface RawBoardGameItem {
    attr: any;
    thumbnail: string;
    image: string;
    name: RawAttrValue | RawAttrValue[];
    description: string;
    yearpublished: { attr: RawAttrValue };
    minplayers: { attr: RawAttrValue };
    maxplayers: { attr: RawAttrValue };
    poll: any;
    playingtime: { attr: RawAttrValue };
    minplaytime: { attr: RawAttrValue };
    maxplaytime: { attr: RawAttrValue };
    minage: { attr: RawAttrValue };
    link: { attr: RawAttrValue };
    videos: { attr: { '@_total': number }; video: RawAttrValue[] };
    statistics: {
        attr: { '@_page': number };
        ratings: {
            usersrated: RawAttrValue;
            average: RawAttrValue;
            bayesaverage: RawAttrValue;
            ranks: RawRank | RawRank[];
            stddev: RawAttrValue;
            median: RawAttrValue;
            owned: RawAttrValue;
            trading: RawAttrValue;
            wanting: RawAttrValue;
            wishing: RawAttrValue;
            numcomments: RawAttrValue;
            numweights: RawAttrValue;
            averageweight: RawAttrValue;
        };
    };
}
