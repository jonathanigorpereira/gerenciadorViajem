export default function PageHeader({ title = "Título da Página", titleRow = false, children }) {
    return (
        <div className="row mb-3 align-items-center">
            <div className={titleRow ? "col-12 col-lg-4 mb-3 mb-lg-0" : "col-4"}>
                <h4 className="mb-0 pb-0  text-nowrap">{title}</h4>
            </div>
            <div className="col ms-auto">
                {children}
            </div>
        </div>
    )
}