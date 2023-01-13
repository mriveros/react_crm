import React from 'react'
const Cliente = ({ cliente }) => {
    const { nombre, apellido, empresa, email, id } = cliente;
    //elimina un cliente
    const confirmarEliminarCliente = id => {
        console.log('eliminando', id);
    }
    return (

        <tr>
            <td className='border px-4 py-2'>{nombre} {apellido}</td>
            <td className='border px-4 py-2'>{empresa} </td>
            <td className='border px-4 py-2'>{email} </td>
            <td className='border px-4 py-2'>
                <button
                    type='button'
                    className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-cold'
                    onClick={() => {
                        confirmarEliminarCliente(id);
                    }}>
                    Eliminar
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                </button>
            </td>
        </tr>
    );
}

export default Cliente;