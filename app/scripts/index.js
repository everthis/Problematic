Vue.component('tree', {
    // declare the props
    props: ['apiId'],
    // the prop can be used inside templates, and will also
    // be set as `this.msg`
    template: '<span class="layer">' +
                  '<span class="leaf" data-key="{{nodeKey}}" data-value="{{nodeValue}}">' +
                      '<i class="remove-child" v-on="click: removeLeaf">-</i>' +
                      '<input type="text" class="leaf-key" v-model="nodeKey" placeholder="key" />{{nodeKey}}' +
                      '<i>---</i>' +
                      '<input type="text" class="leaf-value" v-model="nodeValue" placeholder="value" />{{nodeValue}}' +
                      '<i class="add-child" v-on="click: addChild">+</i>' +
                      '<i class="add-sibling" v-on="click: addSibling">+</i>' +
                  '</span>' +
              '</span>',
    data: function() {
      return {
        nodeKey: '',
        nodeValue: '',
        message: '',
        validation: {
          valid: false
        }
      }
    },
    methods: {
        addSibling: function (e) {
          console.log('sibling');
        },
        addChild: function (e) {
          console.log('child');
        },
        removeLeaf: function() {
          console.log('remove');

        }
    }
})

new Vue({
  el: '#app',
  data: {
    nodeKey: 'nil',
    nodeValue: 'nil',
    message: '',
    validation: {
      valid: false
    }
  }
})