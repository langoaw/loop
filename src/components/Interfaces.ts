// Entity itself containing name and role.
export interface IEntity {
    name: string,
    type: Role
}

// Where the reference to all entities are stored when adding and deleting them
export interface IEntities {
     [name: string] : IEntity
}

// Each role a entity can have
export enum Role {
    GROUP = "Group",
    USER = "User",
}

// Tree node, consisting of entity and children
export interface INode {
    children: INode[],
    entity: IEntity
}