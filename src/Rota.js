import React from "react";
import {
    BrowserRouter as Router,
    Route
} from "react-router-dom";
import Home from './screens/home';
import Vendas from './screens/vendas';
import Estoque from './screens/estoque';
import Cadastro from './screens/cadastro';
import Users from './screens/users';
import Produto from './screens/vender';
import Login from './screens/login';
import EstoqueAtual from './screens/estoqueAtual';
import Retiradas from './screens/retiradas';
import Vendidos from './screens/vendaslistar';
import './App.css';
import firebase from 'firebase';
import { CornerDialog } from 'evergreen-ui';
import PDF from './constants/pdf/showpdf';

function App() {

    return (
        <Router>
            {/* //initial route */}
            <Route path="/home" exact component={Home} />
            <Route path="/" exact component={Login} />
            {/* rota de vendas  */}
            <Route path="/vendas" exact component={Vendas} />
            <Route path="/venderproduto" exact component={Produto} />
            <Route path="/historicodevendas" exact component={Vendidos} />
            {/* rota de estoque  */}
            <Route path="/estoque" exact component={Estoque} />
            <Route path="/cadastroproduto" exact component={Cadastro} />
            <Route path="/estoqueatual" exact component={EstoqueAtual} />
            <Route path="/retiradas" exact component={Retiradas} />
            {/* roda de usuarios */}
            <Route path="/users" exact component={Users} />
            {/* pdf */}

            <Route path="/pdf" exact component={PDF} />
            <CornerDialog
                title="O sistema está ativo!"
                isShown={true}
                onCloseComplete={() => false}
                hasCancel={false}
                intent="success"
                confirmLabel="OK"
            >
                Caso precise de suporte técnico, entre em contato com Carlos. Whatsapp (61) 9 9518-4278
      </CornerDialog>
        </Router>
    );
}



export default App;