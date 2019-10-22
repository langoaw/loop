import React, {ChangeEvent, Component} from "react";
import Button from 'react-bootstrap/Button';
import Select from 'react-dropdown-select';
import {Role} from '../Interfaces';
import '../Shared.css';
import './EntityControls.css';


interface IProps {
    createFunc: (name: string | null, role: Role | null) => void;
    deleteFunc: (name: string | null, role: Role | null) => void;
}


interface IState {
    name: string | null,
    type: Role | null,
}

interface ISelectedOption {label: string, value: Role}


export class EntityControls extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {name : null, type : null};
    }

    public handleName = (e : ChangeEvent<HTMLInputElement>) => {
        this.setState({name: e.target.value.toString()});
    }

    public handleRole = (value : Object[]) => {
        const result = value[0] as ISelectedOption;
        this.setState({type: result.value === Role.GROUP ? Role.GROUP : Role.USER});
    }

    public render() {
        return (
           <div className={"entityControlDiv"}>
               <div>
                   <label>Name: </label>
                   <label>Type: </label>
               </div>
               <div className={"entityInputDiv"}>
                   <input type="text" onChange={this.handleName}/>
                   <div>
                        <Select className={"select"} options={[{label: "User", value: Role.USER},
                            {label: "Group", value: Role.GROUP}] as Object[]}
                                values={[]} placeholder={"Role"} onChange={this.handleRole}/>
                   </div>
                   <Button variant={"primary"} onClick={this.addEntityHandler}>Create</Button>
                   <Button variant= {"danger"} onClick={this.removeEntityHandler}>Delete</Button>
               </div>
           </div>
        );
    }

    private addEntityHandler = () => {
        this.props.createFunc(this.state.name, this.state.type);
    }

    private removeEntityHandler = () => {
        this.props.deleteFunc(this.state.name, this.state.type);
    }
}