import { ApolloServer, BaseContext } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schemas/index.ts";
import { games, reviews, authors } from "./db.ts";
import { IAddGameInput, IEditGameInput } from "./types/games.ts";

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves the data defined in mock data.
const resolvers = {
  /**  Query with Capital Q is the root query
   * and then we have all the type queries we defined before
   * the name "reviews" here should match the name in the schema
   * Is like calling the endpoints here
   *
   * The Query object is for the entry points to the graph
   * as we defined them
   *
   * For related data with any query defined we need to create
   * another property on resolvers object */
  Query: {
    reviews: () => reviews,

    /** the parent resolver is the first argument, we put underscore
     * because we don't need it, the second argument is the arguments
     * we can access any query variable
     * and the third argument is the context object, we get access to
     * the objects in every resolver
     */
    review: (_: any, args: { id: string }) =>
      reviews.find((review) => review.id === args.id),

    games: () => games,
    game: (_: any, args: { id: string }) =>
      games.find((game) => game.id === args.id),

    authors: () => authors,
    author: (_: any, args: { id: string }) =>
      authors.find((author) => author.id === args.id),
  },

  /** We need to create a property for every type related we have
   *
   * For the case of Game associated with reviews...Apollo first
   * will read the Query game above, then it will relate the game
   * down here with the reviews, in order to get what we need
   */
  Game: {
    // and know we need the parent argument
    reviews: (parent: { id: string }) =>
      reviews.filter((review) => review.game_id === parent.id),
  },
  Author: {
    reviews: (parent: { id: string }) =>
      reviews.filter((review) => review.game_id === parent.id),
  },
  Review: {
    // single author per review
    author: (parent: { author_id: string }) =>
      authors.find((author) => author.id === parent.author_id),

    // single game per review
    game: (parent: { game_id: string }) =>
      games.find((game) => game.id === parent.game_id),
  },
  Mutation: {
    addGame: (_: any, args: IAddGameInput) => {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 1000).toString(), // find a better aproach
      };

      games.push(game);

      return game;
    },
    updateGame: (_: any, args: IEditGameInput) => {
      let game = games.find((game) => game.id === args.id);

      if (!game) {
        throw new Error("Game not found");
      }

      game = {
        ...game,
        ...args.edits,
      };

      return game;
    },
    deleteGame: (_: any, args: { id: string }) => {
      return games.filter((game) => game.id !== args.id);
    },
  },
};

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const server: ApolloServer<BaseContext> = new ApolloServer({
  // a map for Apollo to know the structure of the data
  typeDefs: typeDefs,

  // resolver is a function that returns the data
  resolvers: resolvers,
});

// await top-level allowed by esnext option in tsconfig.json
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);
