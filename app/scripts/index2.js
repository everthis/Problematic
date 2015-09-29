var layerTpl = '<span class="layer">' +
                  '<span class="leaf" data-key="" data-value="">' +
                      '<i class="remove-child" onclick="delChild(this)">-</i>' +
                      '<input type="text" class="leaf-key" placeholder="key" />' +
                      '<i>---</i>' +
                      '<input type="text" class="leaf-value" placeholder="value" />' +
                      '<i class="add-child" onclick="addChild(this)">+</i>' +
                      '<i class="add-sibling" onclick="addSibling(this)">+</i>' +
                  '</span>' +
              '</span>';

var leafTpl = '<span class="leaf" data-key="" data-value="">' +
                   '<i class="remove-child" onclick="delChild(this)">-</i>' +
                   '<input type="text" class="leaf-key" placeholder="key" />' +
                   '<i>---</i>' +
                   '<input type="text" class="leaf-value" placeholder="value" />' +
                   '<i class="add-child" onclick="addChild(this)">+</i>' +
                   '<i class="add-sibling" onclick="addSibling(this)">+</i>' +
              '</span>';

var $app = document.getElementById('app');
$app.innerHTML = layerTpl;
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
    console.log(ctx);
}
function addChild(ctx) {
    console.log(cl);

}
function addSibling(ctx) {
    var currentLayer = ctx.closest('.layer');
    var newLeaf = document.createDocumentFragment();
    newLeaf.innerHTML = leafTpl;
    currentLayer.appendChild(newLeaf);
}