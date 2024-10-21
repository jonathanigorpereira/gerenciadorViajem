import PropTypes from 'prop-types';

export const USER = Object.freeze({

    idEmpregado: PropTypes.number,
    idCargo: PropTypes.number,
    nomeEmpregado: "",
    email: "",
    senha: "",
    googleId: PropTypes.string,
    ativo: PropTypes.bool,
    createdAt: PropTypes.instanceOf(Date),
    updatedAt: PropTypes.instanceOf(Date),

    cargo: {
        idCargo: PropTypes.number,
        nomeCargo: PropTypes.string,
    }

});