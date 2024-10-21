import PageHeader from "../Components/Header";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <>
            <PageHeader title="Início" />

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Seja bem-vindo(a)!</h5>
                            <p className="card-text">
                                Para gerenciar suas viagens clique no botão abaixo ou acesse diretamente o item no menu superior.
                            </p>
                            <Link to={"/viagens"} className="btn btn-primary">
                                Gerenciar Viagens
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}