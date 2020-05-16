module.exports = {
  nr_cards: {
    white: 221,
    black: 122,
  },
  database: {
    endpoint: 'mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority', // db endpoint
    db: 'HumanityAgainstCards', // clusters storage
  },
  email: {
    user: 'pfluffy955@gmail.com',
    pass: 'thefluffa5',
  },
  server: {
    port: 8081,
    endpoint: 'localhost',
    protocol: 'http',
  },
  console: {
    timestamp: true,
    colors: true,
  },
  routes: {
    // Stores external routes
  },
  account: {
    temp_lifetime: 1000 * 60 * 30, // 30m
    cleaner_interval: 1000 * 60 * 15, // 15m
  },
  pages: {
    '/': {
      path: '\\..\\..\\..\\client/homepage.html',
      type: 'text/html',
    },
    '/lobbies.html': {
      path: '\\..\\..\\..\\client\\lobbies.html',
      type: 'text/html',
    },
    '/assets/css/lobby.css': {
      path: '/../../../client/assets/css/lobby.css',
      type: 'text/css',
    },
    '/assets/css/account.css': {
      path: '/../../../client/assets/css/account.css',
      type: 'text/css',
    },
    '/assets/css/forms.css': {
      path: '/../../../client/assets/css/forms.css',
      type: 'text/css',
    },
    '/auth/google/assets/css/forms.css': {
      path: '/../../../client/auth/google/assets/css/forms.css',
      type: 'text/css',
    },
    '/auth/google/forms.html': {
      path: '/../../../client/auth/google/forms.html',
      type: 'text/html',
    },
    '/auth/google/script.js': {
      path: '\\..\\..\\..\\client/auth/google/script.js',
      type: 'text/javascript',
    },
    '/assets/css/room.css': {
      path: '/../../../client/assets/css/room.css',
      type: 'text/css',
    },
    '/assets/css/purecookie.css': {
      path: '/../../../client/assets/css/purecookie.css',
      type: 'text/css',
    },
    '/login-register': {
      path: '\\..\\..\\..\\client\\login-register.html',
      type: 'text/html',
    },
    '/assets/css/login-register.css': {
      path: '/../../../client/assets/css/login-register.css',
      type: 'text/css',
    },
    '/assets/img/icon-facebook.png': {
      path: '/../../../client/assets/img/icon-facebook.png',
      type: 'text/png',
    },
    '/assets/img/icon-google.png': {
      path: '/../../../client/assets/img/icon-google.png',
      type: 'text/png',
    },
    '/home': {
      path: '\\..\\..\\..\\client/homepage.html',
      type: 'text/html',
    },
    '/account': {
      path: '\\..\\..\\..\\client/account.html',
      type: 'text/html',
    },
    '/confirm_account': {
      path: '\\..\\..\\..\\client/confirm_account.html',
      type: 'text/html',
    },
    '/assets/css/home.css': {
      path: '/../../../client/assets/css/home.css',
      type: 'text/css',
    },
    '/assets/js/purecookie.js': {
      path: '\\..\\..\\..\\client/assets/js/purecookie.js',
      type: 'text/javascript',
    },
    '/sendActivationCode.js': {
      path: '\\..\\..\\..\\client/sendActivationCode.js',
      type: 'text/javascript',
    },
    '/loginRegister.js': {
      path: '\\..\\..\\..\\client/loginRegister.js',
      type: 'text/javascript',
    },
    '/lobbies.js': {
      path: '\\..\\..\\..\\client/lobbies.js',
      type: 'text/javascript',
    },
    '/account.js': {
      path: '\\..\\..\\..\\client/account.js',
      type: 'text/javascript',
    },
    '/waitingRoom': {
      path: '\\..\\..\\..\\client/waitingRoom.html',
      type: 'text/html',
    },
    '/waitingRoom.css': {
      path: '\\..\\..\\..\\client/waitingRoom.css',
      type: 'text/css',
    },
    '/waitingRoom.js': {
      path: '\\..\\..\\..\\client/waitingRoom.js',
      type: 'text/javascript',
    },
    '/game': {
      path: '\\..\\..\\..\\client/gameroom/room-test.html',
      type: 'text/html',
    },
    '/room.js': {
      path: '\\..\\..\\..\\client/gameroom/room.js',
      type: 'text/javascript',
    },
    '/gamecore/basedata.js': {
      path: '\\..\\..\\..\\server/gamecore/basedata.js',
      type: 'text/javascript',
    },
    '/gamecore/gameclient.js': {
      path: '\\..\\..\\..\\client/gamecore/gameclient.js',
      type: 'text/javascript',
    },
    '/reset_password': {
      path: '\\..\\..\\..\\client/reset_password/send_new_pass.html',
      type: 'text/html',
    },
    '/sendNewPass.js': {
      path: '\\..\\..\\..\\client/reset_password/sendNewPass.js',
      type: 'text/javascript',
    },
    '/room-test.css': {
      path: '\\..\\..\\..\\client/gameroom/room-test.css',
      type: 'text/css',
    },
    '/assets/img/bg.png': {
      path: '\\..\\..\\..\\client/assets/img/bg.png',
      type: 'image/png',
    },
    '/assets/img/mainbg.png': {
      path: '\\..\\..\\..\\client/assets/img/mainbg.png',
      type: 'image/png',
    },
  },
  require_auth: true, // false doar pt testare
};
