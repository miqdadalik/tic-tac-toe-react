import { createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import playersListReducer from './reducers/players';

const reducers = combineReducers({
    playersList: playersListReducer
});

const middleware = [thunk];
const composeEnhancers = compose;

export default createStore(reducers, composeEnhancers(applyMiddleware(...middleware)));

