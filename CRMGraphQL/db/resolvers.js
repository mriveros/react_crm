const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
require('dotenv').config({ path: 'variables.env' });

const crearToken = (usuario, secreta, expiracion) => {
  console.log(usuario);

}
// A map of functions which return data for the schema.
//RESOLVERS
const resolvers = {
  Query: {
    obtenerCurso: () => "algo"
  },
  Mutation: {
    nuevoUsuario: async (_, { input }) => {

      const { email, password } = input;

      //revisar si el usuario ya esta registrado
      const existeUsuario = await Usuario.findOne({ email });
      console.log(existeUsuario);
      if (existeUsuario) {
        throw new Error('El usuario ya esta registrado.');
      }
      //hash de password
      const salt = await bcryptjs.genSaltSync(10);
      input.password = await bcryptjs.hash(password, salt);

      //guardar en la base de datos
      try {
        const usuario = new Usuario(input);
        usuario.save();
        return usuario;
      } catch (error) {
        console.log(error);
      }

    },
    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;
      //si el usuario existe
      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error('El usuario no existe.');
      }

      //Revisar si el password es correcto
      const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
      if (!passwordCorrecto) {
        throw new Error('El password es Incorrecto.');
      }

      return {
        token: crearToken(existeUsuario, process.env.SECRETA, '24h')
      }


      //crear el token

    }
  }

}
module.exports = resolvers;