'use strict';
var leafContentTpl = '<i class="remove-child" onclick="delChild(this)">-</i>' +
                     '<input type="text" class="leaf-key" placeholder="key" />' +
                     '<i class="gap-mark">---</i>' +
                     '<input type="text" class="leaf-value" placeholder="value" />' +
                     '<i class="add-child" onclick="addChild(this)">+</i>' +
                     '<i class="add-sibling" onclick="addSibling(this)">+</i>';

var $app = document.getElementById('app');
var leafIndex = 0;
$app.appendChild(createLeaf(null, 0));

var apiTree = initApiTree();
function initApiTree() {
    var apiTree = new Tree("_root");
    apiTree.add({status: 0}, "_root", apiTree.traverseBF);
    apiTree.add({statusInfo: "OK"}, "_root", apiTree.traverseBF);
    apiTree.add("_data_root", "_root", apiTree.traverseBF);
    apiTree.add(0, "_data_root", apiTree.traverseBF);
    return apiTree;

} 


// matches polyfill
window.Element && function(ElementPrototype) {
    ElementPrototype.matches = ElementPrototype.matches ||
    ElementPrototype.matchesSelector ||
    ElementPrototype.webkitMatchesSelector ||
    ElementPrototype.msMatchesSelector ||
    function(selector) {
        var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
        while (nodes[++i] && nodes[i] != node);
        return !!nodes[i];
    }
}(Element.prototype);

// closest polyfill
window.Element && function(ElementPrototype) {
    ElementPrototype.closest = ElementPrototype.closest ||
    function(selector) {
        var el = this;
        while (el.matches && !el.matches(selector)) el = el.parentNode;
        return el.matches ? el : null;
    }
}(Element.prototype);

function delChild(ctx) {
    var currentLeaf = ctx.closest('.leaf');
        $app.removeChild(currentLeaf);
}
function addChild(ctx) {
    leafIndex += 1;
    var parentIdex = +ctx.parentNode.dataset.index;
    apiTree.add(leafIndex, parentIdex, apiTree.traverseBF);
    console.log(apiTree);
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
    var parentIdex = +ctx.parentNode.dataset.index;
    apiTree.add(leafIndex, parentIdex, apiTree.traverseBF);
    console.log(apiTree);
    $app.appendChild(createLeaf(parentIdex, leafIndex));
}