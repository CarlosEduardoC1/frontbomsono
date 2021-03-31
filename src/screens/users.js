// import logo from './logo.svg';
import '../App.css';
import { Pane, Text, Button, TextInput, SelectField, Table } from 'evergreen-ui'
import MenuItem from '../App';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { _salvaUser, _listarUsuarios, _verificaEmail, _deletaUser } from '../config/users/services.users';
import IconDelete from '@material-ui/icons/Delete';
import ModalDeletar from '../constants/modal/modaldeletar';
import { _getUserType } from '../config/users/services.users';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';


function App() {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [tipo, setTipo] = useState("");
    const [erroSelect, setErroSelect] = useState("");
    const [validation, setValidation] = useState(false);
    const [erroNome, setErroNome] = useState(false);
    const [erroMail, setErroMail] = useState(false);
    const [erroSenha, setErroSenha] = useState(false);
    const [users, setUsers] = useState([]);
    const [modal, setModal] = useState();
    const [userType, setUserType] = useState();
    const [snack, setSnack] = useState(false);
    const [mensagem, setMensagem] = useState();
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [backDrop, setbackDrop] = useState(false);
    const [msg, setMsg] = useState('Salvando usuário!');

    useEffect(() => {
        getUsers();
    }, [])


    async function getUsers() {
        let user = await _getUserType();
        setUserType(user);
        const response = await _listarUsuarios({ page: 1, limit: 5000 })
            .then((result) => setUsers(result.data['rows']))
            .catch(() => executaSnack("Ocorreu um erro!"));
    }

    function closeSnack() {
        setSnack(false);
    }

    function executaSnack(params) {

        setSnack(true);
        setTipoMensagem("error");
        setMensagem(params);
    }


    async function handleSaveUser() {
        setbackDrop(true);
        if (!tipo) {
            setValidation(true);
            setErroSelect("Os campos em vermelho precisam ser informados!");
            setbackDrop(false);
        }
        if (!nome) {
            setErroNome(true);
            setErroSelect("Os campos em vermelho precisam ser informados!");
            setbackDrop(false);
        }
        if (!email) {
            setErroMail(true);
            setErroSelect("Os campos em vermelho precisam ser informados!");
            setbackDrop(false);
        }
        if (!senha) {
            setErroSenha(true);
            setErroSelect("Os campos em vermelho precisam ser informados!");
            setbackDrop(false);
        }
        else {
            let dadosJsonUser = {
                password: senha,
                email: email,
                type: tipo,
                name: nome
            };
            const response = await _verificaEmail({ email: email })
                .then(async (result) => {
                    if (result) {
                        setbackDrop(false);
                        executaSnack("Este e-mail já está cadastrado!")
                    } else {
                        const res = await _salvaUser(dadosJsonUser)
                            .then(result => {
                                setbackDrop(false);
                                executaSnack(result.data.msg);
                                getUsers();
                            })
                            .catch(() => {
                                setbackDrop(false);
                                executaSnack("Ocorreu um erro!")
                            })
                    }
                })
                .catch(() => {
                    setbackDrop(false);
                    executaSnack("Ocorreu um erro!")
                })
        }

    }

    function closeModal() {
        setModal();
    }


    async function deletaUser(id) {
        setModal();
        const response = await _deletaUser(id).
            then(() => {
                executaSnack("Usuário deletado com sucesso!");
                getUsers();
            })
            .catch(async (e) => {
                let close = closeModal;
                let deleta = closeModal;
                let modalDeletar = await ModalDeletar(id, "Ops!!", e, close, deleta);
                setModal(modalDeletar);
            })
    }

    async function handleDelete(id) {
        const tipoUser = await _getUserType();
        console.log(tipoUser);
        if (tipoUser != "AD") {
            let close = closeModal;
            let deleta = closeModal;
            let modalDeletar = await ModalDeletar(id, "Ops!!", "Você não tem privilégios de administrador. Faça login como administrador para poder excluir este produto!", close, deleta);
            setModal(modalDeletar);
        } else {
            let close = closeModal;
            let deleta = deletaUser;
            let modalDeletar = await ModalDeletar(id, "Deletar Usuário", "Ao clicar em confirmar você irá deletar este usuário permanentemente.", close, deleta);
            setModal(modalDeletar);
        }
    }

    let history = useHistory();

    if (userType != "AD") {
        return (
            <div>
                <MenuItem />
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={snack} autoHideDuration={6000} onClose={closeSnack} message={mensagem}></Snackbar>
                <Pane
                    height="80%"
                    width="90%"
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    border="default"
                    backgroundColor="white"
                    elevation={2}
                    padding={20}
                    paddingRight={20}
                    marginLeft={100}
                    marginTop={20}
                    flexWrap="wrap"
                    flexDirection="column"
                >
                    <Text fontWeight="bold">Faça login como Administrador para cadastrar um novo usuário</Text>
                </Pane>
                <Pane
                    height="80%"
                    width="90%"
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    border="default"
                    backgroundColor="white"
                    elevation={2}
                    padding={20}
                    paddingRight={20}
                    marginLeft={100}
                    marginTop={20}
                    flexWrap="wrap"
                    flexDirection="column">
                    <Text fontWeight="bold">Usuários do sistema</Text>
                    <Table style={{ width: '100%', marginTop: '25px' }}>
                        <Table.Head>
                            <Table.TextHeaderCell>Nome</Table.TextHeaderCell>
                            <Table.TextHeaderCell>E-mail</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Tipo</Table.TextHeaderCell>
                            <Table.TextHeaderCell>#</Table.TextHeaderCell>
                        </Table.Head>
                        <Table.Body height={240}>
                            {users.map(e => {
                                let tipo = '';
                                if (e.type == 'AD') tipo = 'Administrador';
                                if (e.type == 'OP') tipo = 'Operador';
                                return (
                                    <Table.Row key={e.id} isSelectable>
                                        <Table.TextCell>{e.name}</Table.TextCell>
                                        <Table.TextCell>{e.email}</Table.TextCell>
                                        <Table.TextCell>{tipo}</Table.TextCell>
                                        <Table.TextCell><Button appearance="minimal" intent='danger' onClick={() => handleDelete(e.id)}><IconDelete /></Button></Table.TextCell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </Pane>
                { modal}
            </div >
        )
    } else {
        return (
            <div>
                <MenuItem />
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={snack} autoHideDuration={6000} onClose={closeSnack} message={mensagem}></Snackbar>
                <Pane
                    height="80%"
                    width="90%"
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    border="default"
                    backgroundColor="white"
                    elevation={2}
                    padding={20}
                    paddingRight={20}
                    marginLeft={100}
                    marginTop={20}
                    flexWrap="wrap"
                    flexDirection="column"
                >
                    <Text fontWeight="bold">Cadastre um novo usuário</Text>
                    <div>
                        <TextInput
                            isInvalid={erroNome}
                            required
                            id="Nome"
                            placeholder="Nome do usuário"
                            color="black"
                            margin={10}
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                        >

                        </TextInput>
                        <TextInput
                            isInvalid={erroMail}
                            required
                            id="mail"
                            placeholder="E-mail"
                            type="email"
                            margin={10}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        >

                        </TextInput>
                        <TextInput
                            isInvalid={erroSenha}
                            type="password"
                            required
                            id="Desc"
                            placeholder="Senha"
                            margin={10}
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                        >

                        </TextInput>
                        <SelectField
                            width="25%"
                            validationMessage={erroSelect}
                            isInvalid={validation}
                            value={tipo}
                            marginLeft={10}
                            onChange={event => setTipo(event.target.value)}>
                            <option value="" selected>TIPO DE USUÁRIO</option>
                            <option value="AD" selected>ADMINISTRADOR</option>
                            <option value="OP">OPERADOR</option>
                        </SelectField>
                    </div>
                    <div style={{ fisplay: 'flex', marginLeft: 10 }}>
                        <Button appearance="primary" intent="danger" marginRight={5} onClick={() => history.push(`/home`)}>CANCELAR</Button>
                        <Button appearance="primary" intent="success" marginLeft={5} onClick={handleSaveUser}>SALVAR</Button>
                    </div>
                </Pane>
                <Pane
                    height="80%"
                    width="90%"
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    border="default"
                    backgroundColor="white"
                    elevation={2}
                    padding={20}
                    paddingRight={20}
                    marginLeft={100}
                    marginTop={20}
                    flexWrap="wrap"
                    flexDirection="column">
                    <Text fontWeight="bold">Usuários do sistema</Text>
                    <Table style={{ width: '100%', marginTop: '25px' }}>
                        <Table.Head>
                            <Table.TextHeaderCell>Nome</Table.TextHeaderCell>
                            <Table.TextHeaderCell>E-mail</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Tipo</Table.TextHeaderCell>
                            <Table.TextHeaderCell>#</Table.TextHeaderCell>
                        </Table.Head>
                        <Table.Body height={240}>
                            {users.map(e => {
                                let tipo = '';
                                if (e.type == 'AD') tipo = 'Administrador';
                                if (e.type == 'OP') tipo = 'Operador';
                                return (
                                    <Table.Row key={e.id} isSelectable>
                                        <Table.TextCell>{e.name}</Table.TextCell>
                                        <Table.TextCell>{e.email}</Table.TextCell>
                                        <Table.TextCell>{tipo}</Table.TextCell>
                                        <Table.TextCell><Button appearance="minimal" intent='danger' onClick={() => handleDelete(e.id)}><IconDelete /></Button></Table.TextCell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </Pane>
                {modal}
            </div>
        );
    }
}

export default App;
