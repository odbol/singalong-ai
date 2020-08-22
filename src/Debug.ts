
const DEBUG = ~window.location.href.indexOf('debug');
const DISABLE_VIDEO = ~window.location.href.indexOf('novideo');

function debugPrint(...args: any[]) {
    if (DEBUG) {
        console.log(...args);
    }
}

export {DEBUG, DISABLE_VIDEO, debugPrint};