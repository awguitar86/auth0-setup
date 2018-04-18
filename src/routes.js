import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard'
import Login from './components/Login/Login'
export default _ => (
    <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
    </Switch>
)