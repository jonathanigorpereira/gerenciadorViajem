import { useEffect, useState } from "react";
import { IconBriefcase2, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { DeleteJob, GetJobs } from "../../Services/Jobs";
import Spinner from "../../Components/Spinner";
import PageHeader from "../../Components/Header";
import { Link } from "react-router-dom";
import Sweetalert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const Swal = withReactContent(Sweetalert2);

export default function Jobs_IndexPage() {


    const [jobs, setJobs] = useState([]);
    const [jobID, setJobID] = useState(null);

    const [importingJobs, setImportingJobs] = useState(false);
    const [errorOnImport, setErrorOnImport] = useState();

    useEffect(() => { getJobs(); }, []);

    async function getJobs() {
        setImportingJobs(true);
        setErrorOnImport(null);

        try {
            const result = await GetJobs();
            setJobs(result);
        } catch (error) {
            setErrorOnImport(error?.response?.data?.message || error.message);
        }

        setImportingJobs(false);
    }


    async function deleteJob(id) {

        Swal.fire({
            title: 'Excluir Cargo',
            text: `Tem certeza que deseja excluir esse cargo?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {

                try {

                    await DeleteJob(id);
                    Swal.fire('Cargo Excluído', 'O cargo foi excluído com êxito.', 'success');
                    getJobs();
                }
                catch (error) {
                    const message = error?.response?.data?.message || error.message;
                    Swal.fire({
                        title: 'Ocorreu um Erro',
                        text: message,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Fechar',
                    });
                }


            }
        });

    }

    return (
        <>
            <PageHeader title="Cargos">

                <div className="row justify-content-end">
                    <div className="col-auto">
                        <Link className="btn btn-primary" to={"/cargos/novo"}>
                            <IconPlus stroke={1} />
                            Novo Cargo
                        </Link>
                    </div>
                </div>


            </PageHeader>

            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-body">
                            {
                                importingJobs ? <Spinner /> :
                                    errorOnImport ?
                                        <>
                                            <h6 className="mb-0">Erro:</h6>
                                            <p className="mb-0">{errorOnImport}</p>
                                        </>
                                        :
                                        <div className="table-responsive-lg">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" className="small text-muted text-uppercase">Cargo</th>
                                                        <th scope="col" className="small text-muted text-uppercase text-center">Status</th>
                                                        <th scope="col" />
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        jobs.map(job =>
                                                            <tr key={job.idCargo} job-id={job.idCargo}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <IconBriefcase2 stroke={1} size={38} />
                                                                        <div className="position-relative d-flex flex-column ms-2">
                                                                            <Link to={`/cargos/editar/${job.idCargo}`}>
                                                                                <span className="d-inline-block">{job.nomeCargo}</span>
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td className="text-center">
                                                                    {job.ativo ? "Ativo" : "Inativo"}
                                                                </td>

                                                                <td className="text-end">
                                                                    <div className="dropdown">
                                                                        <button className="btn btn-sm dropdown-toggle px-3" type="button" data-bs-toggle="dropdown" />
                                                                        <ul className="dropdown-menu dropdown-menu-end">
                                                                            <li>
                                                                                <Link className="dropdown-item" to={`/cargos/editar/${job.idCargo}`}>
                                                                                    <IconPencil className="icon me-2" stroke={1} size={18} style={{ marginTop: "-4px" }} />
                                                                                    Editar
                                                                                </Link>
                                                                            </li>
                                                                            <li>
                                                                                <a className="dropdown-item" onClick={() => deleteJob(job.idCargo)}>
                                                                                    <IconTrash className="icon me-2" stroke={1} size={18} style={{ marginTop: "-4px" }} />
                                                                                    Excluir
                                                                                </a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}