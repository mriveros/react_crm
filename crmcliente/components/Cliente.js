import React from 'react'
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';

//MUTATION ELIMINAR
const ELIMINAR_CLIENTE = gql`
    mutation eliminarCliente($id: ID!){
     eliminarCliente(id: $id)
    }`;

const Cliente = ({ cliente }) => {
    //mutation para eliminar cliente
    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE);

    const { nombre, apellido, empresa, email, id } = cliente;
    //elimina un cliente
    const confirmarEliminarCliente = id => {
        Swal.fire({
            title: 'Desea eliminar a este CLiente?',
            text: "Esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar'
        }).then(async (result) => {
            if (result.value) {

                try {
                    //eliminar por ID
                    const { data } = await eliminarCliente({
                        variables: { id: id }
                    });
                    console.log(data);

                    //mostrar la alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCliente,
                        'success'
                    )
                } catch (error) {
                    console.log(error);
                }


            }
        })
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                </button>
            </td>
        </tr>
    );
}

export default Cliente;