import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout'
import { useQuery, gql, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';


const OBTENER_PRODUCTO = gql`query obtenerProducto($id:ID!){
    obtenerProducto(id: $id){
        nombre
        precio
        existencia
        }  
    }`;

const ACTUALIZAR_PRODUCTO = gql`mutation actualizarProducto($id: ID!, $input: ProductoInput){
    actualizarProducto(id: $id, input: $input){
            nombre
            existencia
            precio
        }
      }`;

const OBTENER_PRODUCTOS = gql`
      query obtenerProductos{
        obtenerProductos{
            nombre
            precio
            existencia
        }
      }
            `;

const EditarProducto = () => {
    //obtener el id actual
    const router = useRouter();
    const { query: { id } } = router;
    
    //consultar para obtener el producto
    const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });
    
    //Actualizar el producto
    //const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);
    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO, {
        update(cache, { data: { actualizarProducto } }) {
            // Actualizar Productos
            const { obtenerProductos } = cache.readQuery({
                query: OBTENER_PRODUCTOS
            });
           
            const productosActualizados = obtenerProductos.map(producto =>
                producto.id === id ? actualizarProducto : producto
            );
           
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: productosActualizados
                }
            });

            // Actualizar Producto Actual
            cache.writeQuery({
                query: OBTENER_PRODUCTO,
                variables: { id },
                data: {
                    obtenerProducto: actualizarProducto
                }
            });
        }
    });

    //Schema de validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string()
            .required('El nombre del Producto es Obligatorio'),
        precio: Yup.string()
            .required('El precio del Producto es Obligatorio'),
        existencia: Yup.string()
            .required('El campo existencia es obligatorio'),

    });

    if (loading) return 'Cargando...'
    //console.log(data.obtenerProducto);
    const { obtenerProducto } = data;
    //Modifica el producto en la base de datos
    const actualizarInfoProducto = async valores => {
        const { nombre, precio, existencia } = valores;
        try {
            const { data } = await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        precio,
                        existencia
                    }
                }
            });
            

            //Mostrar alerta
            Swal.fire(
                'Actualizado!',
                'El Producto se actualizó correctamente',
                'success'
            )
            //redireccionar
            router.push('/productos');

        } catch (error) {
            console.log("DATOS DEL ERROR");
            console.log(error);
        }

    }
    return (<Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Editar Producto</h1>
        <div className='flex justify-center mt-5'>
            <div className='w-full max-w-lg'>
                <Formik
                    validationSchema={schemaValidacion}
                    enableReinitialize
                    initialValues={obtenerProducto}
                    onSubmit={(valores) => {
                        actualizarInfoProducto(valores);

                    }
                    }
                >
                    {props => {

                        return (
                            <form className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                                onSubmit={props.handleSubmit}
                            >
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre" >
                                        Nombre
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                        id="nombre"
                                        type="text"
                                        placeholder="Nombre Procucto"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.nombre}
                                    />
                                </div>
                                {

                                    props.touched.nombre && props.errors.nombre ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.nombre}</p>
                                        </div>
                                    ) : null

                                }

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio" >
                                        Precio
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                        id="precio"
                                        type="text"
                                        placeholder="Precio Producto"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.precio}
                                    />
                                </div>
                                {
                                    props.touched.precio && props.errors.precio ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.precio}</p>
                                        </div>
                                    ) : null
                                }
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia" >
                                        Existencia
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                        id="existencia"
                                        type="text"
                                        placeholder="Existencia Producto"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.existencia}
                                    />
                                </div>
                                {
                                    props.touched.existencia && props.errors.existencia ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.existencia}</p>
                                        </div>
                                    ) : null
                                }

                                <input type="submit"
                                    className='bg-gray-800 w-full mt-5 p-2  text-white uppercase font-bold hover:bg-gray-900' value="Actualizar Producto" />

                            </form>
                        )
                    }
                    }
                </Formik>
            </div >

        </div >
    </Layout>);
}

export default EditarProducto;