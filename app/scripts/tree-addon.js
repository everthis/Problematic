Tree.prototype.traverseDirectChild = function(nodedata) {
    var queue = new Queue(),
    parent = null,
    callback = function(node) {
        if (node.data === nodedata) {
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
Tree.prototype.applyStyle = function(){
    var styleObj = {};
    var callback = function(node) {
        styleObj[node.data] = node.totaloffsetylevel;
    };
    this.traverseBF(callback);

    return styleObj;
};
Tree.prototype.traversePostOrder = function(){
        // foreach n in node.children
        //     post_order(n)
        // print(node.text)
};
/**
 * [traverseDescendants description]
 * @param  {[integer]} nodeData [description]
 * @return {[array]}         [description]
 */
Tree.prototype.traverseDescendants = function(nodeData) {
    var queue = new Queue(),
        parent = null,
        callback = function(node) {
            if (node.data === nodeData) {
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

Tree.prototype.maxLevels = function() {
    var that = this;
    var dataRootNodes = this.traverseDirectChild('_data_root');
    var rowLevelObj = {};
    var headIdxArr = [];
    for(var drn in dataRootNodes._storage){
        if (dataRootNodes._storage.hasOwnProperty(drn)) {
            rowLevelObj[drn] = {};
            rowLevelObj[drn]['head-idx'] = dataRootNodes._storage[drn].data;
            headIdxArr.push(dataRootNodes._storage[drn].data);
        };
    }

    function extractIdxFromQueue(queue) {
        var childrenIdxArr = [];
        for(var perNode in queue._storage) {
          if ( (typeof parseInt(perNode) === "number") && queue._storage[perNode].hasOwnProperty('data')) {
              childrenIdxArr.push(queue._storage[perNode].data);
          };
        }
        return childrenIdxArr;
    }

    var levelNextColArr = [];

    function getRowLevel(idx) {
       var directChildrenQueue = that.traverseDirectChild(idx);
       var directChildrenArr = extractIdxFromQueue(directChildrenQueue);
       return directChildrenArr;
    }

    var ultimateArr = [];
    var perHead = [];

    function nextLevelChildren(arr) {
        var nextLevelChildrenArr = [];
        for (var i = 0; i < arr.length; i++) {
            var perNum = getRowLevel(arr[i]);
            nextLevelChildrenArr = nextLevelChildrenArr.concat(perNum);
        };
        if (nextLevelChildrenArr.length) {
            perHead.push(nextLevelChildrenArr.length);
            nextLevelChildren(nextLevelChildrenArr);
        };
    }



    (function recurse(arr) {

        for (var i = 0; i < arr.length; i++) {
            perHead = [];
            // level 1
            levelNextColArr = getRowLevel(arr[i]);
            perHead.push(1);
            if (levelNextColArr.length) {
                perHead.push(levelNextColArr.length);
                nextLevelChildren(levelNextColArr);
            };
            ultimateArr.push(perHead);
        };
    })(headIdxArr);

    return ultimateArr;
}