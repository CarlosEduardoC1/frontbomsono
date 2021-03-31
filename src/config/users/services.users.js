import connect from '../services';

export const _logar = async (json) => {
    const response = await connect.post('auth', json);
    return response;
}

export const _verificaEmail = async (json) => {
    const response = await connect.post('users/verificaemail', json);
    return response.data.possui;
}

export const _salvaUser = async (json) => {
    const response = await connect.post('users', json);
    return response;
}

export const _listarUsuarios = async (json) => {
    const response = await connect.post('users/lista', json);
    return response;
}

export const _deletaUser = async (id) => {
    const response = await connect.delete('users/' + id);
    return response;
}

export const _getUserName = async () => {
    const response = await sessionStorage.getItem('user/Name');
    return response;
}

export const _getUserType = async () => {
    const response = await sessionStorage.getItem('user/Type');
    console.log(response);
    return response;
}

export const _getUserMail = async () => {
    const response = await sessionStorage.getItem('user/Email');
    console.log(response);
    return response;
}