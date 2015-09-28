Vue.component('tree', {
    // declare the props
    props: ['apiId'],
    // the prop can be used inside templates, and will also
    // be set as `this.msg`
    template: '<span class="leaf" data-key="{{nodeKey}}" data-value="{{nodeValue}}">' +
                  '<i class="remove-child">-</i>' +
                  '<input type="text" class="leaf-key" v-model="nodeKey" placeholder="key" />' +
                  '<i>---</i>' +
                  '<input type="text" class="leaf-value" v-model="nodeValue" placeholder="value" />' +
                  '<i class="add-child">+</i>' +
                  '<i class="add-sibling">+</i>' +
              '</span>',
})

new Vue({
  el: '#app',
  data: {
    message: '',
    validation: {
      valid: false
    }
  }
})