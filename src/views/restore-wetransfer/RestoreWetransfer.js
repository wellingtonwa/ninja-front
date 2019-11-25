import React from "react";
import { Form as FinalForm, Field } from "react-final-form";
import axios from "axios";
import LogAtividades from '../../components/LogAtividades';

import { Form, FormGroup, Label, Input, Button } from "reactstrap";

const getHeader = () => ({
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
});

const RestoreWetransfer = props => {

  const onSubmit = values => {
    if (values) {
      axios
        .post("http://localhost:5000/restaurar-link", values, getHeader());
    }
  };

  return (
    <>
      <FinalForm
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Nome do Banco de Dados</Label>
              <Field
                name={`nome-banco`}
                type="text"
                placeholder="Nome do Banco de Dados"
              >
                {({ input }) => <Input {...input} />}
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
        <LogAtividades/>
    </>
  );
};

export default RestoreWetransfer;
