import React from 'react';
import { Modal, ModalBody, Button, ModalHeader, ModalFooter } from 'reactstrap';

const ConfirmModal = props => {
  return <Modal isOpen={props.isOpen} toggle={props.toggle}>
  <ModalHeader toggle={props.toggle}>{props && props.title}</ModalHeader>
  <ModalBody>
    {props && props.content}
  </ModalBody>
  <ModalFooter>
    <Button color="primary" onClick={props.confirmAction}>Sim</Button>{' '}
    <Button color="secondary" onClick={props.toggle}>Não</Button>
  </ModalFooter>
</Modal>;
}

export default ConfirmModal;
