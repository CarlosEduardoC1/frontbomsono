// import logo from './logo.svg';
import '../App.css';
import { Pane, Text, Table, Button } from 'evergreen-ui'
import Vendas from './vendas';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Grid, TextField } from '@material-ui/core';
import IconSearch from '@material-ui/icons/Search';
import { _listarVendas } from '../config/vendas/services.vendas';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';



function App() {

    const [estoque, setEstoque] = useState([]);
    const [filtroCliente, setfiltroCliente] = useState('');
    const [filtroPagamento, setfiltroPagamento] = useState('');
    const [filtroOperador, setFiltroOperador] = useState('');
    const [filtroProduto, setfiltroProduto] = useState('');
    const [snack, setSnack] = useState(false);
    const [mensagem, setMensagem] = useState();
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [backDrop, setbackDrop] = useState(false);
    const [msg, setMsg] = useState('Procurando histórico de vendas...');

    useEffect(() => {
        getProdutos();
        setbackDrop(true);
    }, [filtroCliente, filtroPagamento, filtroOperador, filtroProduto])

    let history = useHistory();

    async function getProdutos() {
        const response = await _listarVendas({ page: 1, limit: 5000, produto: filtroProduto, forma_pagamento: filtroPagamento, operador: filtroOperador, nome_cliente: filtroCliente })
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
                <Vendas />
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
                            <Grid item xs={3} sm={3} direction="row">
                                <TextField
                                    fullWidth
                                    label="Nome do Cliente"
                                    variant="standard"
                                    value={filtroCliente}
                                    autoFocus={true}
                                    onChange={e => setfiltroCliente(e.target.value)}
                                />

                            </Grid>
                            <Grid item xs={3} sm={2} direction="row">
                                <TextField
                                    fullWidth
                                    label="Forma de pagamento"
                                    variant="standard"
                                    value={filtroPagamento}
                                    onChange={e => setfiltroPagamento(e.target.value)}
                                />

                            </Grid>
                            <Grid item xs={3} sm={3}>
                                <TextField
                                    fullWidth
                                    label="Produto"
                                    variant="standard"
                                    value={filtroProduto}
                                    onChange={e => setfiltroProduto(e.target.value)}
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
                                <Table.TextHeaderCell> Quantidade vendida </Table.TextHeaderCell>
                                <Table.TextHeaderCell> Forma de pagamento </Table.TextHeaderCell>
                                <Table.TextHeaderCell> Nome do cliente </Table.TextHeaderCell>
                                <Table.TextHeaderCell> Total da venda </Table.TextHeaderCell>
                                <Table.TextHeaderCell> Operador </Table.TextHeaderCell>
                                <Table.TextHeaderCell> Data da venda </Table.TextHeaderCell>
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
                                            <Table.TextCell>R${e.total.replace('.', ',')}</Table.TextCell>
                                            <Table.TextCell>{e.operador}</Table.TextCell>
                                            <Table.TextCell>{criadoEm}</Table.TextCell>
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </div>
                </Pane>
            </div>
        );
    }
}

export default App;
