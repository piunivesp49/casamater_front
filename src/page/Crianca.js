import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Crianca.css';

function Crianca() {
  // Estado para os campos de formulário
  const [id, setId] = useState(null);
  const [atendido, setAtendido] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [criancas, setCriancas] = useState([]); // Inicializa como array vazio

  // Busca as crianças ao carregar o componente
  useEffect(() => {
    fetchCriancas();
  }, []);

  // Função para buscar crianças do backend
  const fetchCriancas = async () => {
    try {
      const response = await axios.get('https://539a-2804-7f0-6540-600f-1d00-d9b7-d6cb-da39.ngrok-free.app/api/crianca', {
        headers: {
          'Ngrok-Skip-Browser-Warning': 'true', // Ignora a página de aviso
        },
      });
      console.log("Resposta do backend:", response.data); // Log para depuração
      if (Array.isArray(response.data)) {
        setCriancas(response.data); // Atualiza o estado apenas se for um array
      } else {
        console.error("Os dados recebidos não são um array:", response.data);
        setCriancas([]); // Define um array vazio como fallback
      }
    } catch (error) {
      console.error("Erro ao buscar crianças:", error);
      alert('Erro ao buscar crianças!');
    }
  };

  // Função para formatar data no formato DD/MM/YYYY
  const formatarData = (data) => {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  // Função para salvar ou atualizar uma criança
  const handleSalvar = async () => {
    const crianca = {
      atendido,
      nascimento: formatarData(nascimento),
      logradouro,
      numero: parseInt(numero),
      bairro,
    };

    console.log('Enviando para o backend:', crianca);

    try {
      if (id === null) {
        await axios.post('https://539a-2804-7f0-6540-600f-1d00-d9b7-d6cb-da39.ngrok-free.app/api/crianca', crianca, {
          headers: {
            'Ngrok-Skip-Browser-Warning': 'true', // Ignora a página de aviso
          },
        });
        alert('Criança salva com sucesso!');
      } else {
        await axios.put(`https://539a-2804-7f0-6540-600f-1d00-d9b7-d6cb-da39.ngrok-free.app/api/crianca/${id}`, crianca, {
          headers: {
            'Ngrok-Skip-Browser-Warning': 'true', // Ignora a página de aviso
          },
        });
        alert('Criança atualizada com sucesso!');
      }
      limparCampos();
      fetchCriancas(); // Atualiza a lista após salvar/atualizar
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar criança!');
    }
  };

  // Função para editar uma criança
  const handleEditar = (crianca) => {
    setId(crianca.id);
    setAtendido(crianca.atendido);
    setNascimento(formatarDataParaInput(crianca.nascimento));
    setLogradouro(crianca.logradouro);
    setNumero(crianca.numero.toString());
    setBairro(crianca.bairro);
  };

  // Função para formatar data para o input de data (YYYY-MM-DD)
  const formatarDataParaInput = (data) => {
    const partes = data.split('/');
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  };

  // Função para excluir uma criança
  const handleExcluir = async (id) => {
    try {
      await axios.delete(`https://539a-2804-7f0-6540-600f-1d00-d9b7-d6cb-da39.ngrok-free.app/api/crianca/${id}`, {
        headers: {
          'Ngrok-Skip-Browser-Warning': 'true', // Ignora a página de aviso
        },
      });
      alert('Criança excluída com sucesso!');
      fetchCriancas(); // Atualiza a lista após excluir
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir criança!');
    }
  };

  // Função para importar dados
  const handleImportar = async () => {
    try {
      await axios.post('https://539a-2804-7f0-6540-600f-1d00-d9b7-d6cb-da39.ngrok-free.app/api/crianca/importar', {}, {
        headers: {
          'Ngrok-Skip-Browser-Warning': 'true', // Ignora a página de aviso
        },
      });
      alert('Importação realizada com sucesso!');
      fetchCriancas(); // Atualiza a lista após importar
    } catch (error) {
      console.error(error);
      alert('Erro ao importar!');
    }
  };

  // Função para limpar os campos do formulário
  const limparCampos = () => {
    setId(null);
    setAtendido('');
    setNascimento('');
    setLogradouro('');
    setNumero('');
    setBairro('');
  };

  return (
    <div className="crianca-container">
      <h2>Cadastro de Crianças</h2>

      {/* Formulário */}
      <div className="form-wrapper">
        <div className="form-grid">
          <input
            type="text"
            placeholder="Atendido"
            value={atendido}
            onChange={(e) => setAtendido(e.target.value)}
          />
          <input
            type="date"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
          />
          <input
            type="text"
            placeholder="Logradouro"
            value={logradouro}
            onChange={(e) => setLogradouro(e.target.value)}
          />
          <input
            type="number"
            placeholder="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          <input
            type="text"
            placeholder="Bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
        </div>

        {/* Botões de Salvar e Importar */}
        <div className="buttons">
          <button onClick={handleSalvar}>Salvar</button>
          <button onClick={handleImportar}>Importar</button>
        </div>
      </div>

      {/* Tabela de Crianças */}
      <table className="tabela-criancas">
        <thead>
          <tr>
            <th>Atendido</th>
            <th>Nascimento</th>
            <th>Logradouro</th>
            <th>Número</th>
            <th>Bairro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(criancas) && criancas.length > 0 ? (
            criancas.map((c) => (
              <tr key={c.id}>
                <td>{c.atendido || 'N/A'}</td>
                <td>{c.nascimento || 'N/A'}</td>
                <td>{c.logradouro || 'N/A'}</td>
                <td>{c.numero || 'N/A'}</td>
                <td>{c.bairro || 'N/A'}</td>
                <td>
                  <button onClick={() => handleEditar(c)}>Editar</button>{' '}
                  <button onClick={() => handleExcluir(c.id)}>Excluir</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Nenhuma criança encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Crianca;
