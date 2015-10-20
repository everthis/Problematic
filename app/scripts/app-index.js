import {apiDom} from './tree-dom';

var addApiBtn = document.getElementsByClassName('add-api-btn')[0];
var apisArr = [];
addApiBtn.addEventListener('click', function() {
    var newApi = new apiDom();
    apisArr.push(newApi);
})