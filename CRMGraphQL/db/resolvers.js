const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const crearToken = (usuario, secreta, expiresIn) => {

  console.log(usuario);
  const { id, email, nombre, apellido } = usuario;
  return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn })
}
// A map of functions which return data for the schema.
//RESOLVERS
const resolvers = {
  Query: {
    obtenerUsuario: async (_, { token }) => {
      const usuarioId = await jwt.verify(token, process.env.SECRETA);
      return usuarioId;
    },
    obtenerProductos: async () => {
      try {
        const productos = await Producto.find({});
        return productos;
      } catch (error) {
        console.log(error);

      }
    },
    obtenerProducto: async (_, { id }) => {
      //revisar si el producto eiste
      const producto = await Producto.findById(id);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      return producto;
    },
    obtenerClientes: async () => {
      try {
        const clientes = await Cliente.find({});
        return clientes;
      } catch (error) {
        console.log(error);

      }
    },
    obtenerClientesVendedor: async (_, { }, ctx) => {
      try {
        console.log("###################################");
        console.log(ctx.usuario.id.toString());
        const clientes = await Cliente.find({ vendedor: ctx.usuario.id.toString() });
        return clientes;
      } catch (error) {
        console.log(error);

      }
    },
    obtenerCliente: async (_, { id }, ctx) => {
      //revisar si el cliente existe
      const cliente = await Cliente.findById(id);
      if (!cliente) {
        throw new Error('Cliente no encontrado');
      }
      //Quien lo creo puede verlo
      if (cliente.vendedor.ToString() != ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }
      return cliente;
    },
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
      //crear el token
      return {
        token: crearToken(existeUsuario, process.env.SECRETA, '24h')
      }
    },
    nuevoProducto: async (_, { input }) => {
      try {
        const producto = new Producto(input);
        //almacenar en la base de datos
        const resultado = await producto.save();
        return resultado;

      } catch (error) {
        console.log(error);
      }
    },
    actualizarProducto: async (_, { id, input }) => {
      //revisar si el producto eiste
      let producto = await Producto.findById(id);
      if (!producto) {
        throw new error('Producto no encontrado');
      }
      //guardar en la base de datos
      producto = await Producto.findOneAndUpdate({ _id: id }, input, { new: true });
      return producto;

    },
    eliminarProducto: async (_, { id }) => {
      //revisar si el producto eiste
      let producto = await Producto.findById(id);
      if (!producto) {
        throw new error('Producto no encontrado');
      }
      //eliminar
      try {
        await Producto.findOneAndDelete({ _id: id });
        return "Producto Eliminado";
      } catch (error) {
        throw new error('Producto no eliminado');
      }

    },
    nuevoCliente: async (_, { input }, ctx) => {
      //verificar si el cliente ya esta registrado
      const { email } = input;
      //console.log(input.email);
      const cliente = await Cliente.findOne({ email });
      if (cliente) {
        throw new error('El cliente ya esta registrado');
      }
      const nuevoCliente = new Cliente(input);
      //asignar un vendedor
      nuevoCliente.vendedor = ctx.usuario.id;
      //guardar en la base de datos
      try {
        const resultado = await nuevoCliente.save();
        return resultado;
      } catch (error) {
        console.log(error);

      }


    },
    actualizarCliente: async (_, { id, input }, ctx) => {
      //verificar si existe o no
      const cliente = await Cliente.findById(id)
      if (!cliente) {
        throw new error('Ese cliente no existe');
      }
      //verificar si es que vendedor el que edita
      if (cliente.vendedor.ToString() != ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }
      //guardar el cliente
      cliente = await Cliente.findOneAndUpdate({ _id: id }, input, { new: true });
      return cliente;
    },
    eliminarCliente: async (_, { id }, ctx) => {
      //revisar si el cliente existe
      let cliente = await Cliente.findById(id);
      if (!cliente) {
        throw new error('Cliente no existe');
      }

      //verificar si es que vendedor el que edita
      if (cliente.vendedor.ToString() != ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }

      //eliminar
      await Cliente.findOneAndDelete({ _id: id });
      return "Cliente Eliminado";
    }
  }

}
module.exports = resolvers;