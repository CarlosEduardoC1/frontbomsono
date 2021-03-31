// import logo from './logo.svg';
import '../App.css';
import { Pane, Text, Button, Tab, TabNavigation } from 'evergreen-ui'
import MenuItem from '../App';
import { useHistory } from 'react-router-dom';
import { _getUserType } from '../config/users/services.users';
import ModalDeletar from '../constants/modal/modaldeletar';
import { useState } from 'react';

function App() {

    let history = useHistory();
    let tabs = ['CADASTRAR PRODUTOS', 'ESTOQUE ATUAL', 'RETIRADAS'];
    const [modal, setModal] = useState();

    function closeModal() {
        setModal();
    }

    async function rota(parameters) {
        switch (parameters) {
            case "CADASTRAR PRODUTOS":
                history.push(`/cadastroproduto`);
                break;
            case "ESTOQUE ATUAL":
                history.push('/estoqueatual');
                break;
            case "RETIRADAS":
                const tipoUser = await _getUserType();
                if (tipoUser != 'AD') {

                    let close = closeModal;
                    let deleta = closeModal;
                    let modalDeletar = await ModalDeletar(1, "Ops!!", "Você não tem privilégios de administrador. Faça login como administrador para poder excluir este produto!", close, deleta);
                    setModal(modalDeletar);
                } else {
                    history.push('/retiradas');
                }
                break;
            default:
                break;
        }


    }

    return (
        <div>
            <MenuItem />
            <Pane
                height={100}
                width="90%"
                display="flex"
                alignItems="center"
                border="default"
                backgroundColor="white"
                elevation={2}
                padding={20}
                marginLeft={100}
                >
                <TabNavigation >
                    {tabs.map((tab, index) => {
                        return (
                            <Tab key={tab} is="a" id={tab} onClickCapture={event => rota(event.target.id)} >
                                {tab}
                            </Tab>
                        )
                    })}
                </TabNavigation>
            </Pane>
            {modal}
        </div>
    );
}

export default App;
