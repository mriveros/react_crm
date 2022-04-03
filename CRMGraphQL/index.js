const { ApolloServer, gql } = require('apollo-server');

//servidor
const server = new ApolloServer;

//Arrancar Servidor
server.listen().then(({ url }) => {
    console.log('Servidor listo en la URL ${url}')
})