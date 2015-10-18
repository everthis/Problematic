'use strict';
// var leafContentTpl = '<i class="remove-child" onclick="delNode(this)">-</i>' +
//                      '<input type="text" class="leaf-key" placeholder="key" />' +
//                      '<i class="gap-mark">---</i>' +
//                      '<input type="text" class="leaf-value" placeholder="value" />' +
//                      '<i class="add-child" onclick="addChild(this)">+</i>' +
//                      '<i class="add-sibling" onclick="addSibling(this)">+</i>';

var leafContentTpl = '<i class="remove-child" onclick="delNode(this)">-</i>' +
                     '<input type="text" class="leaf-key" placeholder="key" />' +
                     '<i class="gap-mark">---</i>' +
                     '<input type="text" class="leaf-value" placeholder="value" />' +
                     '<i class="add-child" onclick="addChild(this)">+</i>';


var $apiTree = document.getElementsByClassName('api-tree')[0];
var leafIndex = 1;
var apiTree = initApiTree();
var dimensionArr = calcDimensions();
initSVG();
var initRectObj = {
      right: 0,
      bottom: 0,
      left: 0,
      top: 0,
      width: 0,
      height: 0
};

$apiTree.appendChild(createLeaf("_data_root", 1, 0, initRectObj));

function addDataRootChild() {
    var addMark = document.createElement('span');
    addMark.className = "add-dataroot-child";
    addMark.textContent = "+";
    addMark.addEventListener('click', function(ev) {
      leafIndex += 1;
      var parentIdx = "_data_root";
      var nodeLevel = 0;
      apiTree.add(leafIndex, parentIdx, apiTree.traverseBF);

      $apiTree.appendChild(createLeaf(parentIdx, leafIndex, nodeLevel, initRectObj));
      var obj = apiTree.applyStyle();
      styleNodes(obj);


    });
    $apiTree.appendChild(addMark);
}

function initSVG() {
   var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
   svg.setAttributeNS(null, "width", dimensionArr[0] * 520 + "px");
   svg.setAttributeNS(null, "height", dimensionArr[1] * 52 + "px");
   svg.setAttribute('class', 'api-svg');
   document.getElementsByClassName('api-tree')[0].appendChild(svg);
}

function initApiTree() {
    var apiTree = new Tree("_data_root");
        apiTree.add(1, "_data_root", apiTree.traverseBF);
    addDataRootChild();

    return apiTree;
} 

function delNode(ctx) {
    var currentLeaf = ctx.closest('.leaf');
    var currentIdx = +ctx.parentNode.dataset.index;
    var parentIdx = isNaN(+ctx.parentNode.dataset.parent) ? "_data_root" : +ctx.parentNode.dataset.parent;

    var nodesArr = apiTree.traverseDescendants(currentIdx);
    var idxArr = nodesArrToIdxArr(nodesArr);
        apiTree.remove(currentIdx, parentIdx, apiTree.traverseBF);
        removeNodesFromDom(idxArr);

    var obj = apiTree.applyStyle();
        styleNodes(obj);
        // $apiTree.removeChild(currentLeaf);
}
function removeNodesFromDom(arr) {
    var allLeaves = Array.prototype.slice.call($apiTree.getElementsByClassName('leaf'));
    var allLeavesLen = allLeaves.length;
    for (var i = 0; i < allLeavesLen; i++) {
        if (arr.indexOf(+allLeaves[i].dataset.index) !== -1) {
          $apiTree.removeChild(allLeaves[i]);
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

function queueNodesToArr(queue) {
  var childrenIdxArr = [];
  for(var perNode in queue._storage){
    if ( (typeof parseInt(perNode) === "number") && queue._storage[perNode].hasOwnProperty('data')) {
        childrenIdxArr.push(queue._storage[perNode].data);
    };
  }
  return childrenIdxArr;
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

    clonedRectObj.right -= 30;

    clonedRectObj.bottom = childrenIdxArrLen === 1 ? 
                           clonedRectObj.bottom + clonedRectObj.height * (childrenIdxArrLen - 2) :
                           clonedRectObj.bottom + clonedRectObj.height * (childrenIdxArrLen - 2) + (childrenIdxArrLen - 1) * 20;
    $apiTree.appendChild(createLeaf(parentIdex, leafIndex, nodeLevel, clonedRectObj));
    var obj = apiTree.applyStyle();
    styleNodes(obj);

    // var maxIdx = Math.max(...childrenIdxArr);
    // console.log(maxIdx);
}

function generateLeafSpan(parentId, nodeIndex, nodeLevel, rectObj) {
  var newLeafSpan = document.createElement('span');
      newLeafSpan.setAttribute('class', 'leaf');
      newLeafSpan.setAttribute('data-parent', parentId);
      newLeafSpan.setAttribute('data-index', nodeIndex);
      newLeafSpan.setAttribute('data-level', nodeLevel);
      newLeafSpan.style["transform"] = 'translate3d(' + Math.round(rectObj.right) + 'px, ' + Math.round(rectObj.bottom) + 'px, 0)';
      newLeafSpan.innerHTML = leafContentTpl;
  return newLeafSpan;
}
function createLeaf(parentIdx, nodeIdx, nodeLevel, rectObj) {
  var newLeaf = document.createDocumentFragment();
      newLeaf.appendChild(generateLeafSpan(parentIdx, nodeIdx, nodeLevel, rectObj));
  return newLeaf;
}
function styleNodes(styleObj) {
    var leaves = Array.prototype.slice.call($apiTree.getElementsByClassName('leaf'));
    var leafIdx, offsetY, originalX;

    for (var i = 0; i < leaves.length; i++) {
        originalX = getTranslateX(leaves[i]);
        leafIdx = +(leaves[i].dataset.index);

        for(var styleObjIdx in styleObj){
            if (+styleObjIdx === leafIdx) {
              offsetY = styleObj[styleObjIdx] * 52;
            };
        }
        leaves[i].style["transform"] = 'translate3d(' + originalX + 'px, ' + offsetY + 'px, 0)';
    };
        dimensionArr = calcDimensions();
        drawSVG();
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
    $apiTree.appendChild(createLeaf(parentIdx, leafIndex, nodeLevel, clonedRectObj));
    var obj = apiTree.applyStyle();
    styleNodes(obj);

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

/* draw SVG */
function clearSVG() {
  var svg = document.getElementsByClassName("api-svg")[0];
  while (svg.lastChild) {
      svg.removeChild(svg.lastChild);
  }
}

function drawSVG() {
  clearSVG();
  var callback = function(node) {
    if (node.parent !== null) {
      drawSingleSVG(node.data, node.column, node.parent.totaloffsetylevel, (node.totaloffsetylevel - node.parent.totaloffsetylevel));
    };
  };
  apiTree.traverseDF(callback);
}


function drawSingleSVG(idx, hori, parentVert, dvert) {
   var svg = document.getElementsByClassName("api-svg")[0];
   svg.setAttributeNS(null, "width", dimensionArr[0] * 520 + "px");
   svg.setAttributeNS(null, "height", dimensionArr[1] * 52 + "px");
   var svgns = "http://www.w3.org/2000/svg";
   var newPath = document.createElementNS(svgns, "path");
   var controlRate = 0.2;
   var mx, my, qx, qy, qxx, qyy, tx, ty;
   hori = hori - 1;
   dvert = dvert;
   parentVert = parentVert;

   mx = hori * 501;
   my = parentVert * 52 + 12;
   qx = mx + 10;
   qy = my;
   qxx = mx + 15;
   qyy = (my + (dvert / 2) * 52);
   tx = mx + 30;
   ty = my + dvert * 52;

   newPath.setAttributeNS(null, "d", "M " + mx + " " + my + " Q " + qx + " " + qy + ", " +
                                     qxx + " " + qyy + " T " + 
                                     tx + " " + ty + "");
   newPath.setAttribute('class', "api-svg-path");
   newPath.setAttribute('data-idx', idx);
   svg.appendChild(newPath);
}

/* calculate dimensions */
function calcDimensions() {
  var dimensionArr = apiTree.maxLevels();
  var horiMax, verticalMax, horiArr = [], vertArr = [];
  for (var i = 0, x = dimensionArr.length; i < x; i++) {
    horiArr.push(dimensionArr[i].length);
    // vertArr.push(Math.max.apply(null, dimensionArr[i]));
  };
  horiMax = Math.max.apply(null, horiArr);
  // verticalMax = vertArr.reduce(function(a, b) {
  //   return a + b;
  // });
  verticalMax = apiTree._root.childrenlevel;
  document.getElementsByClassName('api-tree')[0].style.width = horiMax * 520 + "px";
  document.getElementsByClassName('api-tree')[0].style.height = verticalMax * 52 + "px";
  return [horiMax, verticalMax];

}


/* calculate offset */

function nodeLeftOffset(el) {
    var elRectObject = el.getBoundingClientRect();
    // var bodyRectObj = document.body.getBoundingClientRect();
    var bodyRectObj = document.getElementsByClassName('api-tree')[0].getBoundingClientRect();
    var cloneBodyRectObj = cloneRectObj(bodyRectObj);
    var cloneElRectObject = cloneRectObj(elRectObject);
    cloneElRectObject.top += Math.abs(cloneBodyRectObj.top);
    cloneElRectObject.bottom += Math.abs(cloneBodyRectObj.top);
    cloneElRectObject.left += Math.abs(cloneBodyRectObj.left);
    cloneElRectObject.right += Math.abs(cloneBodyRectObj.left);
    return cloneElRectObject;
}

function getTransform(el) {
    var transform = window.getComputedStyle(el, null).getPropertyValue('-webkit-transform');
    var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);

    if(!results) return [0, 0, 0];
    if(results[1] == '3d') return results.slice(2,5);

    results.push(0);
    return results.slice(5, 8); // returns the [X,Y,Z,1] values
}

function getTranslateX(el) {
        // chrome won't use prefix
        // var style_attr = browserPrefix() + 'transform';
        var style_attr = 'transform';
        var transform = window.getComputedStyle(el, null).getPropertyValue(style_attr);
        var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);
        if(!results) return [0, 0, 0];
        if(results[1] === '3d') return results.slice(2,5);
        results.push(0);
        return +(results.slice(5, 8)[0]); // returns the [X,Y,Z,1] values
}

function browserPrefix() {
    var ua = navigator.userAgent.toLowerCase(), prefix = "";
        prefix = (ua.indexOf("chrome") >= 0 || window.openDatabase) ? "-webkit-" : (ua.indexOf("firefox") >= 0) ? "-moz-" : window.opera ? "-o-" : (document.all && navigator.userAgent.indexOf("Opera") === -1) ? "-ms-" : "";
        console.log(prefix);
        return prefix;

}

function getTranslateY(obj) {
    if(!window.getComputedStyle) return;
    var style = getComputedStyle(obj),
        transform = style.transform || style.webkitTransform || style.mozTransform;
    var mat = transform.match(/^matrix3d\((.+)\)$/);
    if(mat) return parseFloat(mat[1].split(', ')[13]);
    mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
}

function maxNodesInLevels() {
    var allLeaves = Array.prototype.slice.call($apiTree.getElementsByClassName('leaf'));
    var levelNodesObj = {};
    var nodeLevelVal = '';
    for (var i = 0; i < allLeaves.length; i++) {
       nodeLevelVal = allLeaves[i].dataset.level;
       levelNodesObj[nodeLevelVal] = levelNodesObj.hasOwnProperty(nodeLevelVal) ? levelNodesObj[nodeLevelVal] + 1 : 1;
    };
    var levelArr = [];
    for(var ln in levelNodesObj){
      if (levelNodesObj.hasOwnProperty(ln)) {
        levelArr.push(levelNodesObj[ln]);
      };
    }

    return Math.max(...levelArr);
}

function maxNodesInLevel() {
    var levelMaxObj = {};
    var allRootLeavesIdxArr = [];
    var levelNodes = {};
    var rowMaxLevel = {};
    var allLeaves = Array.prototype.slice.call($apiTree.getElementsByClassName('leaf'));
    for (var i = 0; i < allLeaves.length; i++) {
      if (allLeaves[i].getAttribute('data-parent') === "_data_root") {
        allRootLeavesIdxArr.push(+allLeaves[i].getAttribute('data-index'));
      };      
    };
    for (var j = 0; j < allRootLeavesIdxArr.length; j++) {
        levelNodes[allRootLeavesIdxArr[j]] = apiTree.traverseDescendants(allRootLeavesIdxArr[j]);      
    };
    for(var lv in levelNodes){
        if (levelNodes.hasOwnProperty(lv)) {
          levelNodes[lv] = nodesArrToIdxArr(levelNodes[lv]);
        };
    }

    return levelNodes;
}

function offsetLevel(currentRow, rowLevelArr) {
    var offsetY = 0;
    for (var i = 0; i < currentRow; i++) {
      offsetY += rowLevelArr[i] * 52;
    };

    return offsetY;
}
function rearrangeRows() {
    // max level per row
    var rowMaxLevelArr = apiTree.maxLevels();
    for (var i = 0; i < rowMaxLevelArr.length; i++) {
      rowMaxLevelArr[i] = getMaxOfArray(rowMaxLevelArr[i]);
    };

    // nodes per row
    var dataRootNodes = apiTree.traverseDirectChild("_data_root");
    var dataRootArr = queueNodesToArr(dataRootNodes);
    var rowNodesArr = [];
    for (var i = 0; i < dataRootArr.length; i++) {
      var nodesArr = apiTree.traverseDescendants(dataRootArr[i]);
      var idxArr = nodesArrToIdxArr(nodesArr);
        rowNodesArr.push(idxArr);
    };

    // rearrange
    var leaves = [].slice.call($apiTree.getElementsByClassName('leaf'));
    var leafIdx = 0;
    var whichRow = 0;
    var originalX = 0;
    var originalY = 0;
    var levelOffSet = 0;
    for (var i = 0; i < leaves.length; i++) {
        leafIdx = +(leaves[i].dataset.index);
        whichRow = 0;
        for (var j = 0; j < rowNodesArr.length; j++) {
          if (rowNodesArr[j].indexOf(leafIdx) !== -1 ) {
            break;
          } else {
            whichRow += 1;
          };
        };

        originalX = getTranslateX(leaves[i]);
        originalY = getTranslateY(leaves[i]);

        levelOffSet = offsetLevel(whichRow, rowMaxLevelArr);

        leaves[i].style["transform"] = 'translate3d(' + originalX + 'px, ' + levelOffSet + 'px, 0)';

    };

    return rowNodesArr;

}

function rearrangeNodes() {
    

}