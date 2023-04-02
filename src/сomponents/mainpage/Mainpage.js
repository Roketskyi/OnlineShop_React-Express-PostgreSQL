import { Outlet } from 'react-router-dom';

function Mainpage() {
    return (
        <>
        <main className="container">
            <Outlet />
        </main>
        </>
    )
}

export {Mainpage}