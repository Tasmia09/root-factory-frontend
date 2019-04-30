import axios from 'axios';

export const GET_FACTORY = "GET_FACTORY";
export const GET_FACTORIES = "GET_FACTORIES";

const API_URL = "http://localhost:5069/"

export function getFactories() {
    console.log('test getting factories...')
    const url = `${API_URL}/api/root/getAll`;
    return async dispatch => {
      try {
        const factories = await axios.get(url);
        dispatch({ type: GET_FACTORIES, payload: factories.data })
      } catch (e) {
        console.log(e);
      }
    };
}