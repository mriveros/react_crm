import React, { Children } from "react";

const Layout = ({ Children }) => {

    return (
        <>
            <h1>Layout</h1>
            {Children}
        </>);
}
export default Layout;