export interface IWebSocket {
  mWs: WebSocket;
  createWebSocket(url: string): IWebSocket;
  addOnOpenListener(listener: IOnOpenlistener);
  addOnCloseListener(listener: IOnCloselistener);
  addOnMessageListener(listener: IOnMessagelistener);
  addOnErrorListener(listener: IOnErrorlistener);
  distory();
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView);
  close();
}

export interface IOnOpenlistener {
  onopen();
}
export interface IOnCloselistener {
  onclose(e:CloseEvent);
}
export interface IOnMessagelistener {
  onmessage(msg: MessageEvent);
}
export interface IOnErrorlistener {
  onerror(err: Error);
}
