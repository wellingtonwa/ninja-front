import React, { useState } from "react";
import axios from "axios";
import { Form as FinalForm, Field } from "react-final-form";
import LogAtividades from "../../components/LogAtividades";
import { Form, FormGroup, Label, Input, Button, Col } from "reactstrap";

const getHeader = () => ({
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
});

const REGEX_NUMEROCASO = /(?<=calima_caso_)[0-9]{5}/g;

const ApagarDB = props => {
    const [bancos, setBancos] = useState([]);
  
    const buscarBancos = () => {
      axios.get("http://localhost:5000/rodar-sql/bancos").then(data => {
        setBancos(data.data);
      });
    };

    const getLink = (nomeBanco) => {
      var link = 'https://mantis.projetusti.com.br/view.php?id=';
      if (nomeBanco.match(REGEX_NUMEROCASO)) {
        return <a href={`${link}${nomeBanco.match(REGEX_NUMEROCASO)}`} rel="noopener noreferrer" target="_blank" title="Link para o caso">^</a>
      }
    } 

    useState(() => {
        buscarBancos();
    }, []);

    const onSubmit = async values => {
        if (values) {
          axios.post("http://localhost:5000/apagar-db/apagar", values, getHeader())
          .then(dados => buscarBancos());
        }
      };

    return (
        <>
          <FinalForm
            onSubmit={onSubmit}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <Form onSubmit={handleSubmit} inline>
                {bancos && bancos.map((dado, idx) => <Col sm="3">
                <FormGroup check >
                  <Field
                    name={`nome_banco[${dado.dbname}]`}
                    type="checkbox">  
                    {({ input }) => <>
                        <Label check>
                          <Input {...input} id={`${idx}`} key={`key${idx}`} value={dado.dbname}/> {dado.dbname} {getLink(dado.dbname)}
                        </Label>
                      </> }
                  </Field>
                </FormGroup>
                </Col>)}
                <Col sm="12">
                  <FormGroup>
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
                </Col>
              </Form>
            )}/>
          <LogAtividades  {...props} />
        </>
    );

};

export default ApagarDB;