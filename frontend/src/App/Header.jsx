import { IconBriefcase2, IconBuildingCommunity, IconHome, IconMap, IconMapPin, IconPlaneTilt, IconReport, IconUsers } from "@tabler/icons-react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../Contexts/UserContext";

export default function Header() {

    const user = useContext(UserContext);

    return (
        <nav className="navbar navbar-expand-lg" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    Gerenciador de Viagens
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <NavLink to={"/"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <IconHome />
                                Início
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to={"/viagens"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <IconPlaneTilt />
                                Viagens
                            </NavLink>
                        </li>

                        {
                            (user?.cargo?.idCargo == 1) &&
                            <>

                                <li className="nav-item">
                                    <NavLink to={"/cargos"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                        <IconBriefcase2 />
                                        Cargos
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink to={"/usuarios"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                        <IconUsers />
                                        Usuários
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink to={"/unidades-federativas"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                        <IconMap />
                                        Unidades Federativas
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink to={"/cidades"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                        <IconMapPin />
                                        Cidades
                                    </NavLink>
                                </li>

                            </>

                        }




                    </ul>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle py-0" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <div className="d-flex flex-column justify-content-center pe-2">
                                    <span className="position-relative fs-6 fw-bold" style={{ fontSize: "14px" }}>{user?.nomeEmpregado || "UserName"}</span>
                                    <small className="position-relative" style={{ lineHeight: "14px", fontSize: "13px" }}>{user?.email || "Email"}</small>
                                </div>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" onClick={() => { localStorage.removeItem("authorization"); window.location.href = "/login"; }}>Sair</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div >
        </nav >

    );
}