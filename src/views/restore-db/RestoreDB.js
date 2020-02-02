import React, { useState } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Link } from "react-router-dom";
import Dropzone from "react-dropzone";

import { Form, FormGroup, Button, Label, Input } from "reactstrap";
import LogAtividades from "../../components/LogAtividades";

const RestoreDB = props => {
  const [arquivo, setArquivo] = useState();

  const onDropFiles = (acceptedFiles, props) => {
    if (props.input.onChange) {
      props.input.onChange(acceptedFiles[0]);
      setArquivo(acceptedFiles[0].name);
    }
  };

  const onSubmit = async values => {
    var formData = new FormData();
    formData.append("informar_nome", values.informar_nome);
    formData.append("nome-banco", values['nome-banco']);
    if (values.arquivo) {
      formData.append("arquivo", values.arquivo, values.arquivo.name);
      
    }
    fetch("http://localhost:5000/restaurar", {
      method: "POST",
      body: formData,
      mode: "no-cors"
    });
  };

  return (
    <>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <Link className="nav-link active" to="/restore-file">
            Via Arquivo
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="restore-url">
            Via URL WeTransfer / TinyURL / DropBox
          </Link>
        </li>
      </ul>
      {arquivo && (
        <p>
          Arquivo selecionado: <strong>{arquivo}</strong>
        </p>
      )}
      <div className="tab-content">
        <div className="tab-pane show active">
          <FinalForm
            onSubmit={onSubmit}
            initialValues={{}}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <FormGroup>
                  <Field name={`arquivo`} type="file">
                    {props => (
                      <Dropzone
                        onDrop={acceptedFiles =>
                          onDropFiles(acceptedFiles, props)
                        }
                      >
                        {({ getRootProps, getInputProps }) => (
                          <section>
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <p
                                style={{
                                  width: "100%",
                                  border: "1px dashed black",
                                  height: 150
                                }}
                              >
                                Arraste os arquivos aqui
                              </p>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    )}
                  </Field>
                </FormGroup>
                <FormGroup>
                  <Field name={`informar_nome`} type="checkbox">
                  {({ input }) => (
                    <>
                      <Label>
                          <input
                            {...input}
                          />
                          Quero informar o nome do banco
                        </Label>
                    </>
                  )}
                  </Field>
                </FormGroup>
                {values.informar_nome && <FormGroup>
                    <Label>Nome do Banco de Dados</Label>
                    <Field
                      name={`nome-banco`}
                      type="text"
                      placeholder="Nome do Banco de Dados"
                    >
                      {({ input }) => <Input {...input} />}
                    </Field>
                  </FormGroup>
                  }
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
          <LogAtividades {...props} />
        </div>
      </div>
    </>
  );
};

export default RestoreDB;
