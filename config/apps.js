module.exports = {
    name: 'app',
    dirs: [
        'framework','demo'
    ],
    dev:{
        useVorlon: false,
        vorlonPort: 1337,
        serverOpen: true
    },
    build:{
        serverOpen: true,
        compressWar: true,
    }
}