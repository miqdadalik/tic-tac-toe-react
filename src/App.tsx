import React from 'react';
import { Provider } from 'react-redux'

import store from './store'

import AppRouter from './routes/Routes';
import AppHeader from './components/header/Header'

const App = () => {
    return (
        <Provider store={store}>
            <div className="App">
                <AppHeader></AppHeader>
                <AppRouter></AppRouter>
            </div>
        </Provider>
    );
}

export default App;
