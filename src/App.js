import React, { useEffect } from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import store from "./store";
import Boards from "./pages/Boards";
import CreatePlayer from "./pages/CreatePlayer";
import Game from "./pages/Game";
import { register, setAPIKey } from "./store/actions/authActions";

function App() {
  useEffect(() => {
    const key = localStorage.getItem("apikey");
    if (!key) {
      store.dispatch(register());
    } else {
      store.dispatch(setAPIKey(key));
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={CreatePlayer} />
          <Route path="/boards" exact component={Boards} />
          <Route path="/game/:board_id" exact component={Game} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
