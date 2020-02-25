import React, { useState, useEffect } from "react";
import axios from "axios";
import LogAtividades from "../../components/LogAtividades";
import DadosCaso from "../../components/DadosCaso";
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

  const buscarBancos = () => {
    axios.get("http://localhost:5000/rodar-sql/bancos").then(data => {
      setBancos(data.data);
      const casos = data.data
        .filter(item => item.dbname.match(REGEX_NUMEROCASO))
        .map(item => item.dbname.match(REGEX_NUMEROCASO)[0]);
      buscarDadosCasos(casos);
    });
  };

  const buscarDadosCasos = casos => {
    axios
      .post("http://localhost:5000/mantis", { issue_number: casos })
      .then(data => {
        setDadosCasos(data.data);
      });
  };
  
  function functionInit() {
    buscarBancos();
  };

  useEffect(() => {
    functionInit();
  }, []);

  const apagarBanco = async values => {
    if (values) {
      var sanitized_values = { nome_banco: {} }
      sanitized_values.nome_banco[values] = true;
      axios
        .post("http://localhost:5000/apagar-db/apagar", sanitized_values, getHeader())
        .then(dados => buscarBancos());
    }
  };

  const getIssueStateColor = nomeBanco => {
    const numeroDoCaso = nomeBanco.match(REGEX_NUMEROCASO)[0];
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
                      <Button className="mt-1" onClick={apagarBanco.bind(null,  dado.dbname)}>Apagar</Button>
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
      <Form inline>
        {bancosFields(bancos)}
      </Form>
      <LogAtividades {...props} />
    </>
  );
};

export default ApagarDB;
