import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import { Outlet } from 'react-router-dom'

function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout
