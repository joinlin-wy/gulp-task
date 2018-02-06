var app = new Vue({
    el: '#app',
    data: {
        text: 'this is the homepage',
        title: 'i like runing to school'
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