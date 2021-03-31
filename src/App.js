
import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import AttachMoney from '@material-ui/icons/AttachMoney';
import HomeIcon from '@material-ui/icons/Home';
import Description from '@material-ui/icons/DescriptionSharp';
import Exit from '@material-ui/icons/ExitToApp';
import User from '@material-ui/icons/Person';
import { Avatar } from 'evergreen-ui';
import Login from './screens/login';
import { useHistory } from 'react-router-dom';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    background: '#A6B1BB',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    background: '#fff',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    background: '#fff',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  let history = useHistory();
  let sessao = sessionStorage.getItem('user/Token');
  let nome = sessionStorage.getItem('user/Name');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  function logoff() {
    sessionStorage.removeItem('user/Email');
    sessionStorage.removeItem('user/Token');
    sessionStorage.removeItem('user/Name');
    sessionStorage.removeItem('user/Type');
    window.location.reload();
  }

  if (sessao) {

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar style={{ justifyContent: 'space-between' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon color="action" />
            </IconButton>
            <Typography variant="h6" noWrap color="initial">
              SISTEMA DE GESTÃO DE ESTOQUE
          </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {nome}
              <Avatar style={{ marginLeft: '10px' }} isSolid name={nome} size={40} background="#234361" />
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button key={"home"}>
              <ListItemIcon id="home" onClick={() => history.push(`/home`)}><HomeIcon /></ListItemIcon>
              <ListItemText primary={"Home"} onClick={() => history.push(`/home`)} />
            </ListItem>
            <ListItem button key={"estoque"}>
              <ListItemIcon id="estoque" onClick={() => history.push(`/estoque`)}><InboxIcon /></ListItemIcon>
              <ListItemText primary={"Estoque"} onClick={() => history.push(`/estoque`)} />
            </ListItem>
            <ListItem button key={"vendas"}>
              <ListItemIcon id="vendas" onClick={() => history.push(`/vendas`)}><AttachMoney /></ListItemIcon>
              <ListItemText primary={"Vendas"} onClick={() => history.push(`/vendas`)} />
            </ListItem>
            <ListItem button key={"Usuários"}>
              <ListItemIcon id="Usuários" onClick={() => history.push(`/users`)}><User /></ListItemIcon>
              <ListItemText primary={"Usuários"} onClick={() => history.push(`/users`)} />
            </ListItem>
            <ListItem button key={"Sair"}>
              <ListItemIcon id="Sair" onClick={logoff}><Exit /></ListItemIcon>
              <ListItemText primary={"Sair"} onClick={logoff} />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
        </main>
      </div>
    );
  }
  else {
    return (
      <Login />
    )
  }

}


// import React from "react";
// import {
//   BrowserRouter as Router,
//   Route
// } from "react-router-dom";
// import Home from './screens';
// import Vendas from './screens/vendas';
// import Estoque from './screens/estoque';
// import Cadastro from './screens/cadastro';
// import './App.css';

// import { CornerDialog } from 'evergreen-ui';

// function App() {
//   return (
//     <Router>
//       {/* //initial route */}
//       <Route path="/" exact component={Home} />
//       {/* rota de vendas  */}
//       <Route path="/vendas" exact component={Vendas} />
//       {/* rota de estoque  */}
//       <Route path="/estoque" exact component={Estoque} />
//       <Route path="/cadastroproduto" exact component={Cadastro} />
//       <CornerDialog
//         title="O sistema está ativo!"
//         isShown={true}
//         onCloseComplete={() => false}
//         hasCancel={false}
//         intent="success"
//         confirmLabel="OK"
//       >
//         Caso precise de suporte técnico, entre em contato com Carlos. Whatsapp (61) 9 9518-4278
//       </CornerDialog>
//     </Router>
//   );
// }



// export default App;
