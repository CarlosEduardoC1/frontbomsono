// import logo from './logo.svg';
import '../App.css';
import { Pane, Text, Table, Button } from 'evergreen-ui'
import Estoque from './estoque';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Grid, TextField } from '@material-ui/core';
import IconSearch from '@material-ui/icons/Search';
import { _listarRetiradas } from '../config/logs/services.logs';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';



function App() {

    const [estoque, setEstoque] = useState([]);
    const [filtroGrupo, setFiltroGrupo] = useState('');
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroOperador, setFiltroOperador] = useState('');
    const [modal, setModal] = useState();
    const [snack, setSnack] = useState(false);
    const [mensagem, setMensagem] = useState();
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [backDrop, setbackDrop] = useState(false);
    const [msg, setMsg] = useState('Procurando retiradas...');

    useEffect(() => {
        getProdutos();
        setbackDrop(true);
    }, [filtroGrupo, filtroNome, filtroOperador])

    let history = useHistory();

    async function getProdutos() {
        const response = await _listarRetiradas({ page: 1, limit: 5000, produto: filtroGrupo, forma_pagamento: filtroNome, operador: filtroOperador })
            .then(result => {
                setbackDrop(false);
                setEstoque(result.data['rows'])
            })
            .catch(() => {
                setbackDrop(false);
                executaSnack("Ocorreu um erro!")
            });

    }

    function closeSnack() {
        setSnack(false);
    }

    function executaSnack(params) {

        setSnack(true);
        setTipoMensagem("error");
        setMensagem(params);
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
                    <Text marginBottom={20} fontWeight="bold">Histórico de retiradas</Text>
                    <div style={{ padding: 20 }}>
                        <Grid container spacing={3} direction="row">
                            <Grid item xs={3} sm={4} direction="row">
                                <TextField
                                    fullWidth
                                    label="Forma de pagamento"
                                    variant="standard"
                                    value={filtroNome}
                                    onChange={e => setFiltroNome(e.target.value)}
                                />

                            </Grid>
                            <Grid item xs={3} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Produto"
                                    variant="standard"
                                    value={filtroGrupo}
                                    onChange={e => setFiltroGrupo(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3}>
                                <TextField
                                    fullWidth
                                    label="Operador"
                                    variant="standard"
                                    value={filtroOperador}
                                    onChange={e => setFiltroOperador(e.target.value)}
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
                                <Table.TextHeaderCell> Produto </Table.TextHeaderCell>
                                <Table.TextHeaderCell> Quantidade retirada </Table.TextHeaderCell>
                                <Table.TextHeaderCell> Forma de pagamento </Table.TextHeaderCell>
                                <Table.TextHeaderCell> Nome do cliente </Table.TextHeaderCell>
                                <Table.TextHeaderCell> Tipo de retirada </Table.TextHeaderCell>
                                <Table.TextHeaderCell> Operador </Table.TextHeaderCell>
                                <Table.TextHeaderCell> Data de retirada </Table.TextHeaderCell>
                            </Table.Head>
                            <Table.Body height={240}>
                                {estoque.map(e => {
                                    let criadoEm = moment(e.createdAt).format("DD/MM/YYYY HH:mm:ss");
                                    return (
                                        <Table.Row key={e.id} isSelectable>
                                            <Table.TextCell>{e.produto}</Table.TextCell>
                                            <Table.TextCell>{e.qnt}</Table.TextCell>
                                            <Table.TextCell>{e.forma_pagamento}</Table.TextCell>
                                            <Table.TextCell>{e.nome_cliente}</Table.TextCell>
                                            <Table.TextCell>{e.type}</Table.TextCell>
                                            <Table.TextCell>{e.operador}</Table.TextCell>
                                            <Table.TextCell>{criadoEm}</Table.TextCell>
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
