import axios from 'axios';
import router from '../router';
// import BattleText from '../utils/text';

export default {
  namespaced: true,
  state: {
    connection: null,
    challstr: '',
    challid: '',
    chall: '',
    dataSplitted: '',
    ref: '',
    p1: '',
    p2: '',
    stats: {
      atk: '',
      def: '',
      spa: '',
      spd: '',
      spe: '',
    },
    move: {
      id: '',
      pp: '',
      maxpp: '',
    },
    // userPokemon: {
    //   name: '',
    //   currentHP: '',
    //   maxHP: '',
    //   stats: [],
    //   move: [],
    //   ability: '',
    //   item: '',
    // },
    // rivalPokemon: {
      // name: '',
      // HPpercentage: '',
    // },
    userNumber: '',
    rivalNumber: '',
    userTeam: [],
    rivalTeam: [],
    boostText: '',
    statN: '',
    currentPokemonP1: '',
    currentPokemonP2: '',
    splitted1: '',
    splitted2: '',
    splitted3: '',
    currentWeather: '',
    weatherTurnsLeft: 5,
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
    postRequest(state, { userName, password }) {
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
    searchBattleWithTeam(state, { format, team }) {
      // console.log(`el formato es ${format} y el team es ${team}`);
      this.connection.send(`|/utm ${team}`);
      this.connection.send(`|/search ${format}`);
    },
    addMessageToChat(state, { text, type }) {
      const newMessage = document.createElement(type);
      const newContent = document.createTextNode(text);
      newMessage.appendChild(newContent);

      // document.getElementById('chat').appendChild(newDiv);
      this.ref.appendChild(newMessage);
    },
    // commit('addDiv', this.dataSplitted[1]);
    setStateRef(state, refId) {
      this.ref = refId;
      // console.log(`\n\n\n\n\n el ref es ${this.ref}`);
      // console.log(`\n\n\n\n\n el state es ${state}`);
    },
    stat(state, statName) {
      if (statName === 'atk') {
        state.statN = 'attack';
      } else if (statName === 'def') {
        state.statN = 'defense';
      } else if (statName === 'spa') {
        state.statN = 'special attack';
      } else if (statName === 'spd') {
        state.statN = 'special defense';
      } else if (statName === 'spe') {
        state.statN = 'speed';
      }
    },
    boostAmount(state, { boost, number }) {
      if (boost === '-boost') {
        if (number === '1') {
          state.boostText = 'rose!';
        } else if (number === '2') {
          state.boostText = 'rose sharply!';
        } else if (number === '0') {
          state.boostText = 'won\'t go any higher!';
        }
      } else if (boost === '-unboost') {
        if (number === '1') {
          state.boostText = 'fell!';
        } else if (number === '2') {
          state.boostText = 'sharply fell!';
        } else if (number === '0') {
          state.boostText = 'won\'t go any lower!';
        }
      }
    },
  },
  actions: {
    messageListener({ state, commit }) {
      this.connection.onmessage = function (event) {
        console.log('Me ha llegado un mensaje');
        this.dataSplitted = event.data.split('|');
        console.log(this.dataSplitted);
        // eslint-disable-next-line no-restricted-syntax
        if (this.dataSplitted[1] === 'challstr') {
          // eslint-disable-next-line prefer-destructuring
          this.challid = this.dataSplitted[2];
          // eslint-disable-next-line prefer-destructuring
          this.chall = this.dataSplitted[3];
        } else if (this.dataSplitted[1] === 'init') {
          router.push('BattleWindow');
        }
        for (let i = 0; i < this.dataSplitted.length; i += 1) {
          if ((this.dataSplitted[i] === 'player') && (this.dataSplitted[i + 1] === 'p1')) {
            // eslint-disable-next-line prefer-destructuring
            this.p1 = this.dataSplitted[i + 2];
            commit('addMessageToChat', { text: `El jugador 1 es ${this.p1}`, type: 'div' });
          } else if ((this.dataSplitted[i] === 'player') && (this.dataSplitted[i + 1] === 'p2')) {
            // eslint-disable-next-line prefer-destructuring
            this.p2 = this.dataSplitted[i + 2];
            commit('addMessageToChat', { text: `El jugador 2 es ${this.p2}`, type: 'div' });
          } else if (this.dataSplitted[i] === 'rule') {
            commit('addMessageToChat', { text: this.dataSplitted[i + 1], type: 'div' });
          } else if (this.dataSplitted[i] === 'inactive') {
            if (this.dataSplitted[i + 1].substr(0, 9) !== 'Time left') {
              commit('addMessageToChat', { text: this.dataSplitted[i + 1], type: 'div' });
            }
          } else if (this.dataSplitted[i] === 'request') {
            this.splitted1 = this.dataSplitted[i + 1].split('"ident":').join('').replace(/"|{|}|\[|]/g, '').split(',');
            console.log(this.splitted1);
            // SETTEAR EL EQUIPO AL PRINCIPIO ó CAMBIAR PPs ATAQUES POKEMON ACTIVO
            if (this.splitted1[0] === 'teamPreview:true') {
              state.userNumber = this.splitted1[3].substr(3);
              if (state.userNumber === 'p1') {
                state.rivalNumber = 'p2';
              } else {
                state.rivalNumber = 'p1';
              }
              let pokemonName;
              let pokemonNickname;
              let pokemonCurrentHP;
              let pokemonMaxHP;
              const pokemonStats = [];
              const pokemonMoves = [];
              let pokemonItem;
              let pokemonAbility;
              for (let j = 0; j < this.splitted1.length; j += 1) {
                if (this.splitted1[j].substr(0, 7) === 'details') {
                  pokemonName = this.splitted1[j].substr(8);
                  // eslint-disable-next-line
                  let splittedAuxiliar = this.splitted1[j - 1].split(':');
                  if (splittedAuxiliar.length > 2) {
                    // eslint-disable-next-line
                    pokemonNickname = splittedAuxiliar[2].trim();
                  } else {
                    // eslint-disable-next-line
                    pokemonNickname = splittedAuxiliar[1].trim();
                  }
                  if (this.splitted1[j + 1].substr(0, 1) === ' ') {
                    this.splitted1.splice(j + 1, 1);
                  }
                  this.splitted2 = this.splitted1[j + 1].substr(10).split('/');
                  // eslint-disable-next-line prefer-destructuring
                  pokemonCurrentHP = this.splitted2[0];
                  // eslint-disable-next-line prefer-destructuring
                  pokemonMaxHP = this.splitted2[1];
                  pokemonStats[0] = this.splitted1[j + 3].substr(10);
                  pokemonStats[1] = this.splitted1[j + 4].substr(4);
                  pokemonStats[2] = this.splitted1[j + 5].substr(4);
                  pokemonStats[3] = this.splitted1[j + 6].substr(4);
                  pokemonStats[4] = this.splitted1[j + 7].substr(4);
                  pokemonMoves[0] = this.splitted1[j + 8].substr(6);
                  pokemonMoves[1] = this.splitted1[j + 9];
                  pokemonMoves[2] = this.splitted1[j + 10];
                  pokemonMoves[3] = this.splitted1[j + 11];
                  pokemonItem = this.splitted1[j + 13].substr(5);
                  pokemonAbility = this.splitted1[j + 15].substr(8);
                  const pokemon = {
                    name: pokemonName,
                    nickname: pokemonNickname,
                    currentHP: pokemonCurrentHP,
                    maxHP: pokemonMaxHP,
                    stats: {
                      atk: pokemonStats[0],
                      def: pokemonStats[1],
                      spa: pokemonStats[2],
                      spd: pokemonStats[3],
                      spe: pokemonStats[4],
                    },
                    moves: {
                      move1: {
                        moveName: pokemonMoves[0],
                        currentPP: '',
                        maxPP: '',
                      },
                      move2: {
                        moveName: pokemonMoves[1],
                        currentPP: '',
                        maxPP: '',
                      },
                      move3: {
                        moveName: pokemonMoves[2],
                        currentPP: '',
                        maxPP: '',
                      },
                      move4: {
                        moveName: pokemonMoves[3],
                        currentPP: '',
                        maxPP: '',
                      },
                    },
                    item: pokemonItem,
                    ability: pokemonAbility,
                    faint: false,
                    status: '',
                  };
                  state.userTeam.push(pokemon);
                }
              }
            } else if (this.splitted1[0].substr(0, 6) === 'active') {
              if (this.splitted1[25].substr(3) === 'p1') {
                const currentPokP1 = this.splitted1[27].substr(8);
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line max-len
                  if (state.userTeam[state.userTeam.indexOf(pokemon)].name === currentPokP1) {
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move1.currentPP = this.splitted1[2].substr(3);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move1.maxPP = this.splitted1[3].substr(6);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move2.currentPP = this.splitted1[8].substr(3);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move2.maxPP = this.splitted1[9].substr(6);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move3.currentPP = this.splitted1[14].substr(3);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move3.maxPP = this.splitted1[15].substr(6);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move4.currentPP = this.splitted1[20].substr(3);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move4.maxPP = this.splitted1[21].substr(6);
                  }
                });
              } else {
                const currentPokP2 = this.splitted1[27].substr(8);
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line max-len
                  if (state.userTeam[state.userTeam.indexOf(pokemon)].name === currentPokP2) {
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move1.currentPP = this.splitted1[2].substr(3);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move1.maxPP = this.splitted1[3].substr(6);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move2.currentPP = this.splitted1[8].substr(3);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move2.maxPP = this.splitted1[9].substr(6);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move3.currentPP = this.splitted1[14].substr(3);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move3.maxPP = this.splitted1[15].substr(6);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move4.currentPP = this.splitted1[20].substr(3);
                    // eslint-disable-next-line max-len
                    state.userTeam[state.userTeam.indexOf(pokemon)].moves.move4.maxPP = this.splitted1[21].substr(6);
                  }
                });
              }
              // eslint-disable-next-line
              // state.userTeam.forEach(element => console.log(`elemento : ${JSON.stringify(element)}`));
            }
          } else if (this.dataSplitted[i] === 'poke' && this.dataSplitted[i + 1] !== state.userNumber) {
            const pokemon = {
              name: this.dataSplitted[i + 2].split(',')[0],
              nickname: '',
              currentHPpercentage: 100,
              maxHPpercentage: 100,
              faint: false,
              status: '',
            };
            state.rivalTeam.push(pokemon);
          } else if (this.dataSplitted[i] === 'switch') {
            let index;
            let faint;
            if (this.dataSplitted[i + 1].substr(0, 3) === 'p1a') {
              if (state.currentPokemonP1 === '') {
                // eslint-disable-next-line
                state.currentPokemonP1 = this.dataSplitted[i + 2].split(',')[0];
                if (state.userNumber !== 'p1') {
                  state.rivalTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP1){
                      // eslint-disable-next-line
                      index = state.rivalTeam.indexOf(pokemon);
                    }
                  });
                  // eslint-disable-next-line
                  state.rivalTeam[index].nickname = this.dataSplitted[i + 1].substr(5);
                }
                commit('addMessageToChat', { text: `${this.p1} send ${state.currentPokemonP1}!`, type: 'div' });
              } else {
                if (state.userNumber !== 'p1') {
                  state.rivalTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP1) {
                      // eslint-disable-next-line
                      faint = pokemon.faint;
                    }
                  });
                } else {
                  state.userTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP1) {
                      // eslint-disable-next-line
                      faint = pokemon.faint;
                    }
                  });
                }
                if (faint === false) {
                  commit('addMessageToChat', { text: `${this.p1} withdraw ${state.currentPokemonP1}!`, type: 'div' });
                }
                // eslint-disable-next-line
                state.currentPokemonP1 = this.dataSplitted[i + 2].split(',')[0];
                commit('addMessageToChat', { text: `${this.p1} send ${state.currentPokemonP1}!`, type: 'div' });
              }
            } else if (this.dataSplitted[i + 1].substr(0, 3) === 'p2a') {
              if (state.currentPokemonP2 === '') {
                // eslint-disable-next-line
                state.currentPokemonP2 = this.dataSplitted[i + 2].split(',')[0];
                if (state.userNumber !== 'p2') {
                  state.rivalTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP2){
                      // eslint-disable-next-line
                      index = state.rivalTeam.indexOf(pokemon);
                    }
                  });
                  // eslint-disable-next-line
                  // eslint-disable-next-line
                  state.rivalTeam[index].nickname = this.dataSplitted[i + 1].split(' ')[1];
                }
                commit('addMessageToChat', { text: `${this.p2} send ${state.currentPokemonP2}!`, type: 'div' });
              } else {
                if (state.userNumber !== 'p2') {
                  state.rivalTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP2) {
                      // eslint-disable-next-line
                      faint = pokemon.faint;
                    }
                  });
                } else {
                  state.userTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP2) {
                      // eslint-disable-next-line
                      faint = pokemon.faint;
                    }
                  });
                }
                if (faint === false) {
                  commit('addMessageToChat', { text: `${this.p2} withdraw ${state.currentPokemonP2}!`, type: 'div' });
                }
                // eslint-disable-next-line
                state.currentPokemonP2 = this.dataSplitted[i + 2].split(',')[0];
                commit('addMessageToChat', { text: `${this.p2} send ${state.currentPokemonP2}!`, type: 'div' });
              }
            }
          } else if ((this.dataSplitted[i] === '-boost') || (this.dataSplitted[i] === '-unboost')) {
            commit('stat', this.dataSplitted[i + 2]);
            commit('boostAmount', { boost: this.dataSplitted[i], number: this.dataSplitted[i + 3].trim() });
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `${pokemon.name}'s ${state.statN} ${state.boostText}`, type: 'div' });
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s ${state.statN} ${state.boostText}`, type: 'div' });
                }
              });
            }
          } else if (this.dataSplitted[i] === '-setboost') {
            commit('stat', this.dataSplitted[i + 2]);
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `${pokemon.name}'s maximized its ${state.statN}!`, type: 'div' });
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s maximized its ${state.statN}!`, type: 'div' });
                }
              });
            }
          } else if (this.dataSplitted[i] === 'turn') {
            commit('addMessageToChat', { text: `Turn ${this.dataSplitted[i + 1]}`, type: 'h2' });
          } else if (this.dataSplitted[i] === 'move') {
            if (this.dataSplitted[i + 1].substr(0, 3) === 'p1a') {
              commit('addMessageToChat', { text: `${state.currentPokemonP1} used ${this.dataSplitted[i + 2]}!`, type: 'div' });
            } else if (this.dataSplitted[i + 1].substr(0, 3) === 'p2a') {
              commit('addMessageToChat', { text: `${state.currentPokemonP2} used ${this.dataSplitted[i + 2]}!`, type: 'div' });
            }
          } else if (this.dataSplitted[i] === '-miss') {
            if (this.dataSplitted[i + 2].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 2].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 2].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `${pokemon.name} avoided the attack!`, type: 'div' });
                }
              });
            } else if (this.dataSplitted[i + 2].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 2].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 2].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `The opposing ${pokemon.name} avoided the attack!`, type: 'div' });
                }
              });
            }
          } else if (this.dataSplitted[i] === '-damage') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].substr(2).trim() === 'fnt'){
                    // eslint-disable-next-line
                    const damage = (100*(state.userTeam[state.userTeam.indexOf(pokemon)].currentHP))/state.userTeam[state.userTeam.indexOf(pokemon)].maxHP;
                    state.userTeam[state.userTeam.indexOf(pokemon)].currentHP = 0;
                    if (this.dataSplitted[i + 4] !== null) {
                      if (this.dataSplitted[i + 4].substr(0, 6) !== '[from]') {
                        commit('addMessageToChat', { text: `${pokemon.name} lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 4].substr(0, 6) === '[from]') {
                        if (this.dataSplitted[i + 4].substr(7, 4) === 'item') {
                          if (this.dataSplitted[i + 5].substr(0, 4) === '[of]') {
                            if (state.rivalNumber === 'p1') {
                              commit('addMessageToChat', { text: `${pokemon.name} was hurt by ${state.currentPokemonP1}'s ${this.dataSplitted[i + 4].substr(13).trim()} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                            } else {
                              commit('addMessageToChat', { text: `${pokemon.name} was hurt by ${state.currentPokemonP2}'s ${this.dataSplitted[i + 4].substr(13).trim()} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                            }
                          } else {
                            commit('addMessageToChat', { text: `${pokemon.name} was hurt by its ${this.dataSplitted[i + 4].substr(13).trim()} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                          }
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'brn') {
                          commit('addMessageToChat', { text: `${pokemon.name} was hurt by its burn and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'psn' || this.dataSplitted[i + 4].substr(7).trim() === 'tox') {
                          commit('addMessageToChat', { text: `${pokemon.name} was hurt by poison and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'confusion') {
                          commit('addMessageToChat', { text: `${pokemon.name} hurt itself in its confusion and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Recoil') {
                          commit('addMessageToChat', { text: `${pokemon.name} was damaged by the recoil and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Sandstorm') {
                          commit('addMessageToChat', { text: `${pokemon.name} was buffeted by the sandstorm and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Hail') {
                          commit('addMessageToChat', { text: `${pokemon.name} was buffeted by the hail and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'highjumpkick') {
                          commit('addMessageToChat', { text: `${pokemon.name} kept going, crashed and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Curse') {
                          commit('addMessageToChat', { text: `${pokemon.name} was afflicted by the curse and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Leech Seed') {
                          commit('addMessageToChat', { text: `${pokemon.name}'s health was sapped by Leech Seed and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Spikes') {
                          commit('addMessageToChat', { text: `${pokemon.name} was hurt by the spikes and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Stealth Rock') {
                          commit('addMessageToChat', { text: `Pointed stones dug into ${pokemon.name} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7, 7) === 'ability') {
                          commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                          commit('addMessageToChat', { text: `${pokemon.name} was hurt and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        }
                      }
                    }
                  } else {
                    const damage = (100 * (state.userTeam[state.userTeam.indexOf(pokemon)].currentHP - this.dataSplitted[i + 2].split('/')[0])) / state.userTeam[state.userTeam.indexOf(pokemon)].maxHP;
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].currentHP = this.dataSplitted[i + 2].split('/')[0];
                    if (this.dataSplitted[i + 3] !== null) {
                      if (this.dataSplitted[i + 3].substr(0, 6) !== '[from]') {
                        commit('addMessageToChat', { text: `${pokemon.name} lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(0, 6) === '[from]') {
                        if (this.dataSplitted[i + 3].substr(7, 4) === 'item') {
                          if (this.dataSplitted[i + 4].substr(0, 4) === '[of]') {
                            if (state.rivalNumber === 'p1') {
                              commit('addMessageToChat', { text: `${pokemon.name} was hurt by ${state.currentPokemonP1}'s ${this.dataSplitted[i + 3].substr(13).trim()} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                            } else {
                              commit('addMessageToChat', { text: `${pokemon.name} was hurt by ${state.currentPokemonP2}'s ${this.dataSplitted[i + 3].substr(13).trim()} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                            }
                          } else {
                            commit('addMessageToChat', { text: `${pokemon.name} was hurt by its ${this.dataSplitted[i + 3].substr(13).trim()} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                          }
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'brn') {
                          commit('addMessageToChat', { text: `${pokemon.name} was hurt by its burn and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'psn' || this.dataSplitted[i + 3].substr(7).trim() === 'tox') {
                          commit('addMessageToChat', { text: `${pokemon.name} was hurt by poison and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'confusion') {
                          commit('addMessageToChat', { text: `${pokemon.name} hurt itself in its confusion and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Recoil') {
                          commit('addMessageToChat', { text: `${pokemon.name} was damaged by the recoil and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Sandstorm') {
                          commit('addMessageToChat', { text: `${pokemon.name} was buffeted by the sandstorm and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Hail') {
                          commit('addMessageToChat', { text: `${pokemon.name} was buffeted by the hail and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'highjumpkick') {
                          commit('addMessageToChat', { text: `${pokemon.name} kept going, crashed and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Curse') {
                          commit('addMessageToChat', { text: `${pokemon.name} was afflicted by the curse and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Leech Seed') {
                          commit('addMessageToChat', { text: `${pokemon.name}'s health was sapped by Leech Seed and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Spikes') {
                          commit('addMessageToChat', { text: `${pokemon.name} was hurt by the spikes and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Stealth Rock') {
                          commit('addMessageToChat', { text: `Pointed stones dug into ${pokemon.name} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7, 7) === 'ability') {
                          commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                          commit('addMessageToChat', { text: `${pokemon.name} was hurt and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        }
                      }
                    }
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].substr(2).trim() === 'fnt'){
                    // eslint-disable-next-line
                    const damage = state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage;
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = 0;
                    if (this.dataSplitted[i + 4] !== null) {
                      if (this.dataSplitted[i + 4].substr(0, 6) !== '[from]') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 4].substr(0, 6) === '[from]') {
                        if (this.dataSplitted[i + 4].substr(7, 4) === 'item') {
                          if (this.dataSplitted[i + 5].substr(0, 4) === '[of]') {
                            if (state.userNumber === 'p1') {
                              commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by ${state.currentPokemonP1}'s ${this.dataSplitted[i + 4].substr(13).trim()} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                            } else {
                              commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by ${state.currentPokemonP2}'s ${this.dataSplitted[i + 4].substr(13).trim()} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                            }
                          } else {
                            commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by its ${this.dataSplitted[i + 4].substr(13).trim()} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                          }
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'brn') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by its burn and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'psn' || this.dataSplitted[i + 4].substr(7).trim() === 'tox') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by poison and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'confusion') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} hurt itself in its confusion and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Recoil') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was damaged by the recoil and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Sandstorm') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was buffeted by the sandstorm and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Hail') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was buffeted by the hail and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'highjumpkick') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} kept going, crashed and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Curse') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was afflicted by the curse and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Leech Seed') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s health was sapped by Leech Seed and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Spikes') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by the spikes and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7).trim() === 'Stealth Rock') {
                          commit('addMessageToChat', { text: `Pointed stones dug into the opposing ${pokemon.name} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(7, 7) === 'ability') {
                          commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        }
                      }
                    }
                  } else {
                    const damage = state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage - this.dataSplitted[i + 2].split('/')[0];
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 2].split('/')[0];
                    if (this.dataSplitted[i + 3] !== null) {
                      if (this.dataSplitted[i + 3].substr(0, 6) !== '[from]') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(0, 6) === '[from]') {
                        if (this.dataSplitted[i + 3].substr(7, 4) === 'item') {
                          if (this.dataSplitted[i + 4].substr(0, 4) === '[of]') {
                            if (state.userNumber === 'p1') {
                              commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by ${state.currentPokemonP1}'s ${this.dataSplitted[i + 3].substr(13).trim()} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                            } else {
                              commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by ${state.currentPokemonP2}'s ${this.dataSplitted[i + 3].substr(13).trim()} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                            }
                          } else {
                            commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by its ${this.dataSplitted[i + 3].substr(13).trim()} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                          }
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'brn') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by its burn and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'psn' || this.dataSplitted[i + 3].substr(7).trim() === 'tox') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by poison and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'confusion') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} hurt itself in its confusion and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Recoil') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was damaged by the recoil and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Sandstorm') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was buffeted by the sandstorm and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Hail') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was buffeted by the hail and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'highjumpkick') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} kept going, crashed and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Curse') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was afflicted by the curse and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Leech Seed') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s health was sapped by Leech Seed and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Spikes') {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by the spikes and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Stealth Rock') {
                          commit('addMessageToChat', { text: `Pointed stones dug into the opposing ${pokemon.name} and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 3].substr(7, 7) === 'ability') {
                          commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt and lost ${damage.toFixed(1)}% of its health!`, type: 'div' });
                        }
                      }
                    }
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-heal') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  const healing = (100*(this.dataSplitted[i + 2].split('/')[0] - state.userTeam[state.userTeam.indexOf(pokemon)].currentHP))/state.userTeam[state.userTeam.indexOf(pokemon)].maxHP;
                  // eslint-disable-next-line
                  state.userTeam[state.userTeam.indexOf(pokemon)].currentHP = this.dataSplitted[i + 2].split('/')[0];
                  if (this.dataSplitted[i + 3].substr(0, 6) !== '[from]') {
                    commit('addMessageToChat', { text: `${pokemon.name} restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].substr(0, 6) === '[from]') {
                    if (this.dataSplitted[i + 3].substr(7, 4) === 'item') {
                      commit('addMessageToChat', { text: `${pokemon.name} restored ${healing.toFixed(1)}% of its health thanks to its ${this.dataSplitted[i + 3].substr(13).trim()}`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7) === 'drain') {
                      if (state.rivalNumber === 'p1') {
                        commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2} had its energy drained! ${state.currentPokemonP1} restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                      } else {
                        commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1} had its energy drained! ${state.currentPokemonP2} restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                      }
                    } else if (this.dataSplitted[i + 3].substr(7, 7).trim() === 'Grassy Terrain') {
                      commit('addMessageToChat', { text: `${pokemon.name} restored ${healing.toFixed(1)}% of its health thanks to the terrain!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7, 7).trim() === 'Aqua Ring') {
                      commit('addMessageToChat', { text: `A veil of water restored ${healing.toFixed(1)}% of ${pokemon.name}'s health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Ingrain') {
                      commit('addMessageToChat', { text: `${pokemon.name} absorbed nutrients with its roots and restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7) === 'ability') {
                      commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                      commit('addMessageToChat', { text: `${pokemon.name} restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7).trim() === 'move') {
                      if (this.dataSplitted[i + 3].substr(13) === 'wish') {
                        commit('addMessageToChat', { text: `${this.dataSplitted[i + 4].substr(9)}'s wish came true and ${pokemon.name} restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(13) === 'Healing Wish') {
                        commit('addMessageToChat', { text: `The healing wish came true and ${pokemon.name} restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                      }
                    }
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  const healing = this.dataSplitted[i + 2].split('/')[0] - state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage;
                  // eslint-disable-next-line
                  state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 2].split('/')[0];
                  if (this.dataSplitted[i + 3].substr(0, 6) !== '[from]') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].substr(0, 6) === '[from]') {
                    if (this.dataSplitted[i + 3].substr(7, 4) === 'item') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} restored ${healing.toFixed(1)}% of its health thanks to its ${this.dataSplitted[i + 3].substr(13).trim()}`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7) === 'drain') {
                      if (state.rivalNumber === 'p1') {
                        commit('addMessageToChat', { text: `${state.currentPokemonP2} had its energy drained! ${state.currentPokemonP1} restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                      } else {
                        commit('addMessageToChat', { text: `${state.currentPokemonP1} had its energy drained! ${state.currentPokemonP2} restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                      }
                    } else if (this.dataSplitted[i + 3].substr(7, 7).trim() === 'Grassy Terrain') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} restored ${healing.toFixed(1)}% of its health thanks to the terrain!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7, 7).trim() === 'Aqua Ring') {
                      commit('addMessageToChat', { text: `A veil of water restored ${healing.toFixed(1)}% of the opposing ${pokemon.name}'s health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Ingrain') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} absorbed nutrients with its roots and restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7) === 'ability') {
                      commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7).trim() === 'move') {
                      if (this.dataSplitted[i + 3].substr(13) === 'wish') {
                        commit('addMessageToChat', { text: `The opposing ${this.dataSplitted[i + 4].substr(9)}'s wish came true and ${pokemon.name} restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(13) === 'Healing Wish') {
                        commit('addMessageToChat', { text: `The healing wish came true and the opposing ${pokemon.name} restored ${healing.toFixed(1)}% of its health!`, type: 'div' });
                      }
                    }
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-supereffective') {
            commit('addMessageToChat', { text: 'It\'s super effective!', type: 'div' });
          } else if (this.dataSplitted[i] === '-resisted') {
            commit('addMessageToChat', { text: 'It\'s not very effective...', type: 'div' });
          } else if (this.dataSplitted[i] === '-immune') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `It doesn't affect ${pokemon.name}...`, type: 'div' });
                  if (this.dataSplitted[i + 2].substr(0, 14) === '[from] ability') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16).trim()}]`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `It doesn't affect the opposing ${pokemon.name}...`, type: 'div' });
                  if (this.dataSplitted[i + 2].substr(0, 14) === '[from] ability') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16).trim()}]`, type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-weather') {
            if (this.dataSplitted[i + 1].trim() === 'Sandstorm') {
              if (this.dataSplitted[i + 2].trim() !== '[upkeep]') {
                state.currentWeather = 'Sandstorm';
                state.weatherTurnsLeft = 5;
                if (this.dataSplitted[i + 2].substr(0, 14) === '[from] ability') {
                  if (this.dataSplitted[i + 3].substr(5, 2) === state.userNumber) {
                    state.userTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === this.dataSplitted[i + 3].substr(10).trim() || pokemon.name === this.dataSplitted[i + 3].substr(10).trim()) {
                        // eslint-disable-next-line
                        commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16).trim()}]`, type: 'div' });
                      }
                    });
                  } else if (this.dataSplitted[i + 3].substr(5, 2) !== state.userNumber) {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === this.dataSplitted[i + 3].substr(10).trim() || pokemon.name === this.dataSplitted[i + 3].substr(10).trim()) {
                        // eslint-disable-next-line
                        commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16).trim()}]`, type: 'div' });
                      }
                    });
                  }
                }
                commit('addMessageToChat', { text: 'A sandstorm kicked up!', type: 'div' });
              } else {
                state.weatherTurnsLeft -= 1;
                commit('addMessageToChat', { text: 'The sandstorm is raging.', type: 'div' });
              }
            } else if (this.dataSplitted[i + 1].trim() === 'SunnyDay') {
              if (this.dataSplitted[i + 2].trim() !== '[upkeep]') {
                state.currentWeather = 'SunnyDay';
                state.weatherTurnsLeft = 5;
                if (this.dataSplitted[i + 2].substr(0, 14) === '[from] ability') {
                  if (this.dataSplitted[i + 3].substr(5, 2) === state.userNumber) {
                    state.userTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === this.dataSplitted[i + 3].substr(10).trim() || pokemon.name === this.dataSplitted[i + 3].substr(10).trim()) {
                        // eslint-disable-next-line
                        commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16).trim()}]`, type: 'div' });
                      }
                    });
                  } else if (this.dataSplitted[i + 3].substr(5, 2) !== state.userNumber) {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === this.dataSplitted[i + 3].substr(10).trim() || pokemon.name === this.dataSplitted[i + 3].substr(10).trim()) {
                        // eslint-disable-next-line
                        commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16).trim()}]`, type: 'div' });
                      }
                    });
                  }
                }
                commit('addMessageToChat', { text: 'The sunlight turned harsh!', type: 'div' });
              } else {
                state.weatherTurnsLeft -= 1;
                commit('addMessageToChat', { text: 'The sunlight is strong.', type: 'div' });
              }
            } else if (this.dataSplitted[i + 1].trim() === 'Hail') {
              if (this.dataSplitted[i + 2].trim() !== '[upkeep]') {
                state.currentWeather = 'Hail';
                state.weatherTurnsLeft = 5;
                if (this.dataSplitted[i + 2].substr(0, 14) === '[from] ability') {
                  if (this.dataSplitted[i + 3].substr(5, 2) === state.userNumber) {
                    state.userTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === this.dataSplitted[i + 3].substr(10).trim() || pokemon.name === this.dataSplitted[i + 3].substr(10).trim()) {
                        // eslint-disable-next-line
                        commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16).trim()}]`, type: 'div' });
                      }
                    });
                  } else if (this.dataSplitted[i + 3].substr(5, 2) !== state.userNumber) {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === this.dataSplitted[i + 3].substr(10).trim() || pokemon.name === this.dataSplitted[i + 3].substr(10).trim()) {
                        // eslint-disable-next-line
                        commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16).trim()}]`, type: 'div' });
                      }
                    });
                  }
                }
                commit('addMessageToChat', { text: 'It started to hail!', type: 'div' });
              } else {
                state.weatherTurnsLeft -= 1;
                commit('addMessageToChat', { text: 'The hail is crashing down.', type: 'div' });
              }
            } else if (this.dataSplitted[i + 1].trim() === 'RainDance') {
              if (this.dataSplitted[i + 2].trim() !== '[upkeep]') {
                state.currentWeather = 'RainDance';
                state.weatherTurnsLeft = 5;
                if (this.dataSplitted[i + 2].substr(0, 14) === '[from] ability') {
                  if (this.dataSplitted[i + 3].substr(5, 2) === state.userNumber) {
                    state.userTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === this.dataSplitted[i + 3].substr(10).trim() || pokemon.name === this.dataSplitted[i + 3].substr(10).trim()) {
                        // eslint-disable-next-line
                        commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16).trim()}]`, type: 'div' });
                      }
                    });
                  } else if (this.dataSplitted[i + 3].substr(5, 2) !== state.userNumber) {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === this.dataSplitted[i + 3].substr(10).trim() || pokemon.name === this.dataSplitted[i + 3].substr(10).trim()) {
                        // eslint-disable-next-line
                        commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16).trim()}]`, type: 'div' });
                      }
                    });
                  }
                }
                commit('addMessageToChat', { text: 'It started to rain!', type: 'div' });
              } else {
                state.weatherTurnsLeft -= 1;
                commit('addMessageToChat', { text: 'Rain continues to fall.', type: 'div' });
              }
            } else if (this.dataSplitted[i + 1].trim() === 'none') {
              if (state.currentWeather === 'Sandstorm') {
                state.currentWeather = '';
                commit('addMessageToChat', { text: 'The sandstorm subsided.', type: 'div' });
              } else if (state.currentWeather === 'SunnyDay') {
                state.currentWeather = '';
                commit('addMessageToChat', { text: 'The harsh sunlight faded.', type: 'div' });
              } else if (state.currentWeather === 'Hail') {
                state.currentWeather = '';
                commit('addMessageToChat', { text: 'The hail stopped.', type: 'div' });
              } else if (state.currentWeather === 'RainDance') {
                state.currentWeather = '';
                commit('addMessageToChat', { text: 'The rain stopped.', type: 'div' });
              }
            }
          } else if (this.dataSplitted[i] === '-status') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              if (this.dataSplitted[i + 2].trim() === 'brn' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'brn';
                    commit('addMessageToChat', { text: `${state.currentPokemonP1} was burned!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'brn' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'brn';
                    commit('addMessageToChat', { text: `${state.currentPokemonP2} was burned!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'psn' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'psn';
                    commit('addMessageToChat', { text: `${state.currentPokemonP1} was poisoned!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'psn' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'psn';
                    commit('addMessageToChat', { text: `${state.currentPokemonP2} was poisoned!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'tox' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'tox';
                    commit('addMessageToChat', { text: `${state.currentPokemonP1} was badly poisoned`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'tox' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'tox';
                    commit('addMessageToChat', { text: `${state.currentPokemonP2} was badly poisoned`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'par' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'par';
                    commit('addMessageToChat', { text: `${state.currentPokemonP1} is paralyzed! It may be unable to move!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'par' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'par';
                    commit('addMessageToChat', { text: `${state.currentPokemonP2} is paralyzed! It may be unable to move!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'slp' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'slp';
                    commit('addMessageToChat', { text: `${state.currentPokemonP1} fell asleep!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'slp' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'slp';
                    commit('addMessageToChat', { text: `${state.currentPokemonP2} fell asleep!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'frz' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'frz';
                    commit('addMessageToChat', { text: `${state.currentPokemonP1} was frozen solid!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'frz' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'frz';
                    commit('addMessageToChat', { text: `${state.currentPokemonP2} was frozen solid!`, type: 'div' });
                  }
                });
              }
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              if (this.dataSplitted[i + 2].trim() === 'brn' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'brn';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1} was burned!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'brn' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'brn';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2} was burned!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'psn' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'psn';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1} was poisoned!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'psn' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'psn';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2} was poisoned!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'tox' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'tox';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1} was badly poisoned`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'tox' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'tox';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2} was badly poisoned`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'par' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'par';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1} is paralyzed! It may be unable to move!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'par' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'par';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2} is paralyzed! It may be unable to move!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'slp' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'slp';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1} fell asleep!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'slp' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'slp';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2} fell asleep!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'frz' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'frz';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1} was frozen solid!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'frz' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'frz';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2} was frozen solid!`, type: 'div' });
                  }
                });
              }
            }
          } else if (this.dataSplitted[i] === '-curestatus') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(4) || pokemon.nickname === this.dataSplitted[i + 1].substr(4)) {
                  // eslint-disable-next-line
                  if (state.userTeam[state.userTeam.indexOf(pokemon)].status === 'brn') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s burn was healed!`, type: 'div' });
                  } else if (state.userTeam[state.userTeam.indexOf(pokemon)].status === 'psn') {
                    commit('addMessageToChat', { text: `${pokemon.name} was cured of its poisoning!`, type: 'div' });
                  } else if (state.userTeam[state.userTeam.indexOf(pokemon)].status === 'tox') {
                    commit('addMessageToChat', { text: `${pokemon.name} was cured of its poisoning!`, type: 'div' });
                  } else if (state.userTeam[state.userTeam.indexOf(pokemon)].status === 'par') {
                    commit('addMessageToChat', { text: `${pokemon.name} was cured of paralysis!`, type: 'div' });
                  } else if (state.userTeam[state.userTeam.indexOf(pokemon)].status === 'slp') {
                    commit('addMessageToChat', { text: `${pokemon.name} woke up!`, type: 'div' });
                  } else if (state.userTeam[state.userTeam.indexOf(pokemon)].status === 'frz') {
                    commit('addMessageToChat', { text: `${pokemon.name} woke up!`, type: 'div' });
                  }
                  state.userTeam[state.userTeam.indexOf(pokemon)].status = '';
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(4) || pokemon.nickname === this.dataSplitted[i + 1].substr(4)) {
                  // eslint-disable-next-line
                  if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status === 'brn') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s burn was healed!`, type: 'div' });
                  } else if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status === 'psn') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} was cured of its poisoning!`, type: 'div' });
                  } else if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status === 'tox') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} was cured of its poisoning!`, type: 'div' });
                  } else if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status === 'par') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} was cured of paralysis!`, type: 'div' });
                  } else if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status === 'slp') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} woke up!`, type: 'div' });
                  } else if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status === 'frz') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} woke up!`, type: 'div' });
                  }
                  state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = '';
                }
              });
            }
          } else if (this.dataSplitted[i] === 'cant') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'par') {
                    commit('addMessageToChat', { text: `${pokemon.name} is paralyzed! It can't move!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'slp') {
                    commit('addMessageToChat', { text: `${pokemon.name} is fast asleep.`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'frz') {
                    commit('addMessageToChat', { text: `${pokemon.name} is frozen solid!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'flinch') {
                    commit('addMessageToChat', { text: `${pokemon.name} flinched and couldn't move!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'nopp') {
                    commit('addMessageToChat', { text: `${pokemon.name} used ${this.dataSplitted[i + 3].trim()} .But there was no PP left for the move!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'recharge') {
                    commit('addMessageToChat', { text: `${pokemon.name} must recharge!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Gravity') {
                    commit('addMessageToChat', { text: `${pokemon.name} can't use ${this.dataSplitted[i + 3]} because of gravity!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Attract') {
                    commit('addMessageToChat', { text: `${pokemon.name} is immobilized by love!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Focus Punch') {
                    commit('addMessageToChat', { text: `${pokemon.name} lost its focus and couldn't move!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Shell Trap') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s shell trap didn't work!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Taunt') {
                    commit('addMessageToChat', { text: `${pokemon.name} can't use ${this.dataSplitted[i + 3]} after the taunt!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Throat Chop') {
                    commit('addMessageToChat', { text: `The effects of Throat Chop prevent ${pokemon.name} from using certain moves!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Truant') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} is loafing around!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Damp' || this.dataSplitted[i + 2].trim() === 'ability: Queenly Majesty') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${this.dataSplitted[i + 4].substr(10).trim()} cannot use ${this.dataSplitted[i + 3]}!`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'par') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is paralyzed! It can't move!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'slp') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is fast asleep.`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'frz') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is frozen solid!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'flinch') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} flinched and couldn't move!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'nopp') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} used ${this.dataSplitted[i + 3].trim()} .But there was no PP left for the move!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'recharge') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} must recharge!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Gravity') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} can't use ${this.dataSplitted[i + 3]} because of gravity!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Attract') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is immobilized by love!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Focus Punch') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} lost its focus and couldn't move!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Shell Trap') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s shell trap didn't work!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Taunt') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} can't use ${this.dataSplitted[i + 3]} after the taunt!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Throat Chop') {
                    commit('addMessageToChat', { text: `The effects of Throat Chop prevent the opposing ${pokemon.name} from using certain moves!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Truant') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is loafing around!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Damp' || this.dataSplitted[i + 2].trim() === 'ability: Queenly Majesty') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${this.dataSplitted[i + 4].substr(10).trim()} cannot use ${this.dataSplitted[i + 3]}!`, type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-message') {
            commit('addMessageToChat', { text: `${this.dataSplitted[i + 1].trim()}`, type: 'div' });
          } else if (this.dataSplitted[i] === 'win') {
            commit('addMessageToChat', { text: `${this.dataSplitted[i + 1].trim()} won the battle!`, type: 'div' });
          } else if (this.dataSplitted[i] === 'Ladder updating...') {
            commit('addMessageToChat', { text: 'Ladder updating...', type: 'div' });
          } else if (this.dataSplitted[i] === 'raw') {
            const pointsAfter = this.dataSplitted[i + 1].split('<strong>')[1].substr(0, 4);
            const pointsEarned = this.dataSplitted[i + 1].split('<br />')[1].trim();
            commit('addMessageToChat', { text: `${this.dataSplitted[i + 1].split('&')[0]} --> ${pointsAfter} ${pointsEarned}`, type: 'div' });
          } else if (this.dataSplitted[i] === '-fail') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'heal') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s HP is full!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'unboost') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s stats were not lowered!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Substitute') {
                    commit('addMessageToChat', { text: `But ${pokemon.name} does not have enough HP left to make a substitute!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[from] Uproar') {
                    commit('addMessageToChat', { text: `${pokemon.name} can't sleep in an uproar!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[from] ability') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                  } else {
                    commit('addMessageToChat', { text: 'But it failed!', type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'heal') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s HP is full!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'unboost') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s stats were not lowered!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Substitute') {
                    commit('addMessageToChat', { text: `But the opposing ${pokemon.name} does not have enough HP left to make a substitute!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[from] Uproar') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} can't sleep in an uproar!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[from] ability') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                  } else {
                    commit('addMessageToChat', { text: 'But it failed!', type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-activate') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'move: Electric Terrain' || this.dataSplitted[i + 2].trim() === 'move: Psychic Terrain') {
                    commit('addMessageToChat', { text: `${pokemon.name} is protected by the ${this.dataSplitted[i + 2].substr(6).trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Misty Terrain') {
                    commit('addMessageToChat', { text: `${pokemon.name} surrounds itself with a protective mist!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Crafty Shield' || this.dataSplitted[i + 2].trim() === 'move: Wide Guard' || this.dataSplitted[i + 2].trim() === 'move: Quick Guard') {
                    commit('addMessageToChat', { text: `${this.dataSplitted[i + 2].substr(6).trim()} protected ${pokemon.name}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Ingrain') {
                    commit('addMessageToChat', { text: `${pokemon.name} is anchored in place with its roots!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Mat Block') {
                    commit('addMessageToChat', { text: `${this.dataSplitted[i + 3].trim()} was blocked by the kicked-up mat!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Mist') {
                    commit('addMessageToChat', { text: `${pokemon.name} is protected by the mist!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Protect') {
                    commit('addMessageToChat', { text: `${pokemon.name} protected itself!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Safeguard') {
                    commit('addMessageToChat', { text: `${pokemon.name} is protected by Safeguard!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Disguise') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name}'s disguise was busted!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Sticky Hold') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name}'s item cannot be removed!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Suction Cups') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} is anchored in place with its suction cups!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Mummy') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${this.dataSplitted[i + 4].substr(10)}'s ability became Mummy!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Protective Pads') {
                    commit('addMessageToChat', { text: `${pokemon.name} protected itself with its Protective Pads!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Safety Goggles') {
                    commit('addMessageToChat', { text: `${pokemon.name} is not affected by ${this.dataSplitted[i + 3].trim()} thanks to its Safety Goggles!`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'move: Electric Terrain' || this.dataSplitted[i + 2].trim() === 'move: Psychic Terrain') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is protected by the ${this.dataSplitted[i + 2].substr(6).trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Misty Terrain') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} surrounds itself with a protective mist!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Crafty Shield' || this.dataSplitted[i + 2].trim() === 'move: Wide Guard' || this.dataSplitted[i + 2].trim() === 'move: Quick Guard') {
                    commit('addMessageToChat', { text: `${this.dataSplitted[i + 2].substr(6).trim()} protected the opposing ${pokemon.name}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Ingrain') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is anchored in place with its roots!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Mat Block') {
                    commit('addMessageToChat', { text: `${this.dataSplitted[i + 3].trim()} was blocked by the kicked-up mat!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Mist') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is protected by the mist!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Protect') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} protected itself!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Safeguard') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is protected by Safeguard!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Disguise') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s disguise was busted!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Sticky Hold') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s item cannot be removed!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Suction Cups') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is anchored in place with its suction cups!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Mummy') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${this.dataSplitted[i + 4].substr(10)}'s ability became Mummy!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Protective Pads') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} protected itself with its Protective Pads!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Safety Goggles') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is not affected by ${this.dataSplitted[i + 3].trim()} thanks to its Safety Goggles!`, type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-block') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'ability: Aroma Veil') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} is protected by an aromatic veil!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Sweet Veil') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} can't fall asleep due to a veil of sweetness!`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'ability: Aroma Veil') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is protected by an aromatic veil!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Sweet Veil') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} can't fall asleep due to a veil of sweetness!`, type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-ability') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 3].trim() === '[from] ability: Trace') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s Trace]`, type: 'div' });
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name}'s traced the opposing ${this.dataSplitted[i + 4].substr(10)}'s ${this.dataSplitted[i + 2]}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[from] move: Role Play') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2]}]`, type: 'div' });
                  } else {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 3].trim() === '[from] ability: Trace') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s Trace]`, type: 'div' });
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s traced ${this.dataSplitted[i + 4].substr(10)}'s ${this.dataSplitted[i + 2]}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[from] move: Role Play') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2]}]`, type: 'div' });
                  } else {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-endability') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i - 2].trim() === 'Gastro Acid') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s ability was suppressed!`, type: 'div' });
                  } else if (this.dataSplitted[i - 2].trim() === 'Role Play') {
                    commit('addMessageToChat', { text: `${pokemon.name} copied ${this.dataSplitted[i - 1].substr(5)}'s ability!`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i - 2].trim() === 'Gastro Acid') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s ability was suppressed!`, type: 'div' });
                  } else if (this.dataSplitted[i - 2].trim() === 'Role Play') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} copied ${this.dataSplitted[i - 1].substr(5)}'s ability!`, type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === 'faint') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  state.userTeam[state.userTeam.indexOf(pokemon)].faint = true;
                  commit('addMessageToChat', { text: `${pokemon.name} fainted!`, type: 'div' });
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint = true;
                  commit('addMessageToChat', { text: `${pokemon.name} fainted!`, type: 'div' });
                }
              });
            }
          }
        }
      };
    },
  },
  modules: {

  },
};
