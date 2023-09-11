import {IOnOpenlistener, IOnCloselistener, IWebSocket, IOnMessagelistener, IOnErrorlistener} from "./IWebSocket";

export class BrowserWebSocket implements IWebSocket {
    mWs: WebSocket;
    private mOnOpenListener: IOnOpenlistener;
    private mCloseListener: IOnCloselistener;
    private mMessageListener: IOnMessagelistener;
    private mErrorListener: IOnErrorlistener;
    createWebSocket(url: string): IWebSocket {
        this.mWs=new WebSocket(url)
        this.mWs.onopen=this.onOpen.bind(this)
        this.mWs.onclose=this.onClose.bind(this)
        this.mWs.onmessage=this.onMessage.bind(this)
        this.mWs.onerror=this.onError.bind(this)
        return this;
    }
    addOnOpenListener(listener:IOnOpenlistener){
        this.mOnOpenListener=listener
    }
    addOnCloseListener(listener:IOnCloselistener){
        this.mCloseListener=listener
    }
    addOnMessageListener(listener:IOnMessagelistener){
        this.mMessageListener=listener
    }
    addOnErrorListener(listener: IOnErrorlistener) {
        this.mErrorListener=listener
    }

    private onOpen(){
        if(this.mOnOpenListener){
            this.mOnOpenListener.onopen()
        }
    }
    private onClose(){
        if(this.mCloseListener){
            this.mCloseListener.onclose()
        }
    }
    private onMessage(msg:MessageEvent){
        if(this.mMessageListener){
            this.mMessageListener.onmessage(msg)
        }
    }
    private onError(err){
        if(this.mErrorListener){
            this.mErrorListener.onerror(err)
        }
    }
    send(data:string | ArrayBufferLike | Blob | ArrayBufferView){
        this.mWs.send(data)
    }
    close(){
        this.mWs.close()
    }

    distory() {
        this.mOnOpenListener=null
        this.mCloseListener=null
        this.mMessageListener=null
        this.mErrorListener=null
        try {
            this.close()
        }catch (e) {

        }
    }
}
