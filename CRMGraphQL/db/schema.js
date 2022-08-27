const { gql } = require('apollo-server');
// The GraphQL schema
const typeDefs = gql`
  type Usuario{
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String 
  }
  type Query{
    obtenerCurso: String
  }
  type Mutation{
    nuevoUsuario: Usuario
  }
`;
module.exports = typeDefs;