
export const DEBUG = ~window.location.href.indexOf('debug');
export const DISABLE_VIDEO = ~window.location.href.indexOf('novideo');
export const DISABLE_FACE_DETECTION = ~window.location.href.indexOf('noface');

export function debugPrint(...args: any[]) {
    if (DEBUG) {
        console.log(...args);
    }
}