import React from 'react';
import { useRouter } from 'next/router';


const EditarCliente = () => {
    //obtener el if actual
    const router = useRouter();
    const { query: { id } } = router;
    console.log(query);

    return (<h1>Desde Editar</h1>);
}

export default EditarCliente;