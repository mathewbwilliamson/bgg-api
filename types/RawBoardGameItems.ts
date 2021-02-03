export interface JsonCollection {
    items: { item: RawBoardGameItemFromCollection[] };
}

export interface JsonCollectionSingleItem {
    items: { item: RawBoardGameItem };
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

export interface AttrObj {
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
            link: AttrObj[];
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
    attr: RawAttrValue;
    thumbnail: string;
    image: string;
    name: AttrObj | AttrObj[];
    description: string;
    yearpublished: AttrObj;
    minplayers: AttrObj;
    maxplayers: AttrObj;
    poll: any;
    playingtime: AttrObj;
    minplaytime: AttrObj;
    maxplaytime: AttrObj;
    minage: AttrObj;
    link: AttrObj;
    videos: { attr: { '@_total': number }; video: RawAttrValue[] };
    statistics: {
        attr: { '@_page': number };
        ratings: {
            usersrated: AttrObj;
            average: AttrObj;
            bayesaverage: AttrObj;
            ranks: RawRank | RawRank[];
            stddev: AttrObj;
            median: AttrObj;
            owned: AttrObj;
            trading: AttrObj;
            wanting: AttrObj;
            wishing: AttrObj;
            numcomments: AttrObj;
            numweights: AttrObj;
            averageweight: AttrObj;
        };
    };
}
