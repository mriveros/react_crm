import React from 'react';
import { useQuery, gql } from '@apollo/client'

const OBTENER_USUARIO = gql`query obtenerUsuario{
    obtenerUsuario{
        id
        nombre
        apellido
    }
}`;

const Header = () => {
    //query de apollo
    const { data, loading, error } = useQuery(OBTENER_USUARIO);
    console.log(loading);
    console.log(data);
    console.log(error);
    //proteger a no acceder a data antes de tener resultados
    if (loading) return null;

    const { nombre, apellido } = data.obtenerUsuario;

    return (
        <div className='flex justify-between mb-6'>
            <h1 className='mr-2'>Hola: {nombre} {apellido}</h1>
            <button className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md' type='button'>Cerrar Sesión</button>
        </div>
    );
}

export default Header;