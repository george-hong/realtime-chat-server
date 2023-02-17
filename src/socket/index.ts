import ChatSocket from './chat-socket';

const getSocketMiddleWare = (wsApp) => {
  return function(ws, res, next) {

    const chatSocket = new ChatSocket(ws, wsApp);

    next();
  }
};

export default getSocketMiddleWare;
