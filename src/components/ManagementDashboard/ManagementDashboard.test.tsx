import * as React from 'react';
import ReactDOM from "react-dom";
import {ManagementDashboard} from "./ManagementDashboard";

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ManagementDashboard />, div);
    ReactDOM.unmountComponentAtNode(div);
});