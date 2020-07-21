import axios from 'axios';
import router from '../router';

export default {
  namespaced: true,
  state: {
    connection: null,
    challstr: '',
    challid: '',
    chall: '',
  },
  mutations: {
    onOpen() {
      console.log('Conectando al server...');
      this.connection = new WebSocket('ws://sim.smogon.com:8000/showdown/websocket');
      this.connection.onopen = function () {
        // console.log(event);
        // console.log('Conexión exitosa');
      };
    },
    messageListener() {
      this.connection.onmessage = function (event) {
        console.log('Me ha llegado un mensaje');
        console.log(event);
        this.challstr = event.data.split('|');
        if (this.challstr[1] === 'challstr') {
          // eslint-disable-next-line prefer-destructuring
          this.challid = this.challstr[2];
          // eslint-disable-next-line prefer-destructuring
          this.chall = this.challstr[3];
        }
      };
    },
    postRequest(state, [userName, password]) {
      const proxyurl = 'https://cors-anywhere.herokuapp.com/';
      const url = 'https://play.pokemonshowdown.com/action.php?';
      const data = `act=login&name=${userName}&pass=${password}&challengekeyid=${this.connection.challid}&challenge=${this.connection.chall}`;
      console.log('Haciendo el post...');
      axios.post(proxyurl + url, data).then((result) => {
        // console.log(result);
        const dataJSON = JSON.parse(result.data.substr(1));
        // console.log(`|/trn ${this.userName},0,${dataJSON.assertion}`);
        this.connection.send(`|/trn ${userName},0,${dataJSON.assertion}`);
        this.connection.send('|/avatar 161');
        router.push('MainWindow');
      });
    },
  },
  actions: {

  },
  modules: {

  },
};
