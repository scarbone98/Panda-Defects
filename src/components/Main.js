import React from "react";
import { Switch, Route } from 'react-router-dom'
import Login from "../views/Login";
import Top from "../views/Top";
import Newest from "../views/Newest"
import Favorites from "../views/Favorites"
import Settings from "../views/Settings"
import Comments from "../views/Comments"
import PageNotFound from "../views/PageNotFound"

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={Login}/>
            <Route path='/top' component={Newest}/>
            <Route path='/newest' component={Top}/>
            <Route path='/favorites' component={Favorites}/>
            <Route path='/settings' component={Settings}/>
            <Route path='/comments' component={Comments}/>
            <Route path='*' exact={true} component={PageNotFound}/>
        </Switch>
    </main>
);
export default Main