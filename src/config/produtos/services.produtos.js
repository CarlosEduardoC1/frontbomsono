import connect from '../services';

export const _salvarPoduto = async (json) => {
    const response = await connect.post('estoque', json);
    return response;
}

export const _listarProdutos = async (json) => {
    const response = await connect.post('estoque/lista', json);
    return response;
}

export const _deletarProduto = async (id) => {
    const response = await connect.delete('estoque/' + id);
    return response;
}