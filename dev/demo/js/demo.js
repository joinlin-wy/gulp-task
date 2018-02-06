var a = undefined == null
console.log(a)
var app = new Vue({
    el: '#app',
    data: {
        text: 'Do you want to see the components?',
        title: 'I like auto-build develop evironment'
    },
    components: {
        'hello': {
            template:$template['hello']
        }
    },
    created: function () {
        console.log('i am created')
    }
})