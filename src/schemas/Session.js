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
  BASE_URL
} from '../config';

import {
  convertCursorToNodeId,
  convertNodeToCursor,
  Pagination,
} from '../pagination';

const SessionViewObject = new GraphQLObjectType({
  name: 'SessionViewObject',
  description: '...',

  fields: () => ({
    siteURL: { type: GraphQLString }, // (string, optional, read only),
    room: { type: GraphQLString }, // (string, optional),
    theater: { type: TheaterViewObject }, // (TheaterViewObject, optional),
    event: { type: EventViewObject }, // (EventViewObject, optional),
    id: { type: GraphQLString }, // (string, optional),
    price: { type: GraphQLString }, // (number, optional),
    type: { type: new GraphQLList(GraphQLString) }, // (Array[string], optional),
    types: { type: new GraphQLList(SessionTypes) }, // (Array[SessionTypes], optional),
    date: { type: DummyDate }, // (DummyDate, optional),
    realDate: { type: DummyDate }, // (DummyDate, optional),
    time: { type: GraphQLString }, // (string, optional),
    defaultSector: { type: GraphQLString }, // (string, optional),
    midnightMessage: { type: GraphQLString }, // (string, optional),
    hasSeatSelection: { type: GraphQLBoolean }, // (boolean, optional)
  }),

});

const TheaterViewObject = new GraphQLObjectType({
  name: 'TheaterViewObject',
  description: '...',

  fields: () => ({
    id: { type: GraphQLString }, // (string, optional),
    images: { type: new GraphQLList(ImageViewObject) }, // (Array[ImageViewObject], optional),
    urlKey: { type: GraphQLString }, // (string, optional),
    name: { type: GraphQLString }, // (string, optional),
    siteURL: { type: GraphQLString }, // (string, optional, read only),
    cnpj: { type: GraphQLString }, // (string, optional),
    districtAuthorization: { type: GraphQLString }, // (string, optional),
    address: { type: GraphQLString }, // (string, optional),
    addressComplement: { type: GraphQLString }, // (string, optional),
    number: { type: GraphQLString }, // (string, optional),
    cityId: { type: GraphQLString }, // (string, optional),
    cityName: { type: GraphQLString }, // (string, optional),
    state: { type: GraphQLString }, // (string, optional),
    uf: { type: GraphQLString }, // (string, optional),
    neighborhood: { type: GraphQLString }, // (string, optional),
    properties: { type: TheaterProperties }, // (TheaterProperties, optional),
    telephones: { type: new GraphQLList(GraphQLString) }, // (Array[string], optional),
    geolocation: { type: GeolocationViewObject }, // (GeolocationViewObject, optional),
    deliveryType: { type: new GraphQLList(GraphQLString) }, // (Array[string], optional),
    corporation: { type: GraphQLString }, // (string, optional),
    corporationId: { type: GraphQLString }, // (string, optional),
    corporationPriority: { type: GraphQLInt }, // (integer, optional),
    corporationAvatarBackground: { type: GraphQLString }, // (string, optional),
    rooms: { type: new GraphQLList(GraphQLString) }, // (Array[TheaterRoomViewObject], optional),
    totalRooms: { type: GraphQLInt }, // (integer, optional, read only)
  }),

});

type EventViewObject = new GraphQLObjectType({
  name: 'GenericTag',
  description: '...',

  fields: () => ({
  id: { type: GraphQLString }, // (string, optional),
  title: { type: GraphQLString }, // (string, optional),
  originalTitle: { type: GraphQLString }, // (string, optional),
  countryOrigin: { type: GraphQLString }, // (string, optional),
  priority: { type: GraphQLInt }, // (integer, optional),
  contentRating: { type: GraphQLString }, // (string, optional),
  duration: { type: GraphQLString }, // (string, optional),
  rating: { type: GraphQLString }, // (number, optional),
  synopsis: { type: GraphQLString }, // (string, optional),
  cast: { type: GraphQLString }, // (string, optional),
  director: { type: GraphQLString }, // (string, optional),
  distributor: { type: GraphQLString }, // (string, optional),
  inPreSale: { type: GraphQLBoolean }, // (boolean, optional),
  type: { type: GraphQLString }, // (string, optional),
  urlKey: { type: GraphQLString }, // (string, optional),
  isPlaying: { type: GraphQLBoolean }, // (boolean, optional),
  countIsPlaying: { type: GraphQLInt }, // (integer, optional),
  premiereDate: { type: DummyDate }, // (DummyDate, optional),
  creationDate: { type: GraphQLString }, // (string, optional),
  city: { type: GraphQLString }, // (string, optional),
  siteURL: { type: GraphQLString }, // (string, optional, read only),
  images (Array[ImageViewObject], optional),
  genres: { type: new GraphQLList(GraphQLString) }, // (Array[string], optional),
  completeTags (Array[GenericTag], optional),
  tags: { type: new GraphQLList(GraphQLString) }, // (Array[string], optional),
  trailers (Array[Trailer], optional)
  }

type SessionTypes = new GraphQLObjectType({
  name: 'GenericTag',
  description: '...',

  fields: () => ({
  id: { type: GraphQLInt }, // (integer, optional),
  name: { type: GraphQLString }, // (string, optional),
  alias: { type: GraphQLString }, // (string, optional),
  display: { type: GraphQLBoolean }, // (boolean, optional)
  }

type DummyDate = new GraphQLObjectType({
  name: 'GenericTag',
  description: '...',

  fields: () => ({
  localDate: { type: GraphQLString }, // (string, optional, read only),
  isToday: { type: GraphQLBoolean }, // (boolean, optional, read only),
  dayOfWeek: { type: GraphQLString }, // (string, optional, read only),
  dayAndMonth: { type: GraphQLString }, // (string, optional, read only),
  hour: { type: GraphQLString }, // (string, optional, read only),
  year: { type: GraphQLString }, // (string, optional, read only)
  }

type ImageViewObject = new GraphQLObjectType({
  name: 'GenericTag',
  description: '...',

  fields: () => ({
  url: { type: GraphQLString }, // (string, optional),
  type: { type: GraphQLString }, // (string, optional) = ['PosterPortrait', 'PosterHorizontal', 'Logo']
  }

type TheaterProperties = new GraphQLObjectType({
  name: 'GenericTag',
  description: '...',

  fields: () => ({
  hasBomboniere: { type: GraphQLBoolean }, // (boolean, optional)
  }

type GeolocationViewObject = new GraphQLObjectType({
  name: 'GenericTag',
  description: '...',

  fields: () => ({
  lat: { type: GraphQLString }, // (number, optional),
  lng: { type: GraphQLString }, // (number, optional)
  }

type TheaterRoomViewObject = new GraphQLObjectType({
  name: 'GenericTag',
  description: '...',

  fields: () => ({
  id: { type: GraphQLString }, // (string, optional),
  name: { type: GraphQLString }, // (string, optional),
  fullName: { type: GraphQLString }, // (string, optional),
  capacity: { type: GraphQLInt }, // (integer, optional),
  documents (Array[TheaterRoomDocumentViewObject], optional)
  }

type GenericTag = new GraphQLObjectType({
  name: 'GenericTag',
  description: '...',

  fields: () => ({
  name: { type: GraphQLString }, // (string, optional),
  background: { type: GraphQLString }, // (string, optional),
  color: { type: GraphQLString }, // (string, optional)
  }

type Trailer = new GraphQLObjectType({
  name: 'GenericTag',
  description: '...',

  fields: () => ({
  type: { type: GraphQLString }, // (string, optional),
  url: { type: GraphQLString }, // (string, optional),
  embeddedUrl: { type: GraphQLString }, // (string, optional)
  }

type TheaterRoomDocumentViewObject = new GraphQLObjectType({
  name: 'GenericTag',
  description: '...',

  fields: () => ({
  name: { type: GraphQLString }, // (string, optional),
  number: { type: GraphQLString }, // (string, optional),
  expiration: { type: GraphQLString }, // (string, optional)
  }

export const Event = {
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
};

export const allEvents = Pagination(EventType, (root, {first = 10, after, cityId, partnership}) => {

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

      let afterIndex = after || 0;

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

      const hasNextPage = _items.length > sliceIndex + first;

      return {
        count: _items.length,
        items,
        hasNextPage,
        afterIndex,
      };

    })

});
