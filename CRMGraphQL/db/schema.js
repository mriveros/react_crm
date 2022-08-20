const { gql } = require('apollo-server');
// The GraphQL schema
const typeDefs = gql`
type Curso{
    titulo: String
    tecnologia: String
}  
type Tecnologia{
  tecnologia: String
}
type Query {
    obtenerCursos: [Curso]
    obtenerTecnologia: [Tecnologia]
  }
  
`;
module.exports = typeDefs;