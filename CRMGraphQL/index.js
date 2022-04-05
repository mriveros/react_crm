const { ApolloServer, gql } = require('apollo-server');

const cursos = [
    {
        titulo: 'JavaScript Moderno Guía Definitiva Construye +10 Proyectos',
        tecnologia: 'JavaScript ES6',
    },
    {
        titulo: 'React – La Guía Completa: Hooks Context Redux MERN +15 Apps',
        tecnologia: 'React',
    },
    {
        titulo: 'Node.js – Bootcamp Desarrollo Web inc. MVC y REST API’s',
        tecnologia: 'Node.js'
    }, 
    {
        titulo: 'ReactJS Avanzado – FullStack React GraphQL y Apollo',
        tecnologia: 'React'
    }
];
// The GraphQL schema
const typeDefs = gql`
type Curso{
    titulo: String
    tecnologia: String
}  
type Query {
    obtenerCursos: Curso
  }
  
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    obtenerCursos: () => {cursos[0]},
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});