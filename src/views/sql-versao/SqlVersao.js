import React, { useState, useEffect } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import axios from "axios";
import LogAtividades from "../../components/LogAtividades";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

const getHeader = () => ({
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
});

const STATES = {
  NEED_AUTH:"authorize",
  SUCCESS:"success",
};

const SqlVersao = props => {
  const [bancos, setBancos] = useState([]);
  const [retorno, setRetorno] = useState({});
  const [state, setState] = useState("inicial");
  const [initialValues, setInitialValues] = useState({});

  const buscarBancos = () => {
    axios.get("http://localhost:5000/rodar-sql/bancos").then(data => {
      setBancos(data.data);
    });
  };

  useState(() => {
    buscarBancos();
  }, []);

  useEffect(() => {
    setState(retorno.state);
    if(retorno && retorno.state === STATES.SUCCESS) setInitialValues({'sql': retorno.sql});
  }, [retorno]);

  useEffect(() => {
    if(state === STATES.SUCCESS) setInitialValues({'sql': retorno.sql});
  }, [state, retorno]);

  const buscarSqlDaVersao = () => {
    axios
      .get("http://localhost:5000/sql-versao/obter-sql-versao")
      .then(data => {
        setRetorno(data.data);
      });
  };

  const onSubmit = values => {
    if (values && !values.authCode) {
      console.log(values);
      axios.post("http://localhost:5000/sql-versao/rodar-sql-da-versao", values, getHeader());
    } else if (values && values.authCode) {
      axios.post("http://localhost:5000/sql-versao/codigo-autorizacao", values, getHeader())
      .then(data => {
        setRetorno(data.data);
      });
    }
  };

  return (
    <>
      <FinalForm  
        onSubmit={onSubmit}
        initialValues = {initialValues}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <Form onSubmit={handleSubmit}>
            {state === STATES.NEED_AUTH && (
              <>
                <FormGroup>
                  <Label>Código de autorização do Google:</Label>
                  <Field
                    name={`authCode`}
                    type="text"
                  >
                    {({ input }) => <Input {...input} rows="5" 
                    placeholder="O Ninja precisa do código de autorização para continuar"/>}
                  </Field>
                </FormGroup>
                <span>Para obter o código de autorização <a href={retorno.authUrl} target="_blank" rel="noopener noreferrer">clique aqui</a></span>
              </>
            )}
            {state === STATES.SUCCESS && <FormGroup>
              <FormGroup>
                <Label>Banco:</Label>
                <Field
                  name={`nome_banco`}
                  type="select"
                  placeholder="Nome do Banco de Dados"
                >
                  {({ input }) => <Input {...input}>    
                      <option value={undefined}>Selecione um banco</option>
                      {bancos && bancos.map((dado, idx) => <option value={dado.dbname} key={`key${idx}`}>{dado.dbname}</option>)}
                      </Input>
                  }
                </Field>
              </FormGroup>
              <Label>SQL a ser executado</Label>
              <Field name={`sql`} type="textarea" placeholder="Cole aqui o SQL">
                {({ input }) => <Input {...input} rows="5" />}
              </Field>
            </FormGroup>
            }
            
            <FormGroup className="buttons">
              <Button type="submit" disabled={submitting}>
                Enviar
              </Button>
              <Button
                type="button"
                onClick={form.reset}
                disabled={submitting}
                className="ml-2"
              >
                Limpar
              </Button>
              {state !== STATES.NEED_AUTH && <Button type="button" onClick={() =>{ 
                buscarSqlDaVersao();
                form.reset();
              }} className="ml-2">Buscar SQL da Versão</Button>}
            </FormGroup>
          </Form>
        )}
      />
      <LogAtividades />
    </>
  );
};

export default SqlVersao;
