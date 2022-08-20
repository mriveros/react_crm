const { ApolloServer, gql } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');



const server = new ApolloServer({
  typeDefs,
  resolvers, 
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      // options
    })
  ]
});

server.listen().then(({ url }) => {
  console.log(`🚀 Servidor listo en la url: ${url}`);
});