// import logo from './logo.svg';
import '../App.css';
import { Pane, Text, Button, TextInput, Textarea, Table, RadioGroup } from 'evergreen-ui'
import Vendas from './vendas';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { _listarProdutos } from '../config/produtos/services.produtos';
import { FormHelperText, Grid, TextField, Typography } from '@material-ui/core';
import IconSearch from '@material-ui/icons/Search';
import { _salvarVenda } from '../config/vendas/services.vendas';
import { _getUserName } from '../config/users/services.users';
import { _geraPDF } from '../config/pdf/services.pdf';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';

function App() {

    const [estoque, setEstoque] = useState([]);
    const [nomeCliente, setNomeCliente] = useState("");
    const [bairro, setBairro] = useState("");
    const [endereco, setEndereco] = useState("");
    const [fresid, setFresid] = useState("");
    const [fcel, setFcel] = useState("");
    const [cpf, setCPF] = useState("");
    const [obs, setObs] = useState("");
    const [tipo, setTipo] = useState("");
    const [qnt, setQuantidade] = useState(0);
    const [value, setValue] = useState("DI");
    const [pdfsrc, setpdfFrame] = useState("");
    const options = [
        { label: 'Dinheiro', value: 'DI' },
        { label: 'Crédito', value: 'CR' },
        { label: 'Débito', value: 'DB' },
        { label: 'Financeira', value: 'FI' },
        { label: 'Cheque', value: 'CH' },
        { label: 'Transferência', value: 'TR' },
        { label: 'Pix', value: 'PX' }
    ];
    const [filtroNome, setFiltroNome] = useState('');
    const [valorQuant, setValorQuant] = useState(0);
    const [total, setTotal] = useState(0);
    const [parcelas, setParcelas] = useState(1);

    const [validationNome, setValidationNome] = useState(false);
    const [erroNome, setErroNome] = useState('');

    const [validationFP, setValidationFP] = useState(false);
    const [erroFP, setErroFP] = useState('');

    const [validationParcela, setValidationParcela] = useState(false);
    const [erroParcela, setErroParcela] = useState('');

    const [validationNomeCliente, setValidationNomeCliente] = useState(false);
    const [erroNomeCliente, setErroNomeCliente] = useState('');

    const [validationQnt, setValidationQnt] = useState(false);
    const [erroQnt, setErroQnt] = useState('');

    const [validationCelular, setValidationCelular] = useState(false);
    const [erroCelular, setErroCelular] = useState('');

    const [validationCPF, setValidationCPF] = useState(false);
    const [erroCPF, setErroCPF] = useState('');

    const [snack, setSnack] = useState(false);
    const [mensagem, setMensagem] = useState();
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [backDrop, setbackDrop] = useState(false);
    const [msg, setMsg] = useState("Estamos processando sua venda...");

    let json = {};

    useEffect(() => {
        getProdutos();
        setbackDrop(true);
        setMsg('Procurando produtos disponíveis para venda...');
    }, [filtroNome, pdfsrc])

    async function getProdutos() {
        const response = await _listarProdutos({ page: 1, limit: 5000, name: filtroNome })
            .then(result => {
                setbackDrop(false);
                setMsg("Estamos processando sua venda...");
                setEstoque(result.data['rows'])
            })
            .catch(() => {
                setbackDrop(false);
                setMsg("Estamos processando sua venda...");
                executaSnack("Ocorreu um erro!")
            });
    }

    function closeSnack() {
        setSnack(false);
    }

    let history = useHistory();
    let dataHoraAtual = moment().format("DD/MM/YYYY HH:mm:ss");

    function handleClose() {
        setbackDrop(false);
    }

    function executaSnack(params) {

        setSnack(true);
        setTipoMensagem("error");
        setMensagem(params);
    }


    function parcelado() {
        if (value === 'CR') {
            return (
                <div>Nº de parcelas:
                    <TextInput
                        width="40px"
                        type="number"
                        required
                        id="nomeCliente"
                        margin={10}
                        value={parcelas}
                        onChange={e => setParcelas(e.target.value)}
                    >

                    </TextInput>
                </div>
            )
        }
    }

    async function _criarPDF(json) {
        const res = await _geraPDF(json)
            .then(resulte => {

                const linkSource = `data:application/pdf;base64,${resulte.data.pdf}`;
                const downloadLink = document.createElement("a");
                const fileName = nomeCliente + ".pdf";

                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
                setbackDrop(false);
                setMsg("Venda realizada com sucesso!");
            })
            .catch(() => executaSnack("Ocorreu um erro!"));
    }


    async function criarVenda() {
        if (!tipo) {
            setValidationNome(true);
            setErroNome("O Produto é obrigatório");
        }
        if (!qnt) {
            setValidationQnt(true);
            setErroQnt("A quantidade é obrigatória");
        }
        if (!value) {
            setValidationFP(true);
            setErroFP("A forma de pagamento é obrigatória");
        }
        if (value === 'CR') {
            if (!parcelas) {
                setValidationParcela(true);
                setErroParcela("O número de parcelas é obrigatório");
            }
        }
        if (!nomeCliente) {
            setValidationNomeCliente(true);
            setErroNomeCliente("O nome do cliente é obrigatório");
        }
        if (!fcel) {
            setValidationCelular(true);
            setErroCelular("O número de celular é obrigatório");
        }
        if (!cpf) {
            setValidationCPF(true);
            setErroCPF("O CPF é obrigatório");
        }
        else {
            setbackDrop(true);
            const userName = await _getUserName();
            let formapg = '';
            switch (value) {
                case 'DI':
                    formapg = 'Dinheiro';
                    break;
                case 'CR':
                    formapg = 'Crédito';
                    break;
                case 'DB':
                    formapg = 'Débito';
                    break;
                case 'FI':
                    formapg = 'Financeira';
                    break;
                case 'CH':
                    formapg = 'Cheque';
                    break;
                case 'TR':
                    formapg = 'Transferência';
                    break;
                case 'PX':
                    formapg = 'Pix';
                    break;

                default:
                    break;
            }
            json = {
                produto: tipo,
                qnt: qnt,
                total: total,
                forma_pagamento: formapg,
                nome_cliente: nomeCliente,
                endereco_cliente: endereco,
                bairro_cliente: bairro,
                fone_cliente_residencia: fresid,
                fone_cliente_celular: fcel.toString(),
                cpf: cpf,
                obs: "Observação: " + obs,
                operador: userName,
                parcelas: parcelas,
                type: "venda",
                data_hora: dataHoraAtual.toString()
            }
            const response = await _salvarVenda(json)
                .then(result => {
                    _criarPDF(json);
                    setMsg("Seu arquivo PDF está sendo preparado...");
                    // history.push('/vendas');
                })
                .catch(() => executaSnack("Ocorreu um erro!"));
        }
    }



    if (backDrop) {
        return (
            <Backdrop style={{ backgroundColor: 'white', flexDirection: "column" }} open={backDrop} >
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
                    alignItems="center"
                    justifyContent="space-between"
                    border="default"
                    backgroundColor="white"
                    elevation={2}
                    padding={20}
                    paddingRight={20}
                    marginLeft={100}
                    marginTop={20}
                    flexWrap="wrap"
                >
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text fontWeight="bold">CADASTRE UMA VENDA</Text>
                            <Text fontWeight="bolder">DATA/HORA DA VENDA: {dataHoraAtual}</Text>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: "100%", alignItems: 'flex-start' }}>
                            <div>
                                <TextField
                                    isInvalid={validationNome}
                                    width="15%"
                                    style={{ marginBottom: '20px' }}
                                    label="Nome"
                                    variant="standard"
                                    value={filtroNome}
                                    onChange={e => setFiltroNome(e.target.value)}
                                />
                                <IconSearch fontSize="small" style={{ marginTop: '20px' }} />
                            </div>
                            <FormHelperText error >{erroNome}</FormHelperText>
                            <Table style={{ width: '100%' }}>
                                <Table.Head>
                                    <Table.TextHeaderCell> Nome </Table.TextHeaderCell>
                                    <Table.TextHeaderCell> Quantidade </Table.TextHeaderCell>
                                    <Table.TextHeaderCell> Preço de venda </Table.TextHeaderCell>
                                    <Table.TextHeaderCell> Descrição </Table.TextHeaderCell>
                                    <Table.TextHeaderCell> Grupo </Table.TextHeaderCell>
                                </Table.Head>
                                <Table.Body height={240}>
                                    {estoque.map(e => {
                                        return (
                                            <Table.Row key={e.id} isSelectable onSelect={() => {
                                                setValorQuant(parseFloat(e.pven));
                                                setTipo(e.name)
                                            }}>
                                                <Table.TextCell>{e.name}</Table.TextCell>
                                                <Table.TextCell>{e.quantidade}</Table.TextCell>
                                                <Table.TextCell>{e.pven}</Table.TextCell>
                                                <Table.TextCell>{e.descricao}</Table.TextCell>
                                                <Table.TextCell>{e.grupo}</Table.TextCell>
                                            </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table>
                        </div>
                        <div style={{ marginBottom: '15px' }}>Quantidade:
                        <TextInput
                                required
                                isInvalid={validationQnt}
                                id="qnt"
                                label="Quantidade"
                                type="number"
                                min={1}
                                marginLeft={10}
                                marginBottom={20}
                                width="80px"
                                value={qnt}
                                onChange={e => {
                                    setTotal(parseInt(e.target.value) * valorQuant);
                                    setQuantidade(e.target.value);
                                }}
                            >

                            </TextInput>
                            <FormHelperText error >{erroQnt}</FormHelperText>
                        </div>
                        <RadioGroup
                            isInvalid={validationFP}
                            flexDirection="inherit"
                            label="Formas de Pagamento"
                            value={value}
                            options={options}
                            onChange={event => setValue(event.target.value)}
                        />
                        <FormHelperText error >{erroFP}</FormHelperText>
                        {parcelado()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        <div>
                            <TextInput
                                required
                                id="nomeCliente"
                                placeholder="Cliente"
                                margin={10}
                                isInvalid={validationNomeCliente}
                                value={nomeCliente}
                                onChange={e => setNomeCliente(e.target.value)}
                            >

                            </TextInput>
                            <FormHelperText error> {erroNomeCliente}</FormHelperText>
                        </div>
                        <div>
                            <TextInput
                                required
                                id="end"
                                placeholder="Endereço"
                                margin={10}
                                value={endereco}
                                onChange={e => setEndereco(e.target.value)}
                            >

                            </TextInput>
                        </div>
                        <div>
                            <TextInput
                                required
                                id="bairro"
                                placeholder="Bairro"
                                margin={10}
                                value={bairro}
                                onChange={e => setBairro(e.target.value)}
                            >

                            </TextInput>
                        </div>
                        <div>
                            <TextInput
                                required
                                id="fResid"
                                placeholder="Fone Residencial"
                                margin={10}
                                maxLength={11}
                                value={fresid}
                                type="number"
                                onChange={e => setFresid(e.target.value)}
                            >

                            </TextInput>
                        </div>
                        <div>
                            <TextInput
                                isInvalid={validationCelular}
                                required
                                id="fCel"
                                placeholder="Fone Celular"
                                margin={10}
                                value={fcel}
                                type="number"
                                maxLength={11}
                                onChange={e => setFcel(e.target.value)}
                            >

                            </TextInput>
                            <FormHelperText error> {erroCelular}</FormHelperText>
                        </div>
                        <div>
                            <TextInput
                                required
                                isInvalid={validationCPF}
                                id="cpf"
                                type="number"
                                placeholder="CPF"
                                margin={10}
                                value={cpf}
                                maxLength={11}
                                onChange={e => setCPF(e.target.value)}
                            >

                            </TextInput>
                            <FormHelperText error> {erroCPF}</FormHelperText>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
                        <Textarea
                            width="96%"
                            required
                            id="obd"
                            placeholder="Observações"
                            margin={10}
                            value={obs}
                            onChange={e => setObs(e.target.value)}

                        >

                        </Textarea>
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                            <Text fontSize={20} fontWeight='bolder' marginBottom={10}>{`TOTAL= R$ ${total}`}</Text>
                            <div style={{ flexDirection: 'column', marginTop: '20px' }}>
                                <Button appearance="primary" intent="danger" marginRight={5} onClick={async () => { history.push(`/vendas`) }}>CANCELAR</Button>
                                <Button appearance="primary" intent="success" marginLeft={5} onClick={() => criarVenda()}>SALVAR</Button>
                            </div>
                        </div>
                    </div>
                </Pane >
            </div >
        );
    }
}

export default App;
