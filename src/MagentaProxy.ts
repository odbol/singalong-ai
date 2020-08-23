import {debugPrint} from './Debug';

/**
 * This file loads magenta in an iframe and communicates with it.
 * 
 * We have to do this because Magenta and ml5 use different versions of Tensorflow and can't work together on the same page.
 */
 export default class MagentaProxy {

    private proxy: Window;
    private onLoaded: () => any;

    /**
     * Holds currently pending requests with the requestId as key.
     * 
     * The values are actually just the resolve callback of the promise returned by this API.
     */
    private requests = {};

    private nextRequestId = 0;

    async initialize() {
        const proxyIframe = document.createElement("iframe"); 
        proxyIframe.width  = "0";
        proxyIframe.height = "0";
        proxyIframe.style.display = 'none';

        proxyIframe.src = 'magenta.html';

        document.body.appendChild(proxyIframe);
        this.proxy = proxyIframe.contentWindow;

        window.onmessage = (event: MessageEvent) => this.onMessage(event);

        return new Promise(resolve => this.onLoaded = resolve);
    }

    private onMessage(event: MessageEvent) {
        debugPrint('MagentaProxy.onMessage()', event);

        if (event.origin == window.origin && event.source == this.proxy) {
            const requestId = event.data.requestId;
            const requestResolver = this.requests[requestId];
            if (requestResolver) {
                requestResolver(event.data.msg);
                delete this.requests[requestId];
            } else if (event.data.isLoaded) {
                this.onLoaded();
            }
        }
    }

    private sendMessage(msg: any) {
        debugPrint('MagentaProxy.sendMessage()', msg);

        const requestId = this.nextRequestId++;
        this.proxy.postMessage({
            msg,
            requestId
        }, window.origin);
        
        return new Promise(resolve => this.requests[requestId] = resolve)
    }

    async continueSequence(notes: any) {
        return this.sendMessage({
            notes
        });
    }
 }