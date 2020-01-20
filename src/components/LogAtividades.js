import React, { useEffect, useReducer } from "react";
import { Button } from "reactstrap";

const initialState = { mensagem: [], carregado: false };

function reducer(state, action) {
  switch (action.type) {
    case "append":
      return {
        ...state,
        carregado: true,
        mensagem: [action.payload, ...state.mensagem]
      };
    case "clear":
      return {
        ...state,
        mensagem: ["Limpo!"]
      };
    default:
      throw new Error();
  }
}

const LogAtividades = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (props.socket && !state.carregado) {
      props.socket.on("db restore", msg => {
        dispatch({ type: "append", payload: msg });
      });
    }
  },[]);

  return (
    <div className="card">
      <div className="card-header">Mensagens</div>
      <div
        className="card-body"
        style={{ overflow: "scroll", height: "150px" }}
      >
        {state.mensagem &&
          state.mensagem.map((msg, idx) => <p key={`msg${idx}`}>{msg}</p>)}
      </div>
      <div className="card-footer">
        <Button onClick={() => dispatch({ type: "clear" })}>
          Limpar mensagens
        </Button>
      </div>
    </div>
  );
};

export default LogAtividades;
