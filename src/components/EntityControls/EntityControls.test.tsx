import * as React from 'react';
import ReactDOM from "react-dom";
import App from "../../App";
import {EntityControls} from "./";


it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<EntityControls createFunc={jest.fn()} deleteFunc={jest.fn()}/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
