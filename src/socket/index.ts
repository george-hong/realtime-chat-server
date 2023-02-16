const getSocketMiddleWare = (wsApp) => {
  return function(ws, res, next) {
    ws.on('message', () => {
      console.log('msss');
    });

    ws.send('ok');

    next();
  }
};

export default getSocketMiddleWare;
