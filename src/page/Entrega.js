import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Entrega.css';

function Entrega() {
  // Estado para os campos de formulário
  const [id, setId] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [status, setStatus] = useState('');
  const [entregas, setEntregas] = useState([]); // Inicializa como array vazio

  // Busca as entregas ao carregar o componente
  useEffect(() => {
    fetchEntregas();
  }, []);

  // Função para buscar entregas do backend
  const fetchEntregas = async () => {
    try {
      const response = await axios.get('https://f322-2804-7f0-6540-600f-1d00-d9b7-d6cb-da39.ngrok-free.app/api/entrega');
      console.log("Resposta do backend:", response.data); // Log para depuração
      if (Array.isArray(response.data)) {
        setEntregas(response.data); // Atualiza o estado apenas se for um array
      } else {
        console.error("Os dados recebidos não são um array:", response.data);
        setEntregas([]); // Define um array vazio como fallback
      }
    } catch (error) {
      console.error("Erro ao buscar entregas:", error);
      alert('Erro ao buscar entregas!');
    }
  };

  // Função para salvar ou atualizar uma entrega
  const handleSalvar = async () => {
    const entrega = {
      descricao,
      dataEntrega: dataEntrega,
      status,
    };

    console.log('Enviando para o backend:', entrega);

    try {
      if (id === null) {
        await axios.post('https://f322-2804-7f0-6540-600f-1d00-d9b7-d6cb-da39.ngrok-free.app/api/entrega', entrega);
        alert('Entrega salva com sucesso!');
      } else {
        await axios.put(`https://f322-2804-7f0-6540-600f-1d00-d9b7-d6cb-da39.ngrok-free.app/api/entrega/${id}`, entrega);
        alert('Entrega atualizada com sucesso!');
      }
      limparCampos();
      fetchEntregas(); // Atualiza a lista após salvar/atualizar
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar entrega!');
    }
  };

  // Função para editar uma entrega
  const handleEditar = (entrega) => {
    setId(entrega.id);
    setDescricao(entrega.descricao);
    setDataEntrega(entrega.dataEntrega);
    setStatus(entrega.status);
  };

  // Função para excluir uma entrega
  const handleExcluir = async (id) => {
    try {
      await axios.delete(`https://f322-2804-7f0-6540-600f-1d00-d9b7-d6cb-da39.ngrok-free.app/api/entrega/${id}`);
      alert('Entrega excluída com sucesso!');
      fetchEntregas(); // Atualiza a lista após excluir
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir entrega!');
    }
  };

  // Função para limpar os campos do formulário
  const limparCampos = () => {
    setId(null);
    setDescricao('');
    setDataEntrega('');
    setStatus('');
  };

  return (
    <div className="entrega-container">
      <h2>Cadastro de Entregas</h2>

      {/* Formulário */}
      <div className="form-wrapper">
        <div className="form-grid">
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <input
            type="date"
            value={dataEntrega}
            onChange={(e) => setDataEntrega(e.target.value)}
          />
          <input
            type="text"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>

        {/* Botão de Salvar */}
        <div className="buttons">
          <button onClick={handleSalvar}>Salvar</button>
        </div>
      </div>

      {/* Tabela de Entregas */}
      <table className="tabela-entregas">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Data da Entrega</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(entregas) && entregas.length > 0 ? (
            entregas.map((e) => (
              <tr key={e.id}>
                <td>{e.descricao}</td>
                <td>{e.dataEntrega}</td>
                <td>{e.status}</td>
                <td>
                  <button onClick={() => handleEditar(e)}>Editar</button>{' '}
                  <button onClick={() => handleExcluir(e.id)}>Excluir</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhuma entrega encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Entrega;
