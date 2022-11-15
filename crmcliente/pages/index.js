import Head from 'next/head'
import Layout from '../components/Layout'
import { gql, useQuery } from '@apollo/client'

const OBTENER_CLIENTES_USUARIO = gql`
query obtenerClientesVendedor{
  obtenerClientesVendedor{
    nombre
    apellido
    empresa
    email
  }
}
      `;
const Index = () => {

  //Consulta de Apollo
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

  console.log(data);
  console.log(loading);
  console.log(error);
  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>
          Clientes
        </h1>
      </Layout>
    </div>
  )

}
export default Index
