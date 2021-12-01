import React, { useState, useEffect } from "react";
import axios from "axios";
import LogAtividades from "../../components/LogAtividades";
import DadosCaso from "../../components/DadosCaso";
import ConfirmModal from "../../components/ConfirmModal";
import { Form, FormGroup, Label, Button, Col } from "reactstrap";

const getHeader = () => ({
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
});

const REGEX_NUMEROCASO = /(?<=.*)[0-9]{5}$/g;

const ApagarDB = props => {
  const [bancos, setBancos] = useState([]);
  const [dadosCasos, setDadosCasos] = useState({});
  const [versao, setVersao] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [bancoSelecionado, setBancoSelecionado] = useState({});

  const buscarBancos = () => {
    axios.get("http://localhost:5000/rodar-sql/bancos").then(data => {
      setBancos(data.data);
      const casos = data.data
        .filter(item => item.dbname.match(REGEX_NUMEROCASO))
        .map(item => item.dbname.match(REGEX_NUMEROCASO)[0]);
      buscarDadosCasos(casos);
    });

    axios.get("http://localhost:5000/versao")
    .then(versao => {
      setVersao(versao);
    });
  };

  const buscarDadosCasos = casos => {
    axios
      .post("http://localhost:5000/mantis", { issue_number: casos })
      .then(data => {
        setDadosCasos(data.data);
      });
  };

  const confirmDeleteToggle = async values => {
    setConfirmDeleteOpen(!confirmDeleteOpen);
  }

  function functionInit() {
    buscarBancos();
  };

  useEffect(() => {
    functionInit();
  }, []);

  const confirmarApagarBanco = async values => {
    if (values) {
      setBancoSelecionado(values);
      confirmDeleteToggle();
    }
  };

  const openFolder = (values) => {
      if (values && values.match(REGEX_NUMEROCASO)) {
          axios.post("http://localhost:5000/apagar-db/abrir-pasta", {numero_caso: values.match(REGEX_NUMEROCASO)[0]})
              .then(retorno => {
                  console.log(retorno.data.msg);
              });
      }
  };

  const apagarBanco = () => {
    if (bancoSelecionado) {
      var sanitized_values = { nome_banco: {} }
      sanitized_values.nome_banco[bancoSelecionado] = true;
      axios
        .post("http://localhost:5000/apagar-db/apagar", sanitized_values, getHeader())
        .then(dados => buscarBancos());
      confirmDeleteToggle();
    }
  };

  const getIssueStateColor = nomeBanco => {
    const match = nomeBanco.match(REGEX_NUMEROCASO);
    const numeroDoCaso = match && match[0];
    const informacoes = dadosCasos[numeroDoCaso];
    const state = informacoes && informacoes.estado;
    switch (state) {
      case "resolvido":
      case "fechado":
        return '#D4EFDF';
      case "aguardando code review":
        return '#F2D7D5';
      case "desenvolvimento":
        return '#F9E79F';
      case "retorno":
        return '#E8DAEF';
      case 'aguardando teste':
        return '#7FB3D5';
      case 'atribuído':
        return '#D6EAF8';
      default:
        return '#EBF5FB';
    }
  }

  const bancosFields = lista => {
    return (
      lista &&
      lista.map((dado, idx) => (
        <Col sm="4" key={idx}>
          <FormGroup>
            <div className="card w-100" style={{backgroundColor: getIssueStateColor(dado.dbname)}}>
              <div className="card-body">
                    <>
                      <h5 className="card-title">
                        <Label style={{justifyContent: "left"}}>
                          {dado.dbname}
                        </Label>
                      </h5>
                      <h6 className="card-subtitle mb-2">
                        <DadosCaso nomeBanco={dado.dbname} dadosCasos={dadosCasos}/>
                      </h6>
                      <Button className="mt-1 mr-1" onClick={confirmarApagarBanco.bind(null,  dado.dbname)}>Apagar</Button>
                      <Button className="mt-1" onClick={openFolder.bind(null,  dado.dbname)}>Abrir Pasta</Button>
                    </>
              </div>
            </div>
          </FormGroup>
        </Col>
      ))
    );
  };

  return (
    <>
      <ConfirmModal isOpen={confirmDeleteOpen} toggle={confirmDeleteToggle} confirmAction={apagarBanco}
      title="Confirmar exclusão"
      content={bancoSelecionado && `Deseja realmente apagar o banco ${bancoSelecionado}?`}/>
      <Form inline>
        {bancosFields(bancos)}
      </Form>
      <LogAtividades {...props} />
    </>
  );
};

export default ApagarDB;
