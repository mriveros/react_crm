

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    obtenerCurso: () => "algo"
  },
  Mutation: {
    nuevoUsuario: () => "Creando nuevo Usuario"
  }
}
module.exports = resolvers;