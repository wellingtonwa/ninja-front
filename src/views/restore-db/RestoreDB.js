import React, { useState } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import Dropzone from "react-dropzone";

import { Form, FormGroup, Button } from 'reactstrap';
import LogAtividades from '../../components/LogAtividades';

const RestoreDB = (props) => {

  const [arquivo, setArquivo] = useState();

  const onDropFiles = (acceptedFiles, props) => {
    if (props.input.onChange) {
      console.log(['acceptedFiles', acceptedFiles])
      props.input.onChange(acceptedFiles[0]);
      setArquivo(acceptedFiles[0].name);
    }
  }

  const onSubmit = async values => {
    var formData = new FormData(); 
    if (values.arquivo) {
      console.log(values.arquivo.name);
      formData.append("arquivo", values.arquivo, values.arquivo.name);
    }
    fetch("http://localhost:5000/restaurar", { method: "POST", 
    body: formData, 
    mode: 'no-cors' });
  }

  return <>
      {arquivo && <p>Arquivo selecionado: <strong>{arquivo}</strong></p>}
    <FinalForm
      onSubmit={onSubmit}
      initialValues={{}}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <FormGroup>
            <Field name={`arquivo`} type="file">
              {(props) => (
                  <Dropzone onDrop={acceptedFiles => onDropFiles(acceptedFiles, props)}>
                  {({getRootProps, getInputProps}) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()}/>
                        <p style={{width: '100%', border: '1px dashed black', height: 150}}>Arraste os arquivos aqui</p>
                      </div>
                    </section>
                  )}
                  </Dropzone>
              )}
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
              className="ml-2">
              Limpar
            </Button>
          </FormGroup>
        </Form>
      )}
      />
      <LogAtividades/>
  </>

}

export default RestoreDB;