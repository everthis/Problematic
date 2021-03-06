/**
 * [Tree description]
 * @param {[type]} data [description]
 *
 * _root points to the root node of a tree.
 * traverseDF(callback) traverses nodes of a tree with DFS.
 * traverseBF(callback) traverses nodes of a tree with BFS.
 * contains(data, traversal) searches for a node in a tree.
 * add(data, toData, traverse) adds a node to a tree.
 * remove(child, parent) removes a node in a tree.
 *
 */
import {Queue} from './queue';
export function Tree(data) {
  var node = new Node(data);
  this._root = node;
}

function Node(data) {
  this.data = data;
  this.parent = null;
  this.children = [];
  // added later
  this.childrenlevel = 1;
  this.column = 0;
  this.totaloffsetylevel = 0;
}

Tree.prototype.traverseDF = function(callback) {

  // this is a recurse and immediately-invoking function
  (function recurse(currentNode) {
    // step 2
    for (var i = 0, length = currentNode.children.length; i < length; i++) {
      // step 3
      recurse(currentNode.children[i]);
    }

    // step 4
    callback(currentNode);

    // step 1
  })(this._root);

};

// for those nodes who have children
function calcChildrenLevels(node) {
  var totalChildrenLevels = 0;
  for (var i = 0; i < node.children.length; i++) {
    totalChildrenLevels += node.children[i].childrenlevel;
  };
  return totalChildrenLevels;
}
Tree.prototype.calcChildrenLevel = function() {
  var callback = function(node) {
    node.childrenlevel = node.children.length > 0 ? calcChildrenLevels(node) : 1;
    node.column = node.parent ? (node.parent.column + 1) : 0;
  };

  this.traverseDF(callback);
};

function calcOffY(arr, data) {
  var nodeIdx = findIndex(arr, data);
  var totalY = 0;
  for (var i = 0; i < nodeIdx; i++) {
    totalY += arr[i].childrenlevel;
  };
  return totalY;
}

Tree.prototype.calcTotalOffsetYLevel = function() {
  var levelgap = 0;
  var callback = function(node) {
    if (node.parent) {
      node.totaloffsetylevel = node.parent.totaloffsetylevel + calcOffY(node.parent.children, node.data);
    } else if (node.parent === null) {

    };
  };

  this.traverseBF(callback);

};

Tree.prototype.traverseBF = function(callback) {
  var queue = new Queue();

  queue.enqueue(this._root);

  var currentTree = queue.dequeue();

  while (currentTree) {
    for (var i = 0, length = currentTree.children.length; i < length; i++) {
      queue.enqueue(currentTree.children[i]);
    }

    callback(currentTree);
    currentTree = queue.dequeue();
  }
};

Tree.prototype.contains = function(callback, traversal) {
  traversal.call(this, callback);
};

Tree.prototype.add = function(data, toData, traversal) {
  var child = new Node(data),
      parent = null,
        callback = function(node) {
          if (node.data === toData) {
            parent = node;
          }
        };

  this.contains(callback, traversal);

  if (parent) {
    parent.children.push(child);
    child.parent = parent;
  } else {
    throw new Error('Cannot add node to a non-existent parent.');
  }

  this.calcChildrenLevel();
  this.calcTotalOffsetYLevel();
};

Tree.prototype.remove = function(data, fromData, traversal) {
  var tree = this,
      parent = null,
      childToRemove = null,
      index;

  var callback = function(node) {
    if (node.data === fromData) {
      parent = node;
    }
  };

  this.contains(callback, traversal);

  if (parent) {
    index = findIndex(parent.children, data);

    if (index === undefined) {
      throw new Error('Node to remove does not exist.');
    } else {
      childToRemove = parent.children.splice(index, 1);
    }
  } else {
    throw new Error('Parent does not exist.');
  }

  this.calcChildrenLevel();
  this.calcTotalOffsetYLevel();

  return childToRemove;
};

function findIndex(arr, data) {
  var index;

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].data === data) {
      index = i;
    }
  }

  return index;
}

/* tree addon*/

Tree.prototype.traverseDirectChild = function(nodedata) {
  var queue = new Queue(),
  parent = null,
    callback = function(node) {
      if (node.data === nodedata) {
        parent = node;
      }
    };

  this.contains(callback, this.traverseBF);

  while (parent) {
    for (var i = 0, length = parent.children.length; i < length; i++) {
      queue.enqueue(parent.children[i]);
    }
    callback(parent);
    parent = null;
  }
  return queue;
};
Tree.prototype.applyStyle = function() {
  var styleObj = {};
  var callback = function(node) {
    styleObj[node.data] = node.totaloffsetylevel;
  };
  this.traverseBF(callback);

  return styleObj;
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

  this.contains(callback, this.traverseBF);

  queue.enqueue(parent);

  var currentTree = queue.dequeue();
  var descendantsArr = [];

  while (currentTree) {
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
  for (var drn in dataRootNodes._storage) {
    if (dataRootNodes._storage.hasOwnProperty(drn)) {
      rowLevelObj[drn] = {};
      rowLevelObj[drn]['head-idx'] = dataRootNodes._storage[drn].data;
      headIdxArr.push(dataRootNodes._storage[drn].data);
    };
  }

  function extractIdxFromQueue(queue) {
    var childrenIdxArr = [];
    for (var perNode in queue._storage) {
      if ((typeof parseInt(perNode) === 'number') && queue._storage[perNode].hasOwnProperty('data')) {
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
};
