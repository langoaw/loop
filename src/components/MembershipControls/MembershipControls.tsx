import React, {Component} from "react";
import {Button} from "react-bootstrap";
import Select from 'react-dropdown-select';
import {IEntities, Role} from "../Interfaces";
import '../Shared.css';
import './MembershipSelection.css';

interface ISelectedOption {label: string, value: string}

interface IProps {
    entities: IEntities,
    addMembership: (memberName: string | null, groupName: string | null) => void;
    removeMembership: (memberName: string | null, groupName: string | null) => void;
}

interface IState {
    memberName : string | null,
    groupName : string | null
}

export class MembershipControls extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {memberName : null, groupName : null};
    }

    public handleMemberName = (value : object[]) => {
        const result = value[0] as ISelectedOption;
        this.setState({memberName: result.value});
    }

    public handleGroupName = (value : object[]) => {
        const result = value[0] as ISelectedOption;
        this.setState({groupName: result.value});
    }

    public render() {
        const entityNames = Object.keys(this.props.entities);
        const memberOptions = entityNames.map(key => ({value : key, label: key}));
        const groupOptions = entityNames.filter(key => this.props.entities[key].type === Role.GROUP).map(key => ({value : key, label: key}));

        return (
            <div className={"memberSelDiv"}>
                <div>
                    <label>Member:</label>
                    <label>Group:</label>
                </div>
                <div className={"memberSelInputs"}>
                    <div>
                        <Select onChange={this.handleMemberName} className={"select"} options={memberOptions} values={[]} placeholder={"Select Member"}/>
                    </div>
                    <div>
                        <Select onChange={this.handleGroupName} className={"select"} options={groupOptions} values={[]} placeholder={"Select Group"}/>
                    </div>

                        <Button variant={"primary"} onClick={this.addMembershipHandler}>Add</Button>
                        <Button variant={"danger"} onClick={this.removeMembershipHandler}>Remove</Button>
                </div>
            </div>
        );
    }

    private addMembershipHandler = () => {
        this.props.addMembership(this.state.memberName, this.state.groupName);
    }

    private removeMembershipHandler = () => {
        this.props.removeMembership(this.state.memberName, this.state.groupName);
    }
}