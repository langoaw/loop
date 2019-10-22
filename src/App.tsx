import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import {ManagementDashboard} from "./components/ManagementDashboard/ManagementDashboard";

class App extends React.Component{

  public render() {
      return (
          <div>
              <ManagementDashboard/>
          </div>
      );
  }
}

export default App;
