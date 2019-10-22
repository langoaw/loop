
Hi! Here is the coding test back, below I outlined some assumptions I've made when coding this up. 
If any of them are wrong and you'd like me to correct them please let me know!


### `Assumptions`

Root can't be null. <br>
GROUP has unique membership (no duplicates within the graph). <br>
Users can have duplicates within the graph. <br>
Entity names for both users and groups are unique and can be used as dictionary key(s) (judged this off the 
wireframe)

### `Algorithms`
Since GROUP(S) are unique within the graph I've used a hashmap to keep track on whether a group
exists within the membership graph. This prevents traversing the nodes when an operation wouldn't
be feasible i.e trying to remove a group that doesn't exist in the graph.

The membership graph itself is modelled using a general tree. Each node has an array of children
nodes which contain an entity in the graph. The child nodes are sorted via the entity name allowing 
binary search to be ran on the children
nodes. This is tree is traversed with DFS to find a particular node containing an entity. 
If the tree was going to be wider I'd swap to BFS.

### `Testing`

Couldn't see any testing specified in the spec sheet, as such it currently only has the stubs for further testing.
Can add in if required.

### `To use`
Simply grab the repo and npm install then start.

