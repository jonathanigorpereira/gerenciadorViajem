export default function Spinner({ text = "Carregando..." }) {
    return (
        <div className="row align-items-center">
            <div className="col">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">{text}</span>
                </div>
                <label className="m-0 p-0">{text}</label>
            </div>
        </div>
    );
}