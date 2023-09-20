export const typeDefs = `#graphql

# ! means required
# [String!]! means required array of strings
# the elements of the array cannot be null
type Game{
    id: ID!
    title: String!
    platform: [String!]! # array of strings
    reviews: [Review!] # a list of reviews for a game
}

type Review{
    id: ID!,
    rating: Int!
    content: String!
    game: Game! # related to the Game type
    author: Author! # related to the Author type
}

type Author{
    id: ID!
    name: String!
    verified: Boolean!

    # at the end we don't put as required because
    # the author might not have any reviews yet, but
    # if it has, it will need to be required
    reviews: [Review!] 
}

# every query needs a type, is not optional
# is like creating the query Type where query can
# start from.
# These are like the entry points to the data
type Query{
    reviews: [Review] # all reviews
    review(id: ID!): Review # single review, ID required
    games: [Game]
    game(id: ID!): Game
    authors: [Author]
    author(id: ID!): Author
}

# mutation is for creating, updating and deleting data
type Mutation {
    addGame(game: AddGameInput!): Game
    deleteGame(id: ID!): [Game]
    updateGame(id: ID!, edits: EditGameInput!): Game
}

# collect the fields into a single object, kinda like a type
input AddGameInput {
    title: String!,
    platform: [String!]!
}

input EditGameInput {
    title: String,
    platform: [String!] # optional, because we don't need to edit the platform if we don't want to
}
`;
