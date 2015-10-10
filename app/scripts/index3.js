'use strict';
var leafContentTpl = '<i class="remove-child" onclick="delChild(this)">-</i>' +
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

$app.appendChild(createLeaf("__root", 1, initRectObj));

function initApiTree() {
    var apiTree = new Tree("_root");
        apiTree.add({status: 0}, "_root", apiTree.traverseBF);
        apiTree.add({statusInfo: "OK"}, "_root", apiTree.traverseBF);
        apiTree.add("_data_root", "_root", apiTree.traverseBF);
        apiTree.add("__root", "_data_root", apiTree.traverseBF);
        apiTree.add(1, "__root", apiTree.traverseBF);

    return apiTree;
} 

function delChild(ctx) {
    var currentLeaf = ctx.closest('.leaf');
        $app.removeChild(currentLeaf);
}
function addChild(ctx) {
    leafIndex += 1;
    var parentIdex = +ctx.parentNode.dataset.index;
    apiTree.add(leafIndex, parentIdex, apiTree.traverseBF);
    var rectObj = nodeLeftOffset(ctx.parentNode);
    var clonedRectObj = cloneRectObj(rectObj);
    clonedRectObj.bottom = clonedRectObj.bottom - clonedRectObj.height;
    $app.appendChild(createLeaf(parentIdex, leafIndex, clonedRectObj));
}

function generateLeafSpan(parentId, nodeIndex, rectObj) {
  var newLeafSpan = document.createElement('span');
      newLeafSpan.setAttribute('class', 'leaf');
      newLeafSpan.setAttribute('data-parent', parentId);
      newLeafSpan.setAttribute('data-index', nodeIndex);
      newLeafSpan.style.transform = 'translate(' + rectObj.right + 'px, ' + rectObj.bottom + 'px)';
      newLeafSpan.innerHTML = leafContentTpl;
  return newLeafSpan;
}
function createLeaf(parentIdx, nodeIdx, rectObj) {
  var newLeaf = document.createDocumentFragment();
      newLeaf.appendChild(generateLeafSpan(parentIdx, nodeIdx, rectObj));
  return newLeaf;
}
function addSibling(ctx) {
    leafIndex += 1;
    var parentIdx = +ctx.parentNode.dataset.parent;
    parentIdx = isNaN(parentIdx) ? "__root" : parentIdx;
    apiTree.add(leafIndex, parentIdx, apiTree.traverseBF);
    var rectObj = nodeLeftOffset(ctx.parentNode);
    var clonedRectObj = cloneRectObj(rectObj);
    clonedRectObj.right = clonedRectObj.right - clonedRectObj.width;
    clonedRectObj.bottom += 30;
    $app.appendChild(createLeaf(parentIdx, leafIndex, clonedRectObj));
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

