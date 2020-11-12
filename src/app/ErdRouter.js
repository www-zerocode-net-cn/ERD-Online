import {HashRouter, Route, Switch} from 'react-router-dom';
import Project from './Project';
import User from './User';
import Role from './Role';
import Permission from './Permission';
import Loading from './Loading';
import Login from './Login';
import React from "react";


export default class ErdRouter extends React.Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route exact={true} path="/project" component={Project}></Route>
                    <Route path="/user" component={User}></Route>
                    <Route path="/role" component={Role}></Route>
                    <Route path="/permission" component={Permission}></Route>
                    <Route path="/loading" component={Loading}></Route>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/" component={Login}></Route>
                </Switch>
            </HashRouter>
        );
    }
}
