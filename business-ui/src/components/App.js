import AppBar from './dashboard/Appbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import BacktoTop from './dashboard/BacktoTop';
import Paper from '@material-ui/core/Paper';
import AboutUs from './dashboard/AboutUs';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const handleClick = (event) => {
  const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

  if (anchor) {
    anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

function App() {
  return (
    <div className="App">
      
      <Router>
        <div>
          <AppBar id="back-to-top-anchor" />
        </div>
        <div>
          <Switch>
              <Route exact path='/' />
              <Route path='/AboutUs' component={AboutUs} />
              {/* <Route path='/Content' component={Content} /> */}
          </Switch>
        </div>
      </Router>
      
    </div>
  );
}

export default App;
