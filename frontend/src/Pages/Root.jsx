import { Outlet } from "react-router-dom";
import Header from "../App/Header";
import Footer from "../App/Footer";

export default function Root() {
    return (
        <>
            <Header />
            <div className="container mt-3 mt-lg-5">
                <Outlet />
            </div>
            <Footer />
        </>
    )
}