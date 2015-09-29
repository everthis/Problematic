'use strict';
var leafContentTpl = '<i class="remove-child" onclick="delChild(this)">-</i>' +
                     '<input type="text" class="leaf-key" placeholder="key" />' +
                     '<i class="gap-mark">---</i>' +
                     '<input type="text" class="leaf-value" placeholder="value" />' +
                     '<i class="add-child" onclick="addChild(this)">+</i>' +
                     '<i class="add-sibling" onclick="addSibling(this)">+</i>';

var $app = document.getElementById('app');
$app.appendChild(createLayer());
// $app.addEventListener('click', listener)

function closest(el, selector) {
    var matchesFn;

    // find vendor prefix
    ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
        if (typeof document.body[fn] == 'function') {
            matchesFn = fn;
            return true;
        }
        return false;
    })

    // traverse parents
    while (el!==null) {
        parent = el.parentElement;
        if (parent!==null && parent[matchesFn](selector)) {
            return parent;
        }
        el = parent;
    }

    return null;
}

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