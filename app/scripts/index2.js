'use strict';
var leafContentTpl = '<i class="remove-child" onclick="delChild(this)">-</i>' +
                     '<input type="text" class="leaf-key" placeholder="key" />' +
                     '<i class="gap-mark">---</i>' +
                     '<input type="text" class="leaf-value" placeholder="value" />' +
                     '<i class="add-child" onclick="addChild(this)">+</i>' +
                     '<i class="add-sibling" onclick="addSibling(this)">+</i>';

var $app = document.getElementById('app');
$app.appendChild(createLayer());

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
    var currentLayer = ctx.closest('.layer');
    var currentLeaf = ctx.closest('.leaf');
    if (currentLayer.firstChild === currentLayer.lastChild) {
      $app.removeChild(currentLayer);
    } else {
      currentLayer.removeChild(currentLeaf);
    };
}
function addChild(ctx) {
    $app.appendChild(createLayer());
}

function createLayer() {
  var newLayer = document.createDocumentFragment();
  var newLayerSpan = document.createElement('span');
      newLayerSpan.setAttribute('class', 'layer');
      newLayerSpan.appendChild(generateLeafSpan());
      newLayer.appendChild(newLayerSpan);
  return newLayer;
}
function generateLeafSpan() {
  var newLeafSpan = document.createElement('span');
      newLeafSpan.setAttribute('class', 'leaf');
      newLeafSpan.setAttribute('data-key', "");
      newLeafSpan.setAttribute('data-value', "");
      newLeafSpan.innerHTML = leafContentTpl;
  return newLeafSpan;
}
function createLeaf() {
  var newLeaf = document.createDocumentFragment();
      newLeaf.appendChild(generateLeafSpan());
  return newLeaf;
}
function addSibling(ctx) {
    var currentLayer = ctx.closest('.layer');
    currentLayer.appendChild(createLeaf());
}