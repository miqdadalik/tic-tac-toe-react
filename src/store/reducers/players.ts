import { PLAYERS_LIST } from '../actions/players';

const playersListReducer = (state = [], {type, payload}: any) => {
    console.log(type)
    console.log(payload);
    switch(type) {
        case PLAYERS_LIST:
            return payload;
        default:
            return state;
    }
}

export default playersListReducer;
