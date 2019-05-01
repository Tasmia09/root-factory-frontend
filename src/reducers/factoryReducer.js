import {GET_FACTORIES, CREATE_FACTORY, GET_FACTORY, UPDATE_FACTORY, DELETE_FACTORY} from '../actions/factoryAction'

const initialState = {
    factories : [],
    factory: {}
}

export default ( state = initialState, action ) => {
    switch (action.type) {
        case GET_FACTORIES: {
            return {
                ...state,
                factories: action.payload
            }
        }
        case GET_FACTORY: 
            return {
                ...state,
                factory: action.payload
            }
        case CREATE_FACTORY:
            return {
                ...state,
                factories: action.payload
            }
        case UPDATE_FACTORY:
            return {
                ...state,
                factories: action.payload
            }
        case DELETE_FACTORY: 
            return {
                ...state,
                factories: action.payload
            }
        default:
            return state
    }
}