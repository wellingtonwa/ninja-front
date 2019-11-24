import React, { useState, useEffect } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import Dropzone from "react-dropzone";
import socketIOClient from "socket.io-client";
import axios from 'axios';

import { Form, FormGroup, Label, Input, InputGroup, Button } from 'reactstrap';

const getHeader = () => ({
  headers: {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*"}
});

const RestoreWetransfer = (props) => {

  const [arquivo, setArquivo] = useState();
  const [mensagem, setMensagem] = useState([]);
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const getMensagem = msg => {
    setMensagem([msg, ...mensagem]);
    console.log(mensagem);
  }
  
  const init = () => {
    const socket = socketIOClient("http://localhost:5000");
    socket.on('db restore', (msg) => {
      getMensagem(msg);
    });
  }

  useEffect(() => {
    init();
  }, [])

  const onSubmit = async values => {
    var formData = new FormData(); 
    if (values) {
      console.log(JSON.stringify(values,0,2));      
      formData.append('nome-banco', values['nome-banco']);      
      formData.append('link', values.link);      
      console.log(formData.keys().next())
      console.log(formData.values().next())
      console.log(formData.keys().next())
      console.log(formData.values().next())
      console.log(values)
      axios.post("http://localhost:5000/restaurar-link", values, getHeader()).then();
    }
  }

  return <>
      {arquivo && <p>Arquivo selecionado: <strong>{arquivo}</strong></p>}
    <FinalForm
      onSubmit={onSubmit}
      initialValues={{}}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
                <Label>
                    Nome do Banco de Dados
                </Label>
                <Field name={`nome-banco`} type="text" placeholder="Nome do Banco de Dados">
                    {({input}) => (
                    <Input {...input}/>
                    )}
                </Field>
            </FormGroup>
            <FormGroup>
                <Label>
                    Link do WeTransfer
                </Label>
                <Field name={`link`} type="text" placeholder="Cole aqui o link do WeTransfer">
                    {({input}) => (
                        <Input {...input}/>
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
      <p>Mensagems:</p>
      {mensagem && mensagem.map(msg => <p>{msg}</p>)}
  </>

}

export default RestoreWetransfer;