Tree.prototype.traverseDirectChild = function(nodeIdx) {
    var queue = new Queue(),
    parent = null,
    callback = function(node) {
        if (node.data === nodeIdx) {
            parent = node;
        }
    };

    this.contains(callback, apiTree.traverseBF);

    while(parent){
        for (var i = 0, length = parent.children.length; i < length; i++) {
            queue.enqueue(parent.children[i]);
        }
        callback(parent);
        parent = null;
    }
    return queue;
};

Tree.prototype.traverseDescendants = function(nodeIdx) {
    var queue = new Queue(),
        parent = null,
        callback = function(node) {
            if (node.data === nodeIdx) {
                parent = node;
            }
        };

    this.contains(callback, apiTree.traverseBF);

    queue.enqueue(parent);

    var currentTree = queue.dequeue();
    var descendantsArr = [];

    while(currentTree){
        descendantsArr.push(currentTree);
        for (var i = 0, length = currentTree.children.length; i < length; i++) {
            queue.enqueue(currentTree.children[i]);
        }

        currentTree = queue.dequeue();
    }

    return descendantsArr;
};