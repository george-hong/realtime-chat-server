class ChatSocket {
  private wsInstance;
  private wsApp;

  constructor(wsInstance, wsApp) {
    this.wsInstance = wsInstance;
    this.wsApp = wsApp;
  }

  public send(message: string) {
    this.wsInstance.send(message);
  }

  public destroy() {
    this.wsInstance = null;
    this.wsApp = null;
  }
}

export default ChatSocket;
