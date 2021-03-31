// import logo from './logo.svg';
import '../App.css';
import { Pane, Text, Table, Button } from 'evergreen-ui'
import Estoque from './estoque';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { _listarProdutos, _deletarProduto } from '../config/produtos/services.produtos';
import moment from 'moment';
import { Grid, TextField } from '@material-ui/core';
import IconSearch from '@material-ui/icons/Search';
import ModalDeletar from '../constants/modal/modaldeletar';
import IconDelete from '@material-ui/icons/Delete';
import { _getUserType } from '../config/users/services.users';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';



function App() {

    const [estoque, setEstoque] = useState([]);
    const [filtroGrupo, setFiltroGrupo] = useState('');
    const [filtroNome, setFiltroNome] = useState('');
    const [modal, setModal] = useState();
    const [snack, setSnack] = useState(false);
    const [mensagem, setMensagem] = useState();
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [backDrop, setbackDrop] = useState(false);
    const [msg, setMsg] = useState('Procurando produtos...');


    useEffect(() => {
        getProdutos();
        setbackDrop(true);
    }, [filtroGrupo, filtroNome])

    let history = useHistory();

    async function getProdutos() {
        const response = await _listarProdutos({ page: 1, limit: 5000, grupo: filtroGrupo, name: filtroNome })
            .then(result => {
                setbackDrop(false);
                setEstoque(result.data['rows']);
            })
            .catch(() => {
                setbackDrop(false);
                executaSnack("Ocorreu um erro!")
            });
    }

    function closeModal() {
        setModal();
    }

    function closeSnack() {
        setSnack(false);
    }

    function executaSnack(params) {

        setSnack(true);
        setTipoMensagem("error");
        setMensagem(params);
    }

    async function deleteProduto(id) {
        setModal();
        setbackDrop(true);
        setMsg("Deletando produto...");
        const response = await _deletarProduto(id).
            then(() => {
                setbackDrop(false);
                executaSnack("Produto deletado com sucesso!");
                getProdutos();
            })
            .catch(() => {
                setbackDrop(false);
                executaSnack("Ocorreu um erro!")
            });
    }

    async function handleDelete(id) {

        const tipoUsuario = await _getUserType();
        console.log(tipoUsuario);
        if (tipoUsuario === 'AD') {
            let close = closeModal;
            let deleta = deleteProduto;
            let modalDeletar = await ModalDeletar(id, "Deletar Produo", "Ao clicar em confirmar você irá deletar este produto permanentemente.", close, deleta);
            setModal(modalDeletar);
        } else {
            let close = closeModal;
            let deleta = closeModal;
            let modalDeletar = await ModalDeletar(id, "Ops!!", "Você não tem privilégios de administrador. Faça login como administrador para poder excluir este produto!", close, deleta);
            setModal(modalDeletar);
        }
    }

    if (backDrop) {
        return (
            <Backdrop style={{ backgroundColor: 'white', flexDirection: "column" }} open={backDrop}>
                <CircularProgress color="primary" />
                <Typography>{msg}</Typography>
            </Backdrop>
        );
    } else {
        return (
            <div>
                <Estoque />
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={snack} autoHideDuration={6000} onClose={closeSnack} message={mensagem}></Snackbar>
                <Pane
                    height="80%"
                    width="90%"
                    display="flex"
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
                    <Text marginBottom={20} fontWeight="bold">Estoque atual</Text>
                    <div style={{ padding: 20 }}>
                        <Grid container spacing={3} direction="row">
                            <Grid item xs={3} sm={6} direction="row">
                                <TextField
                                    fullWidth
                                    label="Nome"
                                    variant="standard"
                                    value={filtroNome}
                                    autoFocus={true}
                                    onChange={e => setFiltroNome(e.target.value)}
                                />

                            </Grid>
                            <Grid item xs={3} sm={5}>
                                <TextField
                                    fullWidth
                                    label="Grupo"
                                    variant="standard"
                                    value={filtroGrupo}
                                    onChange={e => setFiltroGrupo(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={3} sm={1} style={{ marginTop: '25px' }}>
                                <IconSearch />
                            </Grid>
                        </Grid>
                    </div>
                    <div>
                        <Table>
                            <Table.Head>
                                <Table.TextHeaderCell>Nome</Table.TextHeaderCell>
                                <Table.TextHeaderCell>Quantidade</Table.TextHeaderCell>
                                <Table.TextHeaderCell>Preço de venda</Table.TextHeaderCell>
                                <Table.TextHeaderCell>Preço de compra</Table.TextHeaderCell>
                                <Table.TextHeaderCell>Descrição</Table.TextHeaderCell>
                                <Table.TextHeaderCell>Grupo</Table.TextHeaderCell>
                                <Table.TextHeaderCell>Criado em</Table.TextHeaderCell>
                                <Table.TextHeaderCell>#</Table.TextHeaderCell>
                            </Table.Head>
                            <Table.Body height={240}>
                                {estoque.map(e => {
                                    let criadoEm = moment(e.createdAt).format("DD/MM/YYYY HH:mm:ss");
                                    return (
                                        <Table.Row key={e.id} isSelectable>
                                            <Table.TextCell>{e.name}</Table.TextCell>
                                            <Table.TextCell>{e.quantidade}</Table.TextCell>
                                            <Table.TextCell>{e.pven}</Table.TextCell>
                                            <Table.TextCell>{e.pcomp}</Table.TextCell>
                                            <Table.TextCell>{e.descricao}</Table.TextCell>
                                            <Table.TextCell>{e.grupo}</Table.TextCell>
                                            <Table.TextCell>{criadoEm}</Table.TextCell>
                                            <Table.TextCell><Button appearance="minimal" intent='danger' onClick={() => handleDelete(e.id)}><IconDelete /></Button></Table.TextCell>
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </div>
                </Pane>
                {modal}
            </div>
        );
    }
}

export default App;
