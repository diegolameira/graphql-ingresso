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

export const Pagination = (type, resolve) => ({
  type: Page(type),
  description: "Return the 'first' X number of items 'after' the specified cursor'",
  args: {
    first: {
      type: GraphQLInt,
      description: "Limits the number of results returned in the page. Defaults to 10."
    },
    after: {
      type: GraphQLString,
      description: "The cursor value of an item returned in previous page. An alternative to in integer offset."
    },
    cityId: { type: GraphQLString },
    partnership: { type: GraphQLString },
  },
  resolve: (root, params) => resolve(root, params).then(({items, count}) => {
    const { first, after } = params;

    if ( typeof after === "string" ) {
      let  id = convertCursorToNodeId(after);
      if (typeof id === "number") {
        const matchingIndex = _items.findIndex(item => item.id == id);
        if (matchingIndex != -1) {
          afterIndex = matchingIndex;
        }
      }
    }

    return {
      totalCount: count,
      items,
      pageInfo: {
        hasNextPage,
        startCursor: items.length > 0 ? convertNodeToCursor(items[0].node) : null,
        endCursor:   items.length > 0 ? convertNodeToCursor(items[items.length-1].node) : null,
        startIndex: afterIndex,
        endIndex: afterIndex + first,
      }
    };
  })
});
