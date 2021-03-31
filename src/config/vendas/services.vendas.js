import connect from '../services';

export const _salvarVenda = async (json) => {
    const response = await connect.post('vendas', json);
    return response;
}

export const _listarVendas = async (json) => {
    const response = await connect.post('vendas/lista', json);
    return response;
}
