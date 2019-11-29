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
      axios.get("http://localhost:5000/rodar-sql/bancos").then(data => {
        setBancos(data.data);
      });
    };

  useState(() => {
    buscarBancos();
  }, []);

  const onSubmit = values => {
    if (values) {
        console.log(values)
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
            <FormGroup>
              <Label>SQL a ser executado</Label>
              <Field
                name={`sql`}
                type="textarea"
                placeholder="Cole aqui o SQL"
              >
                {({ input }) => <Input {...input} rows="5"/>}
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
