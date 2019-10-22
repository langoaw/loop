import * as React from 'react';
import ReactDOM from "react-dom";
import {IEntities, Role} from "../Interfaces";
import {MembershipControls} from "./MembershipControls";

export const  entities: IEntities = {"GROUP 1" : {name: "GROUP 1", type: Role.GROUP}};

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MembershipControls entities={entities} addMembership={jest.fn()} removeMembership={jest.fn()}/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
