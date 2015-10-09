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

$app.appendChild(createLeaf("__root", 1));

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
    $app.appendChild(createLeaf(parentIdex, leafIndex));
}

function generateLeafSpan(parentId, nodeIndex) {
  var newLeafSpan = document.createElement('span');
      newLeafSpan.setAttribute('class', 'leaf');
      newLeafSpan.setAttribute('data-key', "");
      newLeafSpan.setAttribute('data-parent', parentId);
      newLeafSpan.setAttribute('data-index', nodeIndex);
      newLeafSpan.setAttribute('data-value', "");
      newLeafSpan.innerHTML = leafContentTpl;
  return newLeafSpan;
}
function createLeaf(parentIdx, nodeIdx) {
  var newLeaf = document.createDocumentFragment();
      newLeaf.appendChild(generateLeafSpan(parentIdx, nodeIdx));
  return newLeaf;
}
function addSibling(ctx) {
    leafIndex += 1;
    var parentIdx = +ctx.parentNode.dataset.parent;
    parentIdx = isNaN(parentIdx) ? "__root" : parentIdx;
    apiTree.add(leafIndex, parentIdx, apiTree.traverseBF);
    $app.appendChild(createLeaf(parentIdx, leafIndex));
}

/* utils */
function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}

/* calculate offset */

function nodeLeftOffset(el) {
    var rectObject = el.getBoundingClientRect();

    console.log(rectObject);

    return rectObject;
}

(function() {
  $app.addEventListener('click', listener);

  function listener(ev) {
    var leaves = ev.currentTarget.getElementsByClassName('leaf');
    var triggerEle;

      if ( hasClass( ev.target, 'add-child' ) ) {  
        triggerEle =  ev.target.parentNode;        
      } else if ( hasClass( ev.target, 'add-sibling' ) ) {
        triggerEle =  ev.target.parentNode;        
      }   

    nodeLeftOffset(triggerEle);
  }
})();
