import fetch from 'node-fetch';
import {
  GraphQLInt,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';

import {
  Page,
  convertCursorToNodeId,
  convertNodeToCursor,
} from './pagination';

const movieId = 19805;
const cityId = 2;
const partnership = 'home';
const BASE_URL = 'https://api-content.ingresso.com/v0';

const ImageType = new GraphQLObjectType({
  name: 'Image',
  description: '...',

  fields: () => ({
    url: { type: GraphQLString }, //(string, optional),
    type: { type: GraphQLString }, //(string, optional) = ['PosterPortrait', 'PosterHorizontal', 'Logo']
  })
})

const GenericTagType = new GraphQLObjectType({
  name: 'GenericTag',
  description: '...',

  fields: () => ({
    name: { type: GraphQLString }, // (string, optional),
    background: { type: GraphQLString }, // (string, optional),
    color: { type: GraphQLString }, // (string, optional)
  })
});

const TrailerType = new GraphQLObjectType({
  name: 'Trailer',
  description: '...',

  fields: () => ({
    type: { type: GraphQLString }, // (string, optional),
    url: { type: GraphQLString }, // (string, optional),
    embeddedUrl: { type: GraphQLString }, // (string, optional)
  })
});

const DummyDateType = new GraphQLObjectType({
  name: 'DummyDate',
  description: '...',

  fields: () => ({
    localDate: { type: GraphQLString }, // (string, optional, read only),
    isToday: { type: GraphQLBoolean }, // (boolean, optional, read only),
    dayOfWeek: { type: GraphQLString }, // (string, optional, read only),
    dayAndMonth: { type: GraphQLString }, // (string, optional, read only),
    hour: { type: GraphQLString }, // (string, optional, read only),
    year: { type: GraphQLString }, // (string, optional, read only)
  })
});

const EventType = new GraphQLObjectType({
  name: 'Event',
  description: '...',

  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    originalTitle: { type: GraphQLString },
    countryOrigin: { type: GraphQLString },
    contentRating: { type: GraphQLString },
    duration: { type: GraphQLString },
    synopsis: { type: GraphQLString },
    cast: { type: GraphQLString },
    director: { type: GraphQLString },
    distributor: { type: GraphQLString },
    type: { type: GraphQLString },
    urlKey: { type: GraphQLString },
    creationDate: { type: GraphQLString },
    city: { type: GraphQLString },
    siteURL: { type: GraphQLString },

    priority: { type: GraphQLInt }, // (integer, optional),
    rating: { type: GraphQLInt }, // (number, optional),
    inPreSale: { type: GraphQLBoolean }, // (boolean, optional),
    isPlaying: { type: GraphQLBoolean }, // (boolean, optional),
    countIsPlaying: { type: GraphQLInt }, // (integer, optional),
    premiereDate: { type: DummyDateType }, // (DummyDate, optional),
    images: { type: new GraphQLList(ImageType) }, // (Array[ImageViewObject], optional),
    genres: { type: new GraphQLList(GraphQLString) }, // (Array[string], optional),
    completeTags: { type: new GraphQLList(GenericTagType) }, // (Array[GenericTag], optional),
    tags: { type: new GraphQLList(GraphQLString) }, // (Array[string], optional),
    trailers: { type: new GraphQLList(TrailerType) }, // (Array[Trailer], optional)

  }),
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',

  fields: () => ({
    Event: {
      type: EventType,
      args: {
        id: { type: GraphQLString },
        urlKey: { type: GraphQLString },
        partnership: { type: GraphQLString },
      },
      resolve: (root, args) => {

        const {id, urlKey, partnership} = args;

        if (!id && !urlKey) return Promise.reject(new Error('Must pass in either an id or urlKey'));
        if (id && urlKey) return Promise.reject(new Error('Must pass in either an id or urlKey, but not both.'));

        const url = `${BASE_URL}/events/${
          id ?
            (`${id}/partnership/${partnership}`)
          : (`url-key/${urlKey}/partnership/${partnership}`)
        }`;

        return fetch(url)
          .then(res => res.json())
      }
    },
    Events: {
      type: Page(EventType),
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
      resolve: (root, {first = 10, after, cityId, partnership}) => {


        const url = `${BASE_URL}/events/${
          !cityId ?
            (`partnership/${partnership}`)
          : (`city/${cityId}/partnership/${partnership}`)
        }`;

        return fetch(url)
          .then(res => res.json())
          .then(res => res.items)
          // remove it to remove pagination
          .then(_items => {

            let afterIndex = 0;

            // Get ID from after argument or default to first item.
            if (typeof after === "string") {
              let  id = convertCursorToNodeId(after);
              if (typeof id === "number") {
                const matchingIndex = _items.findIndex(item => item.id == id);
                if (matchingIndex != -1) {
                  afterIndex = matchingIndex;
                }
              }
            }

            // Add 1 to exclude item matching after index.
            const sliceIndex = afterIndex + 1;

            const items = _items
              .slice(sliceIndex, sliceIndex + first)
              .map(node => ({
                  node,
                  cursor: convertNodeToCursor(node)
              }));

            const startCursor = items.length > 0 ? convertNodeToCursor(items[0].node) : null;
            const endCursor = items.length > 0 ? convertNodeToCursor(items[items.length-1].node) : null;
            const hasNextPage = _items.length > sliceIndex + first;

            return {
              totalCount: _items.length,
              items,
              pageInfo: {
                startIndex: afterIndex,
                endIndex: afterIndex + first,
                startCursor,
                endCursor,
                hasNextPage
              }
            };

          })

      }
    },
  }),
});

export default new GraphQLSchema({
  query: QueryType,
});
