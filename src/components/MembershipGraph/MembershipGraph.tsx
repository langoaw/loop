import React, {Component} from "react";
import {Badge} from "react-bootstrap";
import {INode, Role} from "../Interfaces";
import './MembershipGraph.css';

interface IProps {
    node : INode;
}

export class MembershipGraph extends Component<IProps> {
    public render() {
        return (<div className={"marginGraph"}>
            <h3>Membership Graph</h3>{this.generateGraph(this.props.node, 0)}</div>);
    }

    public generateGraph(node :INode, depth: number) {
        return ( <div style={{paddingLeft: depth}} key={node.entity.name}>
                    <Badge pill={true} variant={"primary"} className={"member"}>{node.entity.name}</Badge>
                    {this.generateUserChildren(node.children, 100)}
            {node.children.filter(x=> x.entity.type === Role.GROUP).map(x=> this.generateGraph(x, 100))}
                 </div>);
    }

    public generateUserChildren(nodes :INode[], depth: number) {
        return (nodes.filter(child=>child.entity.type === Role.USER).map(child =>
            (<div style={{paddingLeft: depth}} key={child.entity.name}>
                <Badge pill={true} variant={"secondary"}>{child.entity.name}</Badge></div>)));
    }
}