import {GET_FACTORIES} from '../actions/factoryAction'

const initialState = {
    factories : []
}

export default ( state = initialState, action ) => {
    switch (action.type) {
        case GET_FACTORIES: {
            return {
                ...state,
                factories: action.payload
            }
        }
        default:
            return state
    }
}