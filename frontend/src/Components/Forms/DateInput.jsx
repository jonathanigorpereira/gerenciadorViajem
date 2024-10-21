import React, { useState } from 'react';

export const DateInput = ({ value, onChange }) => {

    // Função para formatar a data como "YYYY-MM-DD"
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam de 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Função para tratar o evento de mudança da data
    const handleDateChange = (event) => {
        const dateString = event.target.value; // Captura a string "YYYY-MM-DD"
        const [year, month, day] = dateString.split('-'); // Desconstrói a string

        // Cria um novo objeto Date sem considerar o fuso horário
        const newDate = new Date(year, month - 1, day); // Mês é 0-indexado
        onChange(newDate); // Atualiza o estado no componente pai
    };

    return (
        <input
            type="date"
            className="form-control"
            value={formatDate(typeof (value) === 'string' ? new Date(value) : value)} // Converte a data para o formato esperado
            onChange={handleDateChange} // Converte o valor do input de volta para um objeto Date
        />
    );
};