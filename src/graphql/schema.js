import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from 'graphql';

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});

let peopleData = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sara Smith' },
  { id: 3, name: 'Budd Deey' },
];

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => peopleData,
    },
    person: {
      type: PersonType,
      args: {
        id: { type: GraphQLInt }
      }
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    renamePerson: {
      type: PersonType,
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
      },
      resolve: (value, { id, name }) => {
        peopleData[id - 1].name = name
        return peopleData[id - 1]
      }
    }
  }),
});

export const schema = new GraphQLSchema({ query: QueryType, mutation: MutationType });
