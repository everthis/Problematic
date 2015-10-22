export function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

export function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}

export function browserPrefix() {
    var ua = navigator.userAgent.toLowerCase(), prefix = "";
        prefix = (ua.indexOf("chrome") >= 0 || window.openDatabase) ? "-webkit-" : (ua.indexOf("firefox") >= 0) ? "-moz-" : window.opera ? "-o-" : (document.all && navigator.userAgent.indexOf("Opera") === -1) ? "-ms-" : "";
    return prefix;
}

export function getTransform(el) {
    var transform = window.getComputedStyle(el, null).getPropertyValue('-webkit-transform');
    var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);

    if(!results) return [0, 0, 0];
    if(results[1] == '3d') return results.slice(2,5);

    results.push(0);
    return results.slice(5, 8); // returns the [X,Y,Z,1] values
}

export function getTranslateX(el) {
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

export function getTranslateY(obj) {
    if(!window.getComputedStyle) return;
    var style = getComputedStyle(obj),
        transform = style.transform || style.webkitTransform || style.mozTransform;
    var mat = transform.match(/^matrix3d\((.+)\)$/);
    if(mat) return parseFloat(mat[1].split(', ')[13]);
    mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
}