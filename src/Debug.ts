
const DEBUG = ~window.location.href.indexOf('debug');

function debugPrint() {
    if (DEBUG) {
        console.log.apply(console, arguments);
    }
}

export {DEBUG, debugPrint};