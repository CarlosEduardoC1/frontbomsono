// import logo from './logo.svg';
import '../App.css';
import { Pane } from 'evergreen-ui'
import MenuItem from '../App';
import { useHistory } from 'react-router-dom';
import { _getUserName, _getUserMail } from '../config/users/services.users';
import ModalDeletar from '../constants/modal/modaldeletar';
import { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';


function App() {
    let history = useHistory();
    const [userMail, setusermail] = useState();
    const [userName, setusername] = useState();

    useEffect(() => {
        getDados();
    }, []);

    async function getDados() {
        let nome = await _getUserName();
        setusername(nome);
        let mail = await _getUserMail();
        setusermail(mail);
    }
    console.log(userName);
    console.log(userMail);

    return (
        <div>
            <MenuItem />
            <Pane
                height="100%"
                width="50%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexDirection="row"
                border="default"
                backgroundColor="white"
                elevation={2}
                padding={20}
                marginLeft={350}
            >
                <Typography style={{ marginBottom: '20px' }}>Você está acessando como {userName} no e-mail: {userMail}</Typography>

            </Pane>

        </div>
    );
}

export default App;
