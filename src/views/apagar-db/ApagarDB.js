import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form as FinalForm, Field } from "react-final-form";
import LogAtividades from "../../components/LogAtividades";
import DadosCaso from "../../components/DadosCaso";
import { Form, FormGroup, Label, Input, Button, Col } from "reactstrap";

const getHeader = () => ({
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
});

const REGEX_NUMEROCASO = /(?<=.*)[0-9]{5}$/g;

const initialState = { issue_number: [] };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

const ApagarDB = props => {
  const [bancos, setBancos] = useState([]);
  const [issueNumber, setIssueNumber] = useState([]);
  const [dadosCasos, setDadosCasos] = useState({});

  const buscarBancos = () => {
    axios.get("http://localhost:5000/rodar-sql/bancos").then(data => {
      setBancos(data.data);
      const casos = data.data
        .filter(item => item.dbname.match(REGEX_NUMEROCASO))
        .map(item => item.dbname.match(REGEX_NUMEROCASO)[0]);
      setIssueNumber(casos);
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
  
  const functionInit = () => {
    buscarBancos();
  };

  useEffect(() => {
    functionInit();
  }, []);

  const onSubmit = async values => {
    if (values) {
      var regex = /(?<=db-).*$/;
      var sanitized_values = { nome_banco: {} }
      for(var x in values.nome_banco) {
        sanitized_values.nome_banco[x.match(regex)] = true;
      }
      axios
        .post("http://localhost:5000/apagar-db/apagar", sanitized_values, getHeader())
        .then(dados => buscarBancos());
    }
  };

  const bancosFields = lista => {
    return (
      lista &&
      lista.map((dado, idx) => (
        <Col sm="4">
          <FormGroup>
            <div className="card w-100">
              <div className="card-body">
                <Field name={`nome_banco[db-${dado.dbname}]`} type="checkbox">
                  {({ input }) => (
                    <>
                      <h5 className="card-title">
                        <Label style={{justifyContent: "left"}}>
                          <Input
                            {...input}
                            id={`${idx}`}
                            key={`key${idx}`}
                            value={dado.dbname}
                          />
                          {dado.dbname}
                        </Label>
                      </h5>
                      <h6 className="card-subtitle mb-2">
                        <DadosCaso nomeBanco={dado.dbname} dadosCasos={dadosCasos}/>
                      </h6>
                    </>
                  )}
                </Field>
              </div>
            </div>
          </FormGroup>
        </Col>
      ))
    );
  };

  return (
    <>
      <FinalForm
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <Form onSubmit={handleSubmit} inline>
            {bancosFields(bancos)}
            <Col sm="12">
              <FormGroup>
                <Button type="submit" disabled={submitting || pristine}>
                  Enviar
                </Button>
                <Button
                  type="button"
                  onClick={form.reset}
                  disabled={submitting || pristine}
                  className="ml-2"
                >
                  Limpar
                </Button>
              </FormGroup>
            </Col>
          </Form>
        )}
      />
      <LogAtividades {...props} />
    </>
  );
};

export default ApagarDB;
