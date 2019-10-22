import React, {Component} from "react";
import Alert from "react-bootstrap/Alert";
import {EntityControls} from "../EntityControls/EntityControls";
import {IEntities, IEntity, INode, Role} from "../Interfaces";
import {MembershipControls} from "../MembershipControls/MembershipControls";
import {MembershipGraph} from "../MembershipGraph/MembershipGraph";
import './ManagementDashboard.css';

interface IState {
    entities : IEntities,
    root : INode,
    showAlert : boolean,
    alertMessage : string | null,
    groupsInTree : IEntities
}

// Used when doing binary search on child nodes.
interface IFound {
    found: boolean,
    index: number
}

const entities : IEntities = {"GROUP 1" : {name: "GROUP 1", type: Role.GROUP},
    "GROUP 2" : {name: "GROUP 2", type: Role.GROUP},
    "GROUP 3" : {name: "GROUP 3", type: Role.GROUP},
    "GROUP 4" : {name: "GROUP 4", type: Role.GROUP},
    "GROUP 5" : {name: "GROUP 5", type: Role.GROUP},
    "USER 1" : {name: "USER 1", type: Role.USER},
    "USER 2" : {name: "USER 2", type: Role.USER},
    "USER 3" : {name: "USER 3", type: Role.USER},
    "USER 4" : {name: "USER 4", type: Role.USER},
    "USER 5" : {name: "USER 5", type: Role.USER},
    "USER 6" : {name: "USER 6", type: Role.USER},
    "USER 7" : {name: "USER 7", type: Role.USER}};

const startTree: Array<{member: string, group: string}> = [
    {member: "GROUP 2", group: "GROUP 1"},
    {member: "GROUP 3", group: "GROUP 1"},
    {member: "GROUP 4", group: "GROUP 1"},
    {member: "USER 1", group: "GROUP 2"},
    {member: "USER 2", group: "GROUP 2"},
    {member: "USER 3", group: "GROUP 3"},
    {member: "USER 4", group: "GROUP 3"},
    {member: "USER 5", group: "GROUP 4"},
    {member: "USER 6", group: "GROUP 4"},
];


export class ManagementDashboard extends Component<{}, IState> {

    constructor() {
        super({});
        this.state = {entities, root : {children: [] as INode[], entity: entities["GROUP 1"]},
            showAlert : false, alertMessage: null, groupsInTree: {}};
    }

    /**
     *  Sets up the initial state from the specs.
     */
    public componentDidMount(): void {
        const copyGroups : IEntities = this.state.groupsInTree;
        copyGroups["GROUP 1"] = entities["GROUP 1"];
        this.setState({
            groupsInTree: copyGroups,
        });
        for (const relationship of startTree) {
            this.attemptMemberAdd(relationship.member,relationship.group);
        }
    }

    public render() {
        return (
            <div>
                <div id={"banner"}>
                    <h1 id={"heading"}>Loop Membership Management </h1>
                </div>
                <div id={"membership"}>
                    <EntityControls  createFunc={this.addEntity} deleteFunc={this.removeEntity} />
                    <MembershipControls entities={this.state.entities} addMembership={this.attemptMemberAdd}
                                        removeMembership={this.attemptMemberRemove}/>
                    <MembershipGraph node={this.state.root}/>
                    <Alert className={"Alert"} onClose={() => this.setState({showAlert: false})} variant={"info"}
                           show={this.state.showAlert} dismissible={true}> {this.state.alertMessage}
                </Alert>
                </div>
            </div>
        );
    }

    /**
     *  Adds member or group to the list of entities
     */
    public addEntity = (name: string | null, type: Role | null) => {
        if (name === null || type === null) {
            this.setState({showAlert: true, alertMessage: "Input fields required!"});
            return;
        }

        const entity: IEntity = {
            name,
            type,
        };

        if (this.state.entities[name]) {
            this.setState({showAlert: true, alertMessage: "Entity already exists!"});
            return;
        }
        this.setState({
            entities: {...this.state.entities, [name]: entity},
            showAlert: true,
            alertMessage: "IEntity added!",
        });
        return;
    }

    /**
     *  Removes member or group from the list of entities
     */
    public removeEntity = (name: string | null) => {
        if (name === null) {
            this.setState({showAlert: true, alertMessage: "Input fields required!"});
            return;
        }

        if (this.findNode(this.state.root, this.state.entities[name])) {
            this.setState({showAlert: true, alertMessage: "Entity exists in the graph cant remove!"});
            return;
        }

        if (this.state.entities[name]) {
            const copyEntities: IEntities = {...this.state.entities};
            delete copyEntities[name];
            this.setState({entities: copyEntities, showAlert: true, alertMessage: "IEntity deleted!"});
        }
        else {
            this.setState({showAlert: true, alertMessage: "IEntity not found!"});
        }
    }

    /**
     *  Ensures a member and a group have been selected before adding them to tree
     */
    public attemptMemberAdd = (memberName: string | null, groupName: string | null) => {
        if (memberName === null || groupName === null) {
            this.setState({showAlert: true, alertMessage: "Must select member and a group for graph addition!"});
            return;
        }

        const memberEnt: IEntity = this.state.entities[memberName];
        if (memberEnt.type === Role.GROUP && this.state.groupsInTree[memberEnt.name]) {
            this.setState({showAlert: true, alertMessage: "Group already exists in graph!"});
            return;
        }

        const groupEnt: IEntity = this.state.entities[groupName];

        if (!this.addToTree(memberEnt, groupEnt)) {
            this.setState({showAlert: true, alertMessage: "Addition Operation Not Permitted!"});
        }
    }

    /**
     *  Ensures a member and a group have been selected before removing them from the tree.
     */
    public attemptMemberRemove = (memberName: string | null, groupName: string | null) => {
        if (memberName === null || groupName === null) {
            this.setState({showAlert: true, alertMessage: "Must select member and a group for graph deletion!"});
            return;
        }

        if (memberName === this.state.root.entity.name) {
            this.setState({showAlert: true, alertMessage: "Can't remove root!"});
            return;
        }

        const memberEnt: IEntity = this.state.entities[memberName];
        const groupEnt: IEntity = this.state.entities[groupName];

        if ((memberEnt.type === Role.GROUP && !this.state.groupsInTree[memberName])
            || !this.state.groupsInTree[groupName]) {
            this.setState({showAlert: true, alertMessage: "Group(s) not in tree, operation failed"});
            return;
        }

        if (!this.removeFromTree(memberEnt, groupEnt)) {
            this.setState({showAlert: true, alertMessage: "Deletion Operation Not Permitted!"});
        }
    }

    /**
     *  Adds member to the  tree by traversing the nodes
     *  @return whether the operation was successful.
     */
    public addToTree = (member: IEntity, group: IEntity) : boolean  => {
        const node : INode | null = this.findNode(this.state.root, group);
        if (node === null) {
            return false;
        }
        // Group we are adding to
        if (node.entity === group) {

            // Update the dict that keeps track of unique groups in the tree.
            if (member.type === Role.GROUP) {
                const copyGroups : IEntities = this.state.groupsInTree;
                copyGroups[member.name] = member;
                this.setState({
                    groupsInTree: copyGroups,
                });
            }

            const newNode: INode = {children: [] as INode[], entity: member};

            // Checks if member already apart of group
            const find : IFound = this.binarySearch(member, node.children);
            if (find.found) {
                return false;
            }
            // Otherwise add
            node.children.splice(find.index, 0, newNode);
            const copyRoot: INode = this.state.root;
            this.setState({root: copyRoot});
            return true;
        }
        return false;
    }

    /**
     *   Traverses the nodes via DFS to find one with a specified entity
     */
    public findNode = (node: INode, entity: IEntity) :INode | null => {
        if (node.entity === entity) {
            return node;
        }

        for (const child of node.children) {
            const tryNode : INode | null = this.findNode(child, entity);
            if(tryNode) {
                return tryNode;
            }
        }
        return null;
    }

    /**
     *  Removes member from tree by  traversing the nodes with group entities
     *  @return whether the operation was successful.
     */
    public removeFromTree = (member: IEntity, group: IEntity) : boolean => {
        const node : INode | null = this.findNode(this.state.root, group);
        if (node === null) {
            return false;
        }
        // If this is the group we are removing a member from
        if (node.entity === group) {

            const find : {found: boolean, index : number} = this.binarySearch(member, node.children);
            if (!find.found) {
                // Member isn't a subset of group so return
                return false;
            }

            // Removing group member
            if (member.type === Role.GROUP) {
                const nodeToRemove: INode = node.children[find.index];
                // Bring the children of the member being removed up to the parent (only if they don't exist in parent)
                if (nodeToRemove.children.length > 0) {
                    for (const child of nodeToRemove.children) {
                        const findChild : IFound = this.binarySearch(child.entity, node.children);
                        if (!findChild.found) {
                            node.children.splice(findChild.index, 0, child);
                        }
                    }
                }

                // Remove group from unique group in tree dict
                const copyGroupsInTree : IEntities = this.state.groupsInTree;
                delete copyGroupsInTree[member.name];
                this.setState({groupsInTree: copyGroupsInTree});
            }

            node.children.splice(find.index, 1);
            const copyRoot: INode = this.state.root;
            this.setState({root: copyRoot});
            return true;
        }
        return false;
    }

    /**
     *  Binary search for finding node in node array, if node isn't found the index position of where to insert to
     *  keep array sorted is returned.
     *  @return Object contains whether node was found and its position in the array.
     */
    private binarySearch = (entity : IEntity, nodeArray: INode[]) : IFound => {

        if (nodeArray.length === 0) {
            return {found: false, index: 0};
        }

        let minIndex = 0;
        let maxIndex = nodeArray.length - 1;
        let currentIndex = (minIndex + maxIndex) / 2 | 0;
        let currentElement : INode = nodeArray[currentIndex];

        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) / 2 | 0;
            currentElement = nodeArray[currentIndex];

            if (currentElement.entity.name < entity.name) {
                minIndex = currentIndex + 1;
            }
            else if (currentElement.entity.name > entity.name) {
                maxIndex = currentIndex - 1;
            }
            else {
                return {
                    found: true,
                    index: currentIndex,
                };
            }
        }

        return {
            found: false,
            index: (currentElement.entity.name < entity.name ? currentIndex + 1 : currentIndex),
        };
    }
}
