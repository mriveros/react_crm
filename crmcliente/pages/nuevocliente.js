import React from 'react'
import Layout from '../components/Layout';
const NuevoCliente = () => {
    return (<Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Nuevo Cliente</h1>
        <div className='flex justify-center mt-5'>
            <div className='w-full max-w-lg'>
                <form className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email" >
                            Email
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email Usuario"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                    </div>

                </form>

            </div>

        </div>
    </Layout>)
}

export default NuevoCliente;