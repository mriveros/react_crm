import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

const NUEVOPRODUCTO = gql`
mutation nuevoProducto($input: ProductoInput){
    nuevoProducto(input: $input){
      nombre
      precio
      existencia
    }
  }
`;

const OBTENER_PRODUCTOS = gql`
query obtenerProductos{
  obtenerProductos{
    id
    nombre
    precio
    existencia
  }
}
      `;
const NuevoProducto = () => {

    //router
    const router = useRouter();

    //State mensaje de alerta 
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation para crear nuevos productos
    const [nuevoProducto] = useMutation(NUEVOPRODUCTO, {
        update(cache, { data: { nuevoProducto } }) {
            console.log(nuevoProducto);
            //Obtener el objeto de cache que deseamos actualizar
            const { obtenerProducto } = cache.readQuery({ query: OBTENER_PRODUCTOS })
            //Reescribimos el cache (el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProducto: [...obtenerProductos, nuevoProducto]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            precio: '',
            existencia: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required('El nombre del Producto es Obligatorio'),
            precio: Yup.string()
                .required('El precio del Producto es Obligatorio'),
            existencia: Yup.string()
                .required('El campo existencia es obligatorio')

        }),
        onSubmit: async valores => {
            const { nombre, precio, existencia } = valores;
            //console.log(valores);
            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            precio,
                            existencia
                        }
                    }
                });
                guardarMensaje(`Se creo correctamente el Producto: ${data.nuevoProducto.nombre}`);
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
                router.push('/');
            } catch (error) {
                console.log('se ha generado un error');
                console.log(error);
                guardarMensaje(error.message.replace('GraphQL error: ', ''));
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
            }
        }
    })
    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }
    return (<Layout>
        {mensaje && mostrarMensaje()}
        <h1 className='text-2xl text-gray-800 font-light'>Nuevo Producto</h1>
        <div className='flex justify-center mt-5'>
            <div className='w-full max-w-lg'>
                <form className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                    onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre" >
                            Nombre
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                            id="nombre"
                            type="text"
                            placeholder="Nombre Producto"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.nombre}
                        />
                    </div>
                    {formik.touched.nombre && formik.errors.nombre ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.nombre}</p>
                        </div>
                    ) : null}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio" >
                            Precio
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                            id="precio"
                            type="text"
                            placeholder="Precio del Producto"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.precio}
                        />
                    </div>
                    {formik.touched.precio && formik.errors.precio ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.precio}</p>
                        </div>
                    ) : null}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia" >
                            Existencia
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                            id="existencia"
                            type="text"
                            placeholder="Existencia"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.existencia}
                        />
                    </div>
                    {formik.touched.existencia && formik.errors.existencia ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.existencia}</p>
                        </div>
                    ) : null}
                    

                    <input type="submit"
                        className='bg-gray-800 w-full mt-5 p-2  text-white uppercase font-bold hover:bg-gray-900' value="Registrar Producto" />

                </form>

            </div>

        </div>
    </Layout>)
}

export default NuevoProducto;