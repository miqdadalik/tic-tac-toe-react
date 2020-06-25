import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from '../components/home/Home';
import Board from '../components/board/Board';
import Result from '../components/result/Result';

const AppRouter = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/board">
                    <Board />
                </Route>
                <Route path="/result">
                    <Result />
                </Route>
            </Switch>
        </Router>
    )
};

export default AppRouter;
