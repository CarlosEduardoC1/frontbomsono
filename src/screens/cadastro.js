// import logo from './logo.svg';
import '../App.css';
import { Pane, Text, Button, TextInput, Textarea } from 'evergreen-ui'
import Estoque from './estoque';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { _getUserName } from '../config/users/services.users';
import { _salvarPoduto } from '../config/produtos/services.produtos';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';

function App() {

    const [nome, setNome] = useState("");
    const [codigo, setCodigo] = useState();
    const [descricao, setDescricao] = useState();
    const [pcomp, setPcomp] = useState();
    const [pven, setPven] = useState();
    const [grupo, setGrupo] = useState();
    const [obs, setObs] = useState();
    const [qnt, setQnt] = useState();
    const [backDrop, setbackDrop] = useState(false);

    //erros
    const [validationNome, setValidationNome] = useState(false);
    const [erroNome, setErroNome] = useState('');
    const [validationCodigo, setValidationCodigo] = useState(false);
    const [erroCodigo, setErroCodigo] = useState('');
    const [validationDesc, setValidationDesc] = useState(false);
    const [erroDesc, setErroDesc] = useState('');
    const [validationPven, setValidationPVen] = useState(false);
    const [erroPven, setErroPVen] = useState('');
    const [validationQnt, setValidationQnt] = useState(false);
    const [erroQnt, setErroQnt] = useState('');
    const [snack, setSnack] = useState(false);
    const [mensagem, setMensagem] = useState();
    const [tipoMensagem, setTipoMensagem] = useState('');

    useEffect(async () => {

        const userName = await _getUserName();
        console.log(userName);
    })


    function closeSnack() {
        setSnack(false);
    }

    function precoVenda(v) {
        console.log(v);
        v = v.replace(/\D/g, '');
        v = v.replace(/(\d{1,2})$/, ',$1');
        v = v.replace(/(\d)(?=(\d{2})+(?!\d))/g, '$1');
        setPven(v);
    }

    function precoCompra(v) {
        v = v.replace(/\D/g, '');
        v = v.replace(/(\d{1,2})$/, ',$1');
        // v = v.replace(/(\d)(?=(\d{2})+(?!\d))/g, '$1');
        setPcomp(v);
    }

    let history = useHistory();

    async function salvaProduto() {
        setbackDrop(true);
        if (!nome) {
            setValidationNome(true);
            setErroNome("O nome é obrigatório");
            setbackDrop(false);
        }
        if (!codigo) {
            setValidationCodigo(true);
            setErroCodigo("O código é obrigatório");
            setbackDrop(false);
        }
        if (!descricao) {
            setValidationDesc(true);
            setErroDesc("A descrição é obrigatória");
            setbackDrop(false);
        }
        if (!pven) {
            setValidationPVen(true);
            setErroPVen("O preço de venda é obrigatório");
            setbackDrop(false);
        }
        if (!qnt) {
            setValidationQnt(true);
            setErroQnt("A quantidade é obrigatória");
            setbackDrop(false);
        }
        else {
            let comp = '';
            if (pcomp) {
                comp = pcomp.replace(',', '.');
            } else {
                comp = pcomp;
            }
            const userName = await _getUserName();
            console.log(userName);
            let json = {
                name: nome,
                codigo: codigo,
                descricao: descricao,
                pcomp: comp,
                pven: pven.replace(',', '.'),
                grupo: grupo,
                quantidade: qnt,
                obs: obs,
                operador: userName
            }
            const response = await _salvarPoduto(json)
                .then(result => {
                    setbackDrop(false);
                    exibeSnack(result.data.msg)
                })
                .catch(() => {
                    setbackDrop(false);
                    exibeSnack("Ocorreu um erro!")
                });
        }

    }

    function exibeSnack(params) {
        setSnack(true);
        setTipoMensagem("error");
        setMensagem(params);

    }


    if (backDrop) {
        return (
            <Backdrop style={{ backgroundColor: 'white', flexDirection: "column" }} open={backDrop}>
                <CircularProgress color="primary" />
                <Typography>Aguarde o cadastro ser efetuado!</Typography>
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
                    <Text fontWeight="bold">CADASTRE UM NOVO PRODUTO</Text>
                    <div style={{ paddingRigth: '10px' }}>
                        <Grid container spacing={3}>
                            <Grid item xl={3} sm={3} spacing={3}>
                                <TextInput
                                    isInvalid={validationNome}
                                    required
                                    id="Nome"
                                    placeholder="Nome do produto"
                                    color="black"
                                    margin={10}
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                >
                                </TextInput>
                                <FormHelperText style={{ marginLeft: '20px' }} error>{erroNome}</FormHelperText>
                            </Grid>
                            <Grid item xl={3} sm={3} spacing={3}>
                                <TextInput
                                    isInvalid={validationCodigo}
                                    required
                                    id="Codigo"
                                    placeholder="Código do produto"
                                    type='number'
                                    margin={10}
                                    value={codigo}
                                    onChange={e => setCodigo(e.target.value)}
                                >

                                </TextInput>
                                <FormHelperText style={{ marginLeft: '20px' }} error>{erroCodigo}</FormHelperText>
                            </Grid>
                            <Grid item xl={3} sm={6} spacing={3}>
                                <TextInput
                                    style={{ width: '100%' }}
                                    isInvalid={validationDesc}
                                    required
                                    id="Desc"
                                    placeholder="Descrição"
                                    margin={10}
                                    value={descricao}
                                    onChange={e => setDescricao(e.target.value)}
                                >

                                </TextInput>
                                <FormHelperText style={{ marginLeft: '20px' }} error>{erroDesc}</FormHelperText>
                            </Grid>
                            <Grid item xl={3} sm={3} spacing={3}>
                                <TextInput
                                    required
                                    id="Pcom"
                                    placeholder="Preço de compra"
                                    margin={10}
                                    value={pcomp}
                                    onChange={e => precoCompra(e.target.value)}
                                >

                                </TextInput>
                            </Grid>
                            <Grid item xl={3} sm={3} spacing={3}>
                                <TextInput
                                    required
                                    id="grp"
                                    placeholder="Grupo"
                                    margin={10}
                                    value={grupo}
                                    onChange={e => setGrupo(e.target.value)}
                                >

                                </TextInput>
                            </Grid>
                            <Grid item xl={3} sm={3} spacing={3}>
                                <TextInput
                                    isInvalid={validationPven}
                                    required
                                    id="Pven"
                                    placeholder="Preço de venda"
                                    margin={10}
                                    value={pven}
                                    onChange={e => precoVenda(e.target.value)}
                                >

                                </TextInput>
                                <FormHelperText style={{ marginLeft: '20px' }} error>{erroPven}</FormHelperText>
                            </Grid>
                            <Grid item xs={3} sm={3} spacing={3}>
                                <TextInput
                                    width="100%"
                                    isInvalid={validationQnt}
                                    required
                                    id="qnt"
                                    placeholder="Quantidade"
                                    margin={10}
                                    type='number'
                                    value={qnt}
                                    onChange={e => setQnt(e.target.value)}
                                >

                                </TextInput>
                                <FormHelperText style={{ marginLeft: '20px' }} error>{erroQnt}</FormHelperText>
                            </Grid>
                        </Grid>
                    </div>
                    <div>
                        <Textarea
                            width="150%"
                            required
                            id="obd"
                            placeholder="Observações"
                            margin={10}
                            value={obs}
                            onChange={e => setObs(e.target.value)}

                        >

                        </Textarea>
                        <Button appearance="primary" intent="danger" marginRight={5} onClick={() => history.push(`/estoque`)}>CANCELAR</Button>
                        <Button appearance="primary" intent="success" marginLeft={5} onClick={() => salvaProduto()}>SALVAR</Button>
                    </div>
                </Pane>
            </div >
        );
    }
}

export default App;
