export interface JsonCollection {
    items: { item: RawBoardGameItem[] };
}
export interface RawAttrValue {
    '@_value'?: number | string;
    '@_type'?: string;
    '@_id'?: number | string;
    '@_name'?: string;
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

export interface RawBoardGameItem {
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
            '@_minplayers': 2;
            '@_maxplayers': 4;
            '@_minplaytime': 20;
            '@_maxplaytime': 20;
            '@_playingtime': 20;
            '@_numowned': 3212;
        };
        rating: {
            attr: RawAttrValue;
            usersrated: { attr: RawAttrValue };
            average: { attr: RawAttrValue };
            bayesaverage: { attr: RawAttrValue };
            stddev: { attr: RawAttrValue };
            median: { attr: RawAttrValue };
            ranks: RawRank[];
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
