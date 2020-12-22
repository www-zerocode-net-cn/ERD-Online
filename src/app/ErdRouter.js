import {HashRouter, Route, Switch} from 'react-router-dom';
import Project from './Project';
import User from './system/User';
import Role from './system/Role';
import Permission from './system/Permission';
import Loading from './Loading';
import Login from './Login';
import React from "react";
import Swagger from "./api/Swagger";


export default class ErdRouter extends React.Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route key={"project"} exact={true} path="/project" component={Project}></Route>
                    <Route key={"swagger"} path="/swagger" component={Swagger}></Route>
                    <Route key={"user"} path="/user" component={User}></Route>
                    <Route key={"role"} path="/role" component={Role}></Route>
                    <Route key={"permission"} path="/permission" component={Permission}></Route>
                    <Route key={"loading"} path="/loading" component={Loading}></Route>
                    <Route key={"login"} path="/login" component={Login}></Route>
                    /*后续新增的路由都要放到home前面，不然无法加载*/
                    <Route key={"home"} path="/" component={Login}></Route>
                </Switch>
            </HashRouter>
        );
    }
}
