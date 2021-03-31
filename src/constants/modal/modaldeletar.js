import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default function ModalDeletar(dados, title, content, close, deleta) {
    return (
        <Dialog maxWidth="xs" open={true} onClose={close} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="secondary">Desistir</Button>
                <Button onClick={() => deleta(dados)} color="primary" autoFocus>Confirmar</Button>
            </DialogActions>
        </Dialog>
    )
}