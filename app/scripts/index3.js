'use strict';
var leafContentTpl = '<i class="remove-child" onclick="delNode(this)">-</i>' +
                     '<input type="text" class="leaf-key" placeholder="key" />' +
                     '<i class="gap-mark">---</i>' +
                     '<input type="text" class="leaf-value" placeholder="value" />' +
                     '<i class="add-child" onclick="addChild(this)">+</i>' +
                     '<i class="add-sibling" onclick="addSibling(this)">+</i>';

var $app = document.getElementById('app');
var leafIndex = 1;
var apiTree = initApiTree();
var initRectObj = {
      right: 0,
      bottom: 0,
      left: 0,
      top: 0,
      width: 0,
      height: 0
};

$app.appendChild(createLeaf("_data_root", 1, 0, initRectObj));

function initApiTree() {
    var apiTree = new Tree("_root");
        apiTree.add({status: 0}, "_root", apiTree.traverseBF);
        apiTree.add({statusInfo: "OK"}, "_root", apiTree.traverseBF);
        apiTree.add("_data_root", "_root", apiTree.traverseBF);
        apiTree.add(1, "_data_root", apiTree.traverseBF);

    return apiTree;
} 

function delNode(ctx) {
    var currentLeaf = ctx.closest('.leaf');
    var currentIdx = +ctx.parentNode.dataset.index;
    var parentIdx = +ctx.parentNode.dataset.parent;

    var nodesArr = apiTree.traverseDescendants(currentIdx);
    var idxArr = nodesArrToIdxArr(nodesArr);
    console.log(idxArr);
        apiTree.remove(currentIdx, parentIdx, apiTree.traverseBF);
        removeNodesFromDom(idxArr);
        // $app.removeChild(currentLeaf);
}
function removeNodesFromDom(arr) {
    var allLeaves = $app.getElementsByClassName('leaf');
    for (var i = 0; i < allLeaves.length; i++) {
      if (arr.indexOf(+allLeaves[i].dataset.index) !== -1) {
          $app.removeChild(allLeaves[i]);
      }
    };
}
function nodesArrToIdxArr(nodesArr) {
    var nodesArrLen = nodesArr.length;
    var idxArr = [];
    for (var i = 0; i < nodesArrLen; i++) {
        idxArr.push(nodesArr[i].data);
    };
    return idxArr;
}
function addChild(ctx) {
    leafIndex += 1;
    var parentIdex = +ctx.parentNode.dataset.index;
    var nodeLevel = +ctx.parentNode.dataset.level + 1;
    
    // apiTree operation
    apiTree.add(leafIndex, parentIdex, apiTree.traverseBF);

    var clonedRectObj = cloneRectObj( nodeLeftOffset(ctx.parentNode) );
    var childrenNodes = apiTree.traverseDirectChild(parentIdex);

    var childrenIdxArr = [];
    for(var perNode in childrenNodes._storage){
      if ( (typeof parseInt(perNode) === "number") && childrenNodes._storage[perNode].hasOwnProperty('data')) {
          childrenIdxArr.push(childrenNodes._storage[perNode].data);
      };
    }

    var childrenIdxArrLen = childrenIdxArr.length;

    clonedRectObj.bottom = childrenIdxArrLen === 1 ? 
                           clonedRectObj.bottom + clonedRectObj.height * (childrenIdxArrLen - 2) :
                           clonedRectObj.bottom + clonedRectObj.height * (childrenIdxArrLen - 2) + (childrenIdxArrLen - 1) * 20;
    $app.appendChild(createLeaf(parentIdex, leafIndex, nodeLevel, clonedRectObj));




    // var maxIdx = Math.max(...childrenIdxArr);
    // console.log(maxIdx);
}

function generateLeafSpan(parentId, nodeIndex, nodeLevel, rectObj) {
  var newLeafSpan = document.createElement('span');
      newLeafSpan.setAttribute('class', 'leaf');
      newLeafSpan.setAttribute('data-parent', parentId);
      newLeafSpan.setAttribute('data-index', nodeIndex);
      newLeafSpan.setAttribute('data-level', nodeLevel);
      newLeafSpan.style.transform = 'translate(' + rectObj.right + 'px, ' + rectObj.bottom + 'px)';
      newLeafSpan.innerHTML = leafContentTpl;
  return newLeafSpan;
}
function createLeaf(parentIdx, nodeIdx, nodeLevel, rectObj) {
  var newLeaf = document.createDocumentFragment();
      newLeaf.appendChild(generateLeafSpan(parentIdx, nodeIdx, nodeLevel, rectObj));
  return newLeaf;
}
function addSibling(ctx) {
    leafIndex += 1;
    var parentIdx = +ctx.parentNode.dataset.parent;
    var nodeLevel = +ctx.parentNode.dataset.level;
    parentIdx = isNaN(parentIdx) ? "_data_root" : parentIdx;
    apiTree.add(leafIndex, parentIdx, apiTree.traverseBF);
    var rectObj = nodeLeftOffset(ctx.parentNode);
    var clonedRectObj = cloneRectObj(rectObj);
    clonedRectObj.right = clonedRectObj.right - clonedRectObj.width;
    clonedRectObj.bottom += 30;
    $app.appendChild(createLeaf(parentIdx, leafIndex, nodeLevel, clonedRectObj));
}

/* utils */
function cloneRectObj(obj) {
  return {
    top: obj.top,
    bottom: obj.bottom,
    left: obj.left,
    right: obj.right,
    width: obj.width,
    height: obj.height
  }
}
function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}


/* calculate offset */

function nodeLeftOffset(el) {
    var elRectObject = el.getBoundingClientRect();
    var bodyRectObj = document.body.getBoundingClientRect();
    var cloneBodyRectObj = cloneRectObj(bodyRectObj);
    var cloneElRectObject = cloneRectObj(elRectObject);
    cloneElRectObject.top += Math.abs(cloneBodyRectObj.top);
    cloneElRectObject.bottom += Math.abs(cloneBodyRectObj.top);
    cloneElRectObject.left += Math.abs(cloneBodyRectObj.left);
    cloneElRectObject.right += Math.abs(cloneBodyRectObj.left);
    return cloneElRectObject;
}

function getComputedTranslateY(obj) {
    if(!window.getComputedStyle) return;
    var style = getComputedStyle(obj),
        transform = style.transform || style.webkitTransform || style.mozTransform;
    var mat = transform.match(/^matrix3d\((.+)\)$/);
    if(mat) return parseFloat(mat[1].split(', ')[13]);
    mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
}
