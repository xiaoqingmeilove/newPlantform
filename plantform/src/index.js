import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Login from './pages/login';
import App from './App';

// axios.defaults.baseURL = 'http://localhost:6003/transmit';
axios.defaults.baseURL = '/transmit';


{/* <Route path='/login' component={Login} /> */}

ReactDOM.render(
    <HashRouter>
        <Switch>
            <Route path='/login' exact component={Login} />
            <Route path='/' component={App} />
        </Switch>
    </HashRouter>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
