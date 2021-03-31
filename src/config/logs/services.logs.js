import connect from '../services';

export const _listarRetiradas = async (json) => {
    const response = await connect.post('logs/lista', json);
    return response;
}
