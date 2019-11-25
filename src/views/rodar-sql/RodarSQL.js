import React, { useState } from "react";
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

const RodarSQL = props => {
  const [bancos, setBancos] = useState([]);
  
    const buscarBancos = () => {
      axios.get("http://localhost:5000/rodar-sql").then(data => {
        setBancos(data.data);
      });
    };

  useState(() => {
    buscarBancos();
  }, []);

  const onSubmit = values => {
    if (values) {
      axios.post("http://localhost:5000/rodar-sql", values, getHeader());
    }
  };

  return (
    <>
      <FinalForm
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Banco:</Label>
              <Field
                name={`nome-banco`}
                type="select"
                placeholder="Nome do Banco de Dados"
              >
                {({ input }) => <Input {...input} >
                    {console.log(bancos)}
                    {bancos && bancos.map((val, idx) => <select key={'key'+idx} value={val.dbname}>{val.dbname}</select>)}
                    </Input>}
              </Field>
            </FormGroup>
            <FormGroup>
              <Label>Link do WeTransfer</Label>
              <Field
                name={`link`}
                type="text"
                placeholder="Cole aqui o link do WeTransfer"
              >
                {({ input }) => <Input {...input} />}
              </Field>
            </FormGroup>
            <FormGroup className="buttons">
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
          </Form>
        )}
      />
      <LogAtividades />
    </>
  );
};

export default RodarSQL;
