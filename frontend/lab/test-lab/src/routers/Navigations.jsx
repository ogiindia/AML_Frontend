import {
  HashRouter,
  Route,
  Routes
} from 'react-router-dom';
import Login from '../login/login';
import Home from '../pages/Home';
import KbaPage from "../pages/KbaPage";
import OtpPage from "../pages/OtpPage";
import TOTPPage from "../pages/TOTP";

function Navigations() {

  return (
    <>
      <HashRouter>
        <Routes basename={'/ngpdev/ais'}>
          <Route exact path="/" Component={Login} />
          <Route exact path="/login" Component={Login} />
          <Route exact path="/home" Component={Home} />
          <Route exact path="/verifyOtp" Component={OtpPage} />
          <Route exact path="/kba" Component={KbaPage} />
          <Route exact path="/verifyTotp" Component={TOTPPage} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default Navigations;
