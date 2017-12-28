import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList,
 } from 'graphql';

export function Item(itemType) {
    return new GraphQLObjectType({
        name: "Item",
        description: "Generic item to allow cursors",
        fields: () => ({
            node: { type: itemType },
            cursor: { type: GraphQLString }
        })
    });
}

export const PageInfo = new GraphQLObjectType({
    name: "PageInfo",
    description: "Information about current page",

    fields: () => ({
        startIndex: { type: GraphQLInt },
        endIndex: { type: GraphQLInt },
        startCursor: { type: GraphQLString },
        endCursor: { type: GraphQLString },
        hasNextPage: { type: GraphQLBoolean }
    })
});

export function Page(itemType) {
    return new GraphQLObjectType({
        name: "Page",
        description: "Page",

        fields: () => ({
            totalCount: { type: GraphQLInt },
            items: { type: new GraphQLList(Item(itemType)) },
            pageInfo: { type: PageInfo }
        })
    });
}

export function convertNodeToCursor(node) {
    return bota(node.id.toString());
}

export function bota(input) {
    return new Buffer(input.toString(), 'binary').toString("base64");
}

export function convertCursorToNodeId(cursor) {
    return parseInt(atob(cursor));
}

export function atob(input) {
    return new Buffer(input, 'base64').toString('binary');
}
