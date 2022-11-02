import React from "react";
import Layout from "../components/Layout";

const Login = () =>{
    return (
        <>
        <Layout>
        <h1 className="text-center text-2xl text-white font-ligth">Login</h1>
        <div className="flex justify-center mt-5">
            <div className="w-full max-w-sm">
                <form
                className="bg-white rounted shadow-md px-8 pt-6 pb-8 mb-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre" >
                            Email
                        </label>
                        <input 
                        />
                    </div>
                </form>
            </div>
        </div>
        </Layout>
        </>
    );
}
export default Login;