

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    obtenerCurso: () => "algo"
  },
  Mutation: {
    nuevoUsuario: (_, { input }) => {
      console.log(input);
      return "Creando...";

    }
  }
}
module.exports = resolvers;