// import logo from './logo.svg';
import '../App.css';
import { Pane, Text, Button, Menu } from 'evergreen-ui'
import { useHistory } from 'react-router-dom';
import { useState } from 'react';


function App() {

    const [selected, setState] = useState("");

    let history = useHistory();

    function rota(params) {
        history.push(params)
    }

    const options = [
        {
            label: 'String',
            value: 'String or Number'
        }
    ]

    return (
        <div>
            <header>
                <Pane
                    height={50}
                    width={"inherit"}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    border="default"
                    backgroundColor="#7B8B9A"
                    elevation={2}
                    padding={20}
                >
                    <Pane height={50}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        width="10%"
                    >
                        <Button height="80%" color="white" onClick={() => rota('/estoque')}>ESTOQUE</Button>
                        <Button height="80%" color="white" onClick={() => rota('/vendas')}>VENDAS </Button>
                    </Pane>
                    <Text color="white" fontSize={20} fontWeight="bold">SISTEMA DE CONTROLE DE ESTOQUE E VENDAS</Text>

                </Pane>
            </header>
        </div>
    );
}

export default App;
