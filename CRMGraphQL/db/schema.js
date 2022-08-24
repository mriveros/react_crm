const { gql } = require('apollo-server');
// The GraphQL schema
const typeDefs = gql`
  type Query{
    obtenerCurso: String
  }
`;
module.exports = typeDefs;