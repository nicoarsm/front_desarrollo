import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import SignIn from './vistas/Login';
import MenuPrincipal from './vistas/MenuTabs';
import axios from 'axios';

export default function App() {
  const [autorizado, setAutorizado] = useState(false);
  const [remember, setRemember] = useState(false);


  


  return (



    <Router>
      {remember ? <Redirect to="/menu"/> :""}


      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>


        <Route path="/menu">
           <MenuPrincipal /> 
        </Route>
        <Route path="/">
          <SignIn />
        </Route>


      </Switch>

    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}