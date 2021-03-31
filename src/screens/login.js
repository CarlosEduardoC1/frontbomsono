// import logo from './logo.svg';
import '../App.css';
import { TextInput, Button, toaster } from 'evergreen-ui'
import { useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Icon from '@material-ui/icons/Send';
import IconPerson from '@material-ui/icons/Person';
import IconSenha from '@material-ui/icons/VpnKey';
import { _logar } from '../config/users/services.users';
import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

function App() {
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [erroMail, setErroMail] = useState('');
    const [erroSenha, setErroSenha] = useState('');
    const [token, setToken] = useState('false');
    const [name, setName] = useState(0);
    const [tipo, setTipo] = useState();
    const [snack, setSnack] = useState(false);
    const [mensagem, setMensagem] = useState();
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [backDrop, setbackDrop] = useState(false);

    useEffect(() => {
        if (token !== 'false') {
            sessionStorage.setItem('user/Email', email);
            sessionStorage.setItem('user/Token', token);
            sessionStorage.setItem('user/Name', name);
            sessionStorage.setItem('user/Type', tipo);
            window.location.reload();
        }
    }, [token, name, tipo]);


    function closeSnack() {
        setSnack(false);
    }
    let history = useHistory();

    function handleClose() {
        setbackDrop(false);
    }

    function executaSnack(params) {

        setSnack(true);
        setTipoMensagem("error");
        setMensagem(params);
        setbackDrop(false);
    }
    async function handleLogin() {
        setbackDrop(true);
        let login = {
            email: email,
            password: senha
        }
        const response = await _logar(login)
            .then(res => {
                setName(res.data.name);
                setToken(res.data.token);
                setTipo(res.data.tipo);
                history.push(`/home`);
            })
            .catch((err) => {
                console.log(err);
                executaSnack("Ocorreu um erro!")
            });
    }

    if (backDrop) {
        return (
            <Backdrop style={{ backgroundColor: 'white', flexDirection: "column" }} open={backDrop}>
                <CircularProgress color="primary" />
            </Backdrop>
        );
    } else {
        return (
            <div>
                <Container style={{ background: 'linear-gradient(180deg, #A6B1BB 60%, #fff 90%)', height: '100vh' }} maxWidth="xl">
                    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={snack} autoHideDuration={6000} onClose={closeSnack} message={mensagem}></Snackbar>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center", padding: 200, flexDirection: 'column' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <IconPerson color="action" />
                            <TextInput
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                id="nomeCliente"
                                placeholder="E-mail"
                                color="black"
                                type="email"
                                borderColor="black"
                                borderRadius={5}
                                margin={10}>

                            </TextInput>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <IconSenha color="action" />
                            <TextInput
                                required
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                id="nomeCliente"
                                placeholder="Senha"
                                color="black"
                                type="password"
                                borderColor="black"
                                borderRadius={5}
                                margin={10}>

                            </TextInput>
                        </div>
                        <Button marginLeft={20} width={275} justifyContent="center" iconBefore={<Icon />} onClick={() => handleLogin()}>
                            ACESSAR
                </Button>
                    </div>
                </Container>
            </div>
        );
    }
}

export default App;
