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
    INITIAL: 'initial',
  CLEAN: 'clean',
  SUCCESS: 'success',
};

const LimparPastaUpload = props => {
  const [retorno, setRetorno] = useState({});
  const [state, setState] = useState("initial");
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {setState(retorno.state)}, [retorno]);

  useEffect(() => {LimparPastaUpload()}, []);

  useEffect(() => {
    if(state == STATES.SUCCESS) setInitialValues({'sql': retorno.sql});
  }, [state]);

  const buscarArquivos = () => {
    axios
      .get("http://localhost:5000/limpar-pasta-upload/obter-lista-arquivos")
      .then(data => {
        setRetorno(data.data);
      });
  };

  const onSubmit = values => {
    if (values && !values.authCode) {
      console.log(values);
      axios.post("http://localhost:5000/rodar-sql", values, getHeader());
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
                
              </>
            )}
            {state === STATES.SUCCESS && <FormGroup>
              <Label>SQL a ser executado</Label>
              <Field name={`sql`} type="textarea" placeholder="Cole aqui o SQL">
                {({ input }) => <Input {...input} rows="5" />}
              </Field>
            </FormGroup>
            }
            
            <FormGroup className="buttons">
              <Button type="submit" disabled={submitting || pristine}>
                Apagar Arquivos
              </Button>
              {state !== STATES.CLEAN && <Button type="button" onClick={() => buscarArquivos()} className="ml-2">Atualizar Lista de Arquivos</Button>}
            </FormGroup>
          </Form>
        )}
      />
      <LogAtividades />
    </>
  );
};

export default LimparPastaUpload;
