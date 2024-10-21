export const TRAVEL = Object.freeze({

    idViagem: 0,
    idEmpregado: 0,
    unidadeFederativaId: 0,
    idMunicipioSaida: 0,
    idStatusViagem: 0,

    DataInicioViagem: new Date(),
    DataTerminoViagem: new Date(),

    NomeStatusViagem: "",
    NomeMunicipioSaida: "",
    NomeUnidadeFederativaSaida: "",

    usuario: {
        idEmpregado: 0,
        nomeEmpregado: "",
    },

    destinos: [
        {
            idViagem: 0,
            idUnidadeFederativa: 0,
            idMunicipioDestino: 0,
            DataDestinoViagem: new Date(),

            municipio: {
                idMunicipio: 0,
                NomeMunicipio: ""
            },

            unidadeFederativa: {
                idUnidadeFederativa: 0,
                NomeUnidadeFederativa: ""
            },

            custos: [
                {
                    idTipoCusto: 0,
                    NomeTipoCusto: "",
                    ValorCustoDestino: "0"
                }
            ]
        }
    ]
});
