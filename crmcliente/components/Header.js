import React from 'react';
import { useQuery, gql } from '@apollo/client'

const OBTENER_USUARIO = gql`query obtenerUsuario(){
    obtenerUsuario(){
        id
        nombre
        apellido
    }
}`;

const Header = () => {
    return (
        <div className='flex justify-end'>
            <h1 className='mr-2'>Hola: Marcos</h1>
            <button type='button'>Cerrar Sesión</button>
        </div>
    );
}

export default Header;