import axios from 'axios';

export const GET_FACTORY = "GET_FACTORY";
export const GET_FACTORIES = "GET_FACTORIES";
export const CREATE_FACTORY = "CREATE_FACTORY";
export const UPDATE_FACTORY = "UPDATE_FACTORY";
export const DELETE_FACTORY = "DELETE_FACTORY";

const API_URL = "http://localhost:5069"

export function getFactories() {
    console.log('test getting factories...')
    const url = `${API_URL}/api/factory/getAll`;
    console.log("URL is", url);
    return async dispatch => {
      try {
        const factories = await axios.get(url);
        dispatch({ type: GET_FACTORIES, payload: factories.data })
      } catch (e) {
        console.log(e);
      }
    };
}

export function createFactory(body) {
  console.log('body is: ', body)
  const url = `${API_URL}/api/factory/createFactory`;
  console.log("URL is ", url);
  return async dispatch => {
    try {
      const newFactory = await axios.post(url, body);
      console.log('created factory: ', newFactory.data);
      dispatch({ type: CREATE_FACTORY, payload: newFactory.data })
    } catch (e) {
      console.log(e);
    }
  };
}

export function getFactoryById(id) {
  console.log('getting factory by id: ', id)
  const url = `${API_URL}/api/factory/getFactory?id=${id}`;
  return async dispatch => {
    try {
      const factory = await axios.get(url);
      dispatch({ type: GET_FACTORY, payload: factory.data })
    } catch (e) {
      console.log(e);
    }
  };
}

export function updateFactory(id, body) {
  console.log('in update, id is: ', id, 'body is: ', body)
  const url = `${API_URL}/api/factory/updateFactory/${id}`;
  return async dispatch => {
    try {
      const newFactory = await axios.put(url, body);
      console.log('updated factory: ', newFactory.data);
      dispatch({ type: UPDATE_FACTORY, payload: newFactory.data })
    } catch (e) {
      console.log(e);
    }
  };
}

export function deleteFactory(id) {
  const url = `${API_URL}/api/factory/deleteFactory/${id}`;
  return async dispatch => {
    try{
      const remainingFactories = await axios.delete(url);
      dispatch({ type: DELETE_FACTORY, payload: remainingFactories.data })
    } catch(e) {
      console.log(e);
    }
  }
}