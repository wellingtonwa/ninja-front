import React, { useState, useEffect } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, FormGroup, Button, Input, Label } from "reactstrap";
import axios from "axios";

const Configs = props => {
  const [dados, setDados] = useState();
  const [valores, setValores] = useState({});

  const atualizarDados = () => {
    axios.get("http://localhost:5000/configs/dados").then(data => {
      setDados(data.data);
      let test = {};
      data.data.map(att => {
        test[att.property] = att.value;
      });
      setValores(test);
    });
  };

  useEffect(() => {
    atualizarDados();
  }, []);

  const onSubmit = async values => {
    axios.post("http://localhost:5000/configs", values).then(data => {
        atualizarDados();
    });
  };

  return (
    <>
      <FinalForm
        onSubmit={onSubmit}
        initialValues={valores}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <FormGroup>
              {dados &&
                dados.map((attr, idx) => (
                  <>
                    <Label>{attr.property}</Label>
                    <Field
                      name={attr.property}
                      type="text"
                      placeholder={attr.property}
                      value={attr.value}
                    >
                      {({ input }) => <Input {...input} />}
                    </Field>
                  </>
                ))}
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
    </>
  );
};

export default Configs;
