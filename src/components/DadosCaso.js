import React from 'react';

const REGEX_NUMEROCASO = /(?<=.*)[0-9]{5}$/g;

const getIssueStateColor = state => {
    switch (state) {
      case "resolvido":
        return 'green';
      case "aguardando code review":
        return 'red';
      case "desenvolvimento":
        return '#fff494';
      case "retorno":
        return 'darkviolet';
      case 'aguardando teste':
        return 'blue';
      default:
        return '#73818f';
    }
  }

const DadosCaso = props => {
    let dados = undefined;
    var link = "https://mantis.projetusti.com.br/view.php?id=";
    if (props.nomeBanco.match(REGEX_NUMEROCASO)) {
      const numeroDoCaso = props.nomeBanco.match(REGEX_NUMEROCASO)[0];
      const informacoes = props.dadosCasos[numeroDoCaso];
      if (informacoes) {
        dados = <>
          <a
          href={`${link}${numeroDoCaso}`}
          rel="noopener noreferrer"
          target="_blank"
          title="Link para o caso"
        >
          Resumo: {informacoes.resumo}
          </a><br/>
          <span style={{color: getIssueStateColor(informacoes.estado)}}>Estado: {informacoes.estado}</span><br/>
          <b>Aberto em:</b> {informacoes.dataEnvio}<br/>
          <b>Previsto para Versão:</b> {informacoes.versao}<br/>
          <b>Cliente:</b> {informacoes.codigoCliente}<br/>
          <b>Complexidade:</b> {informacoes.complexidade}<br/>
        </>;
      }
    }
    
    return dados === undefined ? <></> : dados;
  }

  export default DadosCaso