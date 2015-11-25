import {apiDom} from './tree-dom';
import {xhr, beautifyJSON, hightlightJSON} from './utilities';

var addApiBtn = document.getElementsByClassName('add-api-btn')[0];
var apisArr = [];
addApiBtn.addEventListener('click', function() {
  var newApi = new apiDom();
  apisArr.push(newApi);
});

function cb(data) {
  var $test = document.getElementById('test');
  data = JSON.parse(data);
  $test.innerHTML = hightlightJSON(data);
}
// xhr("GET", "http://127.0.0.1:4567/foo", cb);

