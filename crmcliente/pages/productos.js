import Head from 'next/head'
import Layout from '../components/Layout'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Producto from '../components/Producto';

const Productos = () => {

//Consultar los productos
  const OBTENER_PRODUCTOS = gql`
  query obtenerProductos{
      obtenerProductos{
      id
      nombre
      precio
      existencia
    }
  }`;
    const router = useRouter();
    //Consulta de Apollo
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);
    //console.log(data);
    if (loading) return 'Cargando...';
  
    if (!data.obtenerProductos) {
      return router.push('/login');
    }
    return (
      <div>
        <Layout>
          <h1 className='text-2xl text-gray-800 font-light'>
            Productos
          </h1>
          <Link href="/nuevoproducto" >
            <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nuevo Producto</a>
            </Link>
          <table className='table-auto shadow-md mt-10 w-full w-lg'>
            <thead className='bg-gray-800'>
              <tr className='text-white'>
                <th className='w-1/5 py-2'>Nombre</th>
                <th className='w-1/5 py-2'>Precio</th>
                <th className='w-1/5 py-2'>Existencia</th>
                <th className='w-1/5 py-2'>Eliminar</th>
                <th className='w-1/5 py-2'>Editar</th>
              </tr>
  
            </thead>
            <tbody className='bg-white'>
              {data.obtenerProductos.map(producto => (
                <Producto
                  key={producto.id}
                  producto={producto}
                />
  
              ))}
  
            </tbody>
  
          </table>
        </Layout>
      </div >
    )
  }

export default Productos;