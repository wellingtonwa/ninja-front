import React, { useState, useEffect } from "react";
import axios from "axios";
import LogAtividades from "../../components/LogAtividades";
import { Button } from "reactstrap";

const getHeader = () => ({
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
});

const STATES = {
    INITIAL: 'initial',
    DIRTY: 'dirty',
    CLEAN: 'clean',
    SUCCESS: 'success',
};

const LimparPastaUpload = props => {
  const [retorno, setRetorno] = useState({});
  const [state, setState] = useState("initial");
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {setState(retorno.state)}, [retorno]);

  useEffect(() => {
    if(state === STATES.SUCCESS) setInitialValues({'sql': retorno.sql});
  }, [state]);

  const buscarArquivos = () => {
    axios
      .get("http://localhost:5000/limpar-pasta")
      .then(data => {
        setRetorno(data.data);
      });
  };

  const limparPasta = () => {
      axios
      .post("http://localhost:5000/limpar-pasta")
      .then(data => {
          setRetorno(data.data);
      });
      buscarArquivos();
  };

  return (
    <>  
        <div className="row mb-2">
            <div className="col">
                {state === STATES.DIRTY && <Button className="mr-2" onClick={limparPasta}>Apagar Arquivos</Button>}
                {state === STATES.CLEAN && <span className="mr-2">a pasta esta limpa</span>}
                <Button onClick={buscarArquivos}>Buscar Informações</Button>
            </div>
        </div>
        <div className="row mb-2">
            <div className="col">
                <select className="custom-select mr-sm-2" size="5">
                    {retorno && retorno.arquivos && retorno.arquivos.map((it, idx) => <option key={`folder${idx}`}>{it  }</option>)}
                </select>
            </div>
        </div>
        <LogAtividades />
    </>
  );
};

export default LimparPastaUpload;
