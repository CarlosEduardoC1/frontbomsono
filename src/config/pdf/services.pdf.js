import connect from '../services';

export const _geraPDF = async (json) => {
    const response = await connect.post('pdf', json);
    return response;
}