const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const Pedido = require('../models/Pedido');
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
    obtenerUsuario: async (_, { }, ctx) => {
      return ctx;
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
      if (cliente.vendedor.toString() != ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }
      return cliente;
    },
    obtenerPedidos: async () => {
      try {
        const pedidos = await Pedido.find({});
        return pedidos;
      } catch (error) {

      }
    },
    obtenerPedidosVendedor: async (_, { }, ctx) => {
      try {
        const pedidos = await Pedido.find({ vendedor: ctx.usuario.id.toString() });
        return pedidos;
      } catch (error) {
        throw new error('Error');
      }
    },
    obtenerPedido: async (_, { id }, ctx) => {
      //verificar si el pedido existe o no
      const pedido = await Pedido.findById(id);
      if (!pedido) {
        throw new Error('Pedido no encontrado');
      }
      //solo quien lo creo
      if (pedido.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }
      //retornar el resultado
      return pedido;
    },
    obtenerPedidoEstado: async (_, { estado }, ctx) => {
      const pedidos = await Pedido.find({ vendedor: ctx.usuario.id, estado: estado });
      return pedidos;
    },
    mejoresClientes: async () => {
      const clientes = await Pedido.aggregate([
        { $match: { estado: "COMPLETADO" } },
        {
          $group: {
            _id: "$cliente",
            total: { $sum: '$total' }
          }
        },
        {
          $lookup: {
            from: 'clientes',
            localField: '_id',
            foreignField: '_id',
            as: "cliente"
          }
        },
        {
          $sort: {
            total: -1
          }
        }
      ]);
      return clientes;
    },
    mejoresVendedores: async () => {
      const vendedores = await Pedido.aggregate([
        { $match: { estado: "COMPLETADO" } },
        {
          $group: {
            _id: "$vendedor",
            total: { $sum: '$total' }
          }
        },
        {
          $lookup: {
            from: 'usuarios',
            localField: '_id',
            foreignField: '_id',
            as: "vendedor"
          }
        }, {
          $limit: 3
        },
        {
          $sort: {
            total: -1
          }
        }
      ]);
      return vendedores;
    },
    buscarProducto: async (_, { texto }) => {
      const productos = await Producto.find({ $text: { $search: texto } }).limit(10)
      return productos;
    }
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
      let cliente = await Cliente.findById(id)
      if (!cliente) {
        throw new error('Ese cliente no existe');
      }
      //verificar si es que vendedor el que edita
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
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
      if (cliente.vendedor.toString() != ctx.usuario.id) {
        throw new error('No tienes las credenciales');
      }
      //eliminar
      await Cliente.findOneAndDelete({ _id: id });
      return "Cliente Eliminado";
    },
    nuevoPedido: async (_, { input }, ctx) => {

      const { cliente } = input;

      //verificar si el cliente existe
      let clienteExiste = await Cliente.findById(cliente);
      if (!clienteExiste) {
        throw new error('Cliente no existe');
      }
      //verificar si el cliente es del vendedor
      if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }
      //revisar que el stock esta disponible
      for await (const articulo of input.pedido) {
        const { id } = articulo;
        const producto = await Producto.findById(id);
        if (articulo.cantidad > producto.existencia) {
          throw new Error(`El articulo ${producto.nombre} excede la cantidad disponible`);
        } else {
          //restar cantidad disponible
          producto.existencia = producto.existencia - articulo.cantidad;
          await producto.save();
        }
      };
      //crear un nuevo pedido
      const nuevoPedido = new Pedido(input);
      //asignarle un vendedor
      nuevoPedido.vendedor = ctx.usuario.id;
      //guardar en la base de datos
      const resultado = await nuevoPedido.save();
      return resultado;
    },
    actualizarPedido: async (_, { id, input }, ctx) => {
      const { cliente } = input;
      //verificar si el pedido existe
      const existePedido = await Pedido.findById(id);
      if (!existePedido) {
        throw new Error("El Pedido no existe");
      }
      //verificar si el cliente existe
      const existeCliente = await Cliente.findById(cliente);
      if (!existeCliente) {
        throw new Error("El Cliente no existe");
      }
      //Si el cliente y pedido pertenece al vendedor
      if (existeCliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }

      //revisar el stock 
      for await (const articulo of input.pedido) {
        const { id } = articulo;
        const producto = await Producto.findById(id);
        if (articulo.cantidad > producto.existencia) {
          throw new Error(`El articulo ${producto.nombre} excede la cantidad disponible`);
        } else {
          //restar cantidad disponible
          producto.existencia = producto.existencia - articulo.cantidad;
          await producto.save();
        }
      };
      //guardar el pedido
      const resultado = await Pedido.findOneAndUpdate({ _id: id }, input, { new: true });
      return resultado;

    },
    eliminarPedido: async (_, { id }, ctx) => {
      //revisar si el pedido existe
      let pedido = await Pedido.findById(id);

      if (!pedido) {
        throw new error('Pedido no existe');
      }
      //verificar si es que vendedor el que elimina
      if (pedido.vendedor.toString() != ctx.usuario.id) {
        throw new error('No tienes las credenciales');
      }
      //eliminar
      await Pedido.findOneAndDelete({ _id: id });
      return "Pedido Eliminado";
    },

  }

}
module.exports = resolvers;