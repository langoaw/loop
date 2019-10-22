import * as React from 'react';
import ReactDOM from "react-dom";
import {IEntities, INode, Role} from "../Interfaces";
import {MembershipGraph} from "./MembershipGraph";

export const  entities: IEntities = {"GROUP 1" : {name: "GROUP 1", type: Role.GROUP}};
export const root : INode = {parent : null, children: [] as INode[], entity: entities["GROUP 1"]};

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MembershipGraph node={root}/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
