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
    currentPokemonP1: {
      name: '',
      boost: {
        stats: {
          atk: '',
          def: '',
          spa: '',
          spd: '',
          spe: '',
          accuracy: '',
        },
      },
    },
    currentPokemonP2: {
      name: '',
      boost: {
        stats: {
          atk: '',
          def: '',
          spa: '',
          spd: '',
          spe: '',
          accuracy: '',
        },
      },
    },
    splitted1: '',
    splitted2: '',
    splitted3: '',
    currentWeather: '',
    weatherTurnsLeft: 5,
    zoroarkIndexUserTeam: -1,
    zoruaIndexUserTeam: -1,
    zoroarkIndexRivalTeam: -1,
    zoruaIndexRivalTeam: -1,
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
    // eslint-disable-next-line
    statBoost(state, { boost, number, player, statName }) {
      if (player === 'p1') {
        if (statName === 'atk') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.atk += 1;
              state.boostText = 'attack rose!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.atk += 2;
              state.boostText = 'attack rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.atk = 6;
              state.boostText = 'maximized its attack!';
            } else if (number === '0') {
              state.boostText = 'attack won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.atk -= 1;
              state.boostText = 'attack fell!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.atk -= 2;
              state.boostText = 'attack sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.atk = -6;
              state.boostText = 'attack minimized its!';
            } else if (number === '0') {
              state.boostText = 'attack won\'t go any lower!';
            }
          }
        } else if (statName === 'def') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.def += 1;
              state.boostText = 'defense rose!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.def += 2;
              state.boostText = 'defense rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.def = 6;
              state.boostText = 'maximized its defense!';
            } else if (number === '0') {
              state.boostText = 'defense won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.def -= 1;
              state.boostText = 'defense fell!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.def -= 2;
              state.boostText = 'defense sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.def = -6;
              state.boostText = 'minimized its defense!';
            } else if (number === '0') {
              state.boostText = 'defense won\'t go any lower!';
            }
          }
        } else if (statName === 'spa') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.spa += 1;
              state.boostText = 'special attack rose!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.spa += 2;
              state.boostText = 'special attack rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.spa = 6;
              state.boostText = 'maximized its special attack!';
            } else if (number === '0') {
              state.boostText = 'special attack won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.spa -= 1;
              state.boostText = 'special attack fell!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.spa -= 2;
              state.boostText = 'special attack sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.spa = -6;
              state.boostText = 'minimized its special attack!';
            } else if (number === '0') {
              state.boostText = 'special attack won\'t go any lower!';
            }
          }
        } else if (statName === 'spd') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.spd += 1;
              state.boostText = 'special defense rose!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.spd += 2;
              state.boostText = 'special defense rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.spd = 6;
              state.boostText = 'maximized its special defense!';
            } else if (number === '0') {
              state.boostText = 'special defense won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.spd -= 1;
              state.boostText = 'special defense fell!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.spd -= 2;
              state.boostText = 'special defense sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.spd = -6;
              state.boostText = 'minimized its special defense!';
            } else if (number === '0') {
              state.boostText = 'special defense won\'t go any lower!';
            }
          }
        } else if (statName === 'spe') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.spe += 1;
              state.boostText = 'speed rose!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.spe += 2;
              state.boostText = 'speed rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.spe = 6;
              state.boostText = 'maximized its speed!';
            } else if (number === '0') {
              state.boostText = 'speed won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.spe -= 1;
              state.boostText = 'speed fell!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.spe -= 2;
              state.boostText = 'speed sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.spe = -6;
              state.boostText = 'minimized its speed!';
            } else if (number === '0') {
              state.boostText = 'speed won\'t go any lower!';
            }
          }
        } else if (statName === 'accuracy') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.def += 1;
              state.boostText = 'accuracy rose!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.def += 2;
              state.boostText = 'accuracy rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.def = 6;
              state.boostText = 'maximized its accuracy!';
            } else if (number === '0') {
              state.boostText = 'accuracy won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.def -= 1;
              state.boostText = 'accuracy fell!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.def -= 2;
              state.boostText = 'accuracy sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.def = -6;
              state.boostText = 'minimized its accuracy!';
            } else if (number === '0') {
              state.boostText = 'accuracy won\'t go any lower!';
            }
          }
        } else if (statName === 'evasion') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.def += 1;
              state.boostText = 'evasiveness rose!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.def += 2;
              state.boostText = 'evasiveness rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.def = 6;
              state.boostText = 'maximized its evasiveness!';
            } else if (number === '0') {
              state.boostText = 'evasiveness won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP1.boost.stats.def -= 1;
              state.boostText = 'evasiveness fell!';
            } else if (number === '2') {
              state.currentPokemonP1.boost.stats.def -= 2;
              state.boostText = 'evasiveness sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP1.boost.stats.def = -6;
              state.boostText = 'minimized its evasiveness!';
            } else if (number === '0') {
              state.boostText = 'evasiveness won\'t go any lower!';
            }
          }
        }
      } else if (player === 'p2') {
        if (statName === 'atk') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.atk += 1;
              state.boostText = 'attack rose!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.atk += 2;
              state.boostText = 'attack rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.atk = 6;
              state.boostText = 'maximized its attack!';
            } else if (number === '0') {
              state.boostText = 'attack won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.atk -= 1;
              state.boostText = 'attack fell!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.atk -= 2;
              state.boostText = 'attack sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.atk = -6;
              state.boostText = 'attack minimized its!';
            } else if (number === '0') {
              state.boostText = 'attack won\'t go any lower!';
            }
          }
        } else if (statName === 'def') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.def += 1;
              state.boostText = 'defense rose!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.def += 2;
              state.boostText = 'defense rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.def = 6;
              state.boostText = 'maximized its defense!';
            } else if (number === '0') {
              state.boostText = 'defense won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.def -= 1;
              state.boostText = 'defense fell!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.def -= 2;
              state.boostText = 'defense sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.def = -6;
              state.boostText = 'minimized its defense!';
            } else if (number === '0') {
              state.boostText = 'defense won\'t go any lower!';
            }
          }
        } else if (statName === 'spa') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.spa += 1;
              state.boostText = 'special attack rose!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.spa += 2;
              state.boostText = 'special attack rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.spa = 6;
              state.boostText = 'maximized its special attack!';
            } else if (number === '0') {
              state.boostText = 'special attack won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.spa -= 1;
              state.boostText = 'special attack fell!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.spa -= 2;
              state.boostText = 'special attack sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.spa = -6;
              state.boostText = 'minimized its special attack!';
            } else if (number === '0') {
              state.boostText = 'special attack won\'t go any lower!';
            }
          }
        } else if (statName === 'spd') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.spd += 1;
              state.boostText = 'special defense rose!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.spd += 2;
              state.boostText = 'special defense rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.spd = 6;
              state.boostText = 'maximized its special defense!';
            } else if (number === '0') {
              state.boostText = 'special defense won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.spd -= 1;
              state.boostText = 'special defense fell!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.spd -= 2;
              state.boostText = 'special defense sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.spd = -6;
              state.boostText = 'minimized its special defense!';
            } else if (number === '0') {
              state.boostText = 'special defense won\'t go any lower!';
            }
          }
        } else if (statName === 'spe') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.spe += 1;
              state.boostText = 'speed rose!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.spe += 2;
              state.boostText = 'speed rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.spe = 6;
              state.boostText = 'maximized its speed!';
            } else if (number === '0') {
              state.boostText = 'speed won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.spe -= 1;
              state.boostText = 'speed fell!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.spe -= 2;
              state.boostText = 'speed sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.spe = -6;
              state.boostText = 'minimized its speed!';
            } else if (number === '0') {
              state.boostText = 'speed won\'t go any lower!';
            }
          }
        } else if (statName === 'accuracy') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.def += 1;
              state.boostText = 'accuracy rose!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.def += 2;
              state.boostText = 'accuracy rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.def = 6;
              state.boostText = 'maximized its accuracy!';
            } else if (number === '0') {
              state.boostText = 'accuracy won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.def -= 1;
              state.boostText = 'accuracy fell!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.def -= 2;
              state.boostText = 'accuracy sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.def = -6;
              state.boostText = 'minimized its accuracy!';
            } else if (number === '0') {
              state.boostText = 'accuracy won\'t go any lower!';
            }
          }
        } else if (statName === 'evasion') {
          if (boost === '-boost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.def += 1;
              state.boostText = 'evasiveness rose!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.def += 2;
              state.boostText = 'evasiveness rose sharply!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.def = 6;
              state.boostText = 'maximized its evasiveness!';
            } else if (number === '0') {
              state.boostText = 'evasiveness won\'t go any higher!';
            }
          } else if (boost === '-unboost' || boost === '-setboost') {
            if (number === '1') {
              state.currentPokemonP2.boost.stats.def -= 1;
              state.boostText = 'evasiveness fell!';
            } else if (number === '2') {
              state.currentPokemonP2.boost.stats.def -= 2;
              state.boostText = 'evasiveness sharply fell!';
            } else if (number === '6') {
              state.currentPokemonP2.boost.stats.def = -6;
              state.boostText = 'minimized its evasiveness!';
            } else if (number === '0') {
              state.boostText = 'evasiveness won\'t go any lower!';
            }
          }
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
            commit('addMessageToChat', { text: `Player 1 is ${this.p1}`, type: 'div' });
          } else if ((this.dataSplitted[i] === 'player') && (this.dataSplitted[i + 1] === 'p2')) {
            // eslint-disable-next-line prefer-destructuring
            this.p2 = this.dataSplitted[i + 2];
            commit('addMessageToChat', { text: `Player 2 is ${this.p2}`, type: 'div' });
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
                    formeChange: {
                      hasChange: false,
                      form: '',
                      switchChange: true,
                    },
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
            }
          } else if (this.dataSplitted[i] === 'poke' && this.dataSplitted[i + 1] !== state.userNumber) {
            const pokemon = {
              name: this.dataSplitted[i + 2].split(',')[0],
              nickname: '',
              currentHPpercentage: 100,
              maxHPpercentage: 100,
              faint: false,
              status: '',
              formeChange: {
                hasChange: false,
                form: '',
                switchChange: true,
              },
            };
            state.rivalTeam.push(pokemon);
          } else if (this.dataSplitted[i] === 'switch') {
            let faint;
            if (this.dataSplitted[i + 1].substr(0, 3) === 'p1a') {
              if (state.currentPokemonP1.name === '') {
                // eslint-disable-next-line
                state.currentPokemonP1.name = this.dataSplitted[i + 2].split(',')[0];
                state.currentPokemonP1.boost.stats.atk = 0;
                state.currentPokemonP1.boost.stats.def = 0;
                state.currentPokemonP1.boost.stats.spa = 0;
                state.currentPokemonP1.boost.stats.spd = 0;
                state.currentPokemonP1.boost.stats.spe = 0;
                state.currentPokemonP1.boost.stats.accuracy = 0;
                if (state.userNumber === 'p1') {
                  state.userTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP1.name){
                      // eslint-disable-next-line
                      state.userTeam[state.userTeam.indexOf(pokemon)].currentHP = this.dataSplitted[i + 3].split('/')[0];
                      // eslint-disable-next-line
                      state.userTeam[state.userTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                      state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.hasChange = false;
                      state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.form = '';
                      // eslint-disable-next-line
                      state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.switchChange = true;
                    }
                  });
                } else if (state.userNumber !== 'p1') {
                  if (state.currentPokemonP1.name.substr(0, 7).trim() === 'Urshifu') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === 'Urshifu-*'){
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.switchChange = true;
                      }
                    });
                  } else if (state.currentPokemonP1.name.substr(0, 8).trim() === 'Silvally') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === 'Silvally-*'){
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.switchChange = true;
                      }
                    });
                  } else if (state.currentPokemonP1.name.substr(0, 9).trim() === 'Pumpkaboo') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === 'Pumpkaboo-*'){
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.switchChange = true;
                      }
                    });
                  } else if (state.currentPokemonP1.name.substr(0, 9).trim() === 'Gourgeist') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === 'Gourgeist-*'){
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.switchChange = true;
                      }
                    });
                  } else {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === state.currentPokemonP1.name){
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.switchChange = true;
                      }
                    });
                  }
                }
                commit('addMessageToChat', { text: `${this.p1} sent out ${state.currentPokemonP1.name}!`, type: 'div' });
              } else {
                if (state.userNumber === 'p1') {
                  state.userTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP1.name) {
                      // eslint-disable-next-line
                      faint = pokemon.faint;
                    }
                  });
                } else if (state.userNumber !== 'p1') {
                  state.rivalTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP1.name) {
                      // eslint-disable-next-line
                      faint = pokemon.faint;
                    }
                  });
                }
                if (faint === false) {
                  commit('addMessageToChat', { text: `${this.p1} withdraw ${state.currentPokemonP1.name}!`, type: 'div' });
                }
                // eslint-disable-next-line
                state.currentPokemonP1.name = this.dataSplitted[i + 2].split(',')[0];
                state.currentPokemonP1.boost.stats.atk = 0;
                state.currentPokemonP1.boost.stats.def = 0;
                state.currentPokemonP1.boost.stats.spa = 0;
                state.currentPokemonP1.boost.stats.spd = 0;
                state.currentPokemonP1.boost.stats.spe = 0;
                state.currentPokemonP1.boost.stats.accuracy = 0;
                if (state.userNumber === 'p1') {
                  state.userTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP1.name) {
                      if (state.userTeam[state.userTeam.indexOf(pokemon)].faint === true) {
                        state.userTeam[state.userTeam.indexOf(pokemon)].faint = false;
                        state.userTeam.forEach((pokemonIllusion) => {
                          // eslint-disable-next-line
                          if (pokemonIllusion.name === 'Zoroark') {
                            state.zoroarkIndexUserTeam = state.userTeam.indexOf(pokemonIllusion);
                          } else if (pokemonIllusion.name === 'Zorua') {
                            state.zoruaIndexUserTeam = state.userTeam.indexOf(pokemonIllusion);
                          }
                        });
                        if (state.zoroarkIndexUserTeam !== -1 && state.zoruaIndexUserTeam !== -1) {
                          if (state.userTeam[state.zoroarkIndexUserTeam].faint === true) {
                            // eslint-disable-next-line
                            state.userTeam[state.zoruaIndexUserTeam].currentHP = 0;
                            // eslint-disable-next-line
                            state.userTeam[state.zoruaIndexUserTeam].faint = true;
                          } else if (state.userTeam[state.zoroarkIndexUserTeam].faint === false) {
                            // eslint-disable-next-line
                            state.userTeam[state.zoroarkIndexUserTeam].currentHP = 0;
                            // eslint-disable-next-line
                            state.userTeam[state.zoroarkIndexUserTeam].faint = true;
                          }
                          // eslint-disable-next-line
                        } else if (state.zoroarkIndexUserTeam !== -1 && state.zoruaIndexUserTeam === -1) {
                          // eslint-disable-next-line
                          state.userTeam[state.zoroarkIndexUserTeam].currentHP = 0;
                          // eslint-disable-next-line
                          state.userTeam[state.zoroarkIndexUserTeam].faint = true;
                          // eslint-disable-next-line
                        } else if (state.zoroarkIndexUserTeam === -1 && state.zoruaIndexUserTeam !== -1) {
                          // eslint-disable-next-line
                          state.userTeam[state.zoruaIndexUserTeam].currentHP = 0;
                          // eslint-disable-next-line
                          state.userTeam[state.zoruaIndexUserTeam].faint = true;
                        }
                      }
                      // eslint-disable-next-line
                      state.userTeam[state.userTeam.indexOf(pokemon)].currentHP = this.dataSplitted[i + 3].split('/')[0];
                      // eslint-disable-next-line
                      if (pokemon.formeChange.switchChange === true) {
                        // eslint-disable-next-line
                        state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.hasChange = false;
                        state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.form = '';
                      }
                    }
                  });
                } else if (state.userNumber !== 'p1') {
                  if (state.currentPokemonP1.name.substr(0, 7).trim() === 'Urshifu') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name.substr(0, 9).trim() === 'Urshifu') {
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint === true) {
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint = false;
                          state.rivalTeam.forEach((pokemonIllusion) => {
                            // eslint-disable-next-line
                            if (pokemonIllusion.name === 'Zoroark') {
                              // eslint-disable-next-line
                              state.zoroarkIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            } else if (pokemonIllusion.name === 'Zorua') {
                              state.zoruaIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            }
                          });
                          // eslint-disable-next-line
                          if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam !== -1) {
                            if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === true) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                              // eslint-disable-next-line
                            } else if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === false) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            }
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam === -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam === -1 && state.zoruaIndexRivalTeam !== -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                          }
                        }
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        if (pokemon.formeChange.switchChange === true) {
                          // eslint-disable-next-line
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        }
                      }
                    });
                    // eslint-disable-next-line
                  } else if (state.currentPokemonP1.name.substr(0, 8).trim() === 'Silvally') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name.substr(0, 8).trim() === 'Silvally') {
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint === true) {
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint = false;
                          state.rivalTeam.forEach((pokemonIllusion) => {
                            // eslint-disable-next-line
                            if (pokemonIllusion.name === 'Zoroark') {
                              // eslint-disable-next-line
                              state.zoroarkIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            } else if (pokemonIllusion.name === 'Zorua') {
                              state.zoruaIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            }
                          });
                          // eslint-disable-next-line
                          if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam !== -1) {
                            if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === true) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                              // eslint-disable-next-line
                            } else if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === false) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            }
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam === -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam === -1 && state.zoruaIndexRivalTeam !== -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                          }
                        }
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        if (pokemon.formeChange.switchChange === true) {
                          // eslint-disable-next-line
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        }
                      }
                    });
                  } else if (state.currentPokemonP1.name.substr(0, 9).trim() === 'Pumpkaboo') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name.substr(0, 9).trim() === 'Pumpkaboo') {
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint === true) {
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint = false;
                          state.rivalTeam.forEach((pokemonIllusion) => {
                            // eslint-disable-next-line
                            if (pokemonIllusion.name === 'Zoroark') {
                              // eslint-disable-next-line
                              state.zoroarkIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            } else if (pokemonIllusion.name === 'Zorua') {
                              state.zoruaIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            }
                          });
                          // eslint-disable-next-line
                          if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam !== -1) {
                            if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === true) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                              // eslint-disable-next-line
                            } else if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === false) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            }
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam === -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam === -1 && state.zoruaIndexRivalTeam !== -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                          }
                        }
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        if (pokemon.formeChange.switchChange === true) {
                          // eslint-disable-next-line
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        }
                      }
                    });
                  } else if (state.currentPokemonP1.name.substr(0, 9).trim() === 'Gourgeist') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name.substr(0, 9).trim() === 'Gourgeist') {
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint === true) {
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint = false;
                          state.rivalTeam.forEach((pokemonIllusion) => {
                            // eslint-disable-next-line
                            if (pokemonIllusion.name === 'Zoroark') {
                              // eslint-disable-next-line
                              state.zoroarkIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            } else if (pokemonIllusion.name === 'Zorua') {
                              state.zoruaIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            }
                          });
                          // eslint-disable-next-line
                          if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam !== -1) {
                            if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === true) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                              // eslint-disable-next-line
                            } else if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === false) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            }
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam === -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam === -1 && state.zoruaIndexRivalTeam !== -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                          }
                        }
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        if (pokemon.formeChange.switchChange === true) {
                          // eslint-disable-next-line
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        }
                      }
                    });
                  } else {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === state.currentPokemonP1.name) {
                        if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint === true) {
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint = false;
                          state.rivalTeam.forEach((pokemonIllusion) => {
                            // eslint-disable-next-line
                            if (pokemonIllusion.name === 'Zoroark') {
                              // eslint-disable-next-line
                              state.zoroarkIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            } else if (pokemonIllusion.name === 'Zorua') {
                              state.zoruaIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            }
                          });
                          // eslint-disable-next-line
                          if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam !== -1) {
                            if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === true) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                              // eslint-disable-next-line
                            } else if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === false) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            }
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam === -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam === -1 && state.zoruaIndexRivalTeam !== -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                          }
                        }
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        if (pokemon.formeChange.switchChange === true) {
                          // eslint-disable-next-line
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        }
                      }
                    });
                  }
                }
                commit('addMessageToChat', { text: `${this.p1} sent out ${state.currentPokemonP1.name}!`, type: 'div' });
              }
            } else if (this.dataSplitted[i + 1].substr(0, 3) === 'p2a') {
              if (state.currentPokemonP2.name === '') {
                // eslint-disable-next-line
                state.currentPokemonP2.name = this.dataSplitted[i + 2].split(',')[0];
                state.currentPokemonP2.boost.stats.atk = 0;
                state.currentPokemonP2.boost.stats.def = 0;
                state.currentPokemonP2.boost.stats.spa = 0;
                state.currentPokemonP2.boost.stats.spd = 0;
                state.currentPokemonP2.boost.stats.spe = 0;
                state.currentPokemonP2.boost.stats.accuracy = 0;
                if (state.userNumber === 'p2') {
                  state.userTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP2.name){
                      // eslint-disable-next-line
                      state.userTeam[state.userTeam.indexOf(pokemon)].currentHP = this.dataSplitted[i + 3].split('/')[0];
                      // eslint-disable-next-line
                      state.userTeam[state.userTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                      // eslint-disable-next-line
                      state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.hasChange = false;
                      state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.form = '';
                      // eslint-disable-next-line
                      state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.switchChange = true;
                    }
                  });
                } else if (state.userNumber !== 'p2') {
                  if (state.currentPokemonP2.name.substr(0, 7).trim() === 'Urshifu') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === 'Urshifu-*'){
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.switchChange = true;
                      }
                    });
                  } else if (state.currentPokemonP2.name.substr(0, 8).trim() === 'Silvally') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === 'Silvally-*'){
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.switchChange = true;
                      }
                    });
                  } else if (state.currentPokemonP2.name.substr(0, 9).trim() === 'Pumpkaboo') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === 'Pumpkaboo-*'){
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.switchChange = true;
                      }
                    });
                  } else if (state.currentPokemonP2.name.substr(0, 9).trim() === 'Gourgeist') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === 'Gourgeist-*'){
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.switchChange = true;
                      }
                    });
                  } else {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === state.currentPokemonP2.name){
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.switchChange = true;
                      }
                    });
                  }
                }
                commit('addMessageToChat', { text: `${this.p2} sent out ${state.currentPokemonP2.name}!`, type: 'div' });
              } else {
                if (state.userNumber === 'p2') {
                  state.userTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP2.name) {
                      // eslint-disable-next-line
                      faint = pokemon.faint;
                    }
                  });
                } else if (state.userNumber !== 'p2') {
                  state.rivalTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP2.name) {
                      // eslint-disable-next-line
                      faint = pokemon.faint;
                    }
                  });
                }
                if (faint === false) {
                  commit('addMessageToChat', { text: `${this.p2} withdraw ${state.currentPokemonP2.name}!`, type: 'div' });
                }
                // eslint-disable-next-line
                state.currentPokemonP2.name = this.dataSplitted[i + 2].split(',')[0];
                state.currentPokemonP2.boost.stats.atk = 0;
                state.currentPokemonP2.boost.stats.def = 0;
                state.currentPokemonP2.boost.stats.spa = 0;
                state.currentPokemonP2.boost.stats.spd = 0;
                state.currentPokemonP2.boost.stats.spe = 0;
                state.currentPokemonP2.boost.stats.accuracy = 0;
                if (state.userNumber === 'p2') {
                  state.userTeam.forEach((pokemon) => {
                    // eslint-disable-next-line
                    if (pokemon.name === state.currentPokemonP2.name) {
                      if (state.userTeam[state.userTeam.indexOf(pokemon)].faint === true) {
                        state.userTeam[state.userTeam.indexOf(pokemon)].faint = false;
                        state.userTeam.forEach((pokemonIllusion) => {
                          // eslint-disable-next-line
                          if (pokemonIllusion.name === 'Zoroark') {
                            state.zoroarkIndexUserTeam = state.userTeam.indexOf(pokemonIllusion);
                          } else if (pokemonIllusion.name === 'Zorua') {
                            state.zoruaIndexUserTeam = state.userTeam.indexOf(pokemonIllusion);
                          }
                        });
                        if (state.zoroarkIndexUserTeam !== -1 && state.zoruaIndexUserTeam !== -1) {
                          if (state.userTeam[state.zoroarkIndexUserTeam].faint === true) {
                            // eslint-disable-next-line
                            state.userTeam[state.zoruaIndexUserTeam].currentHP = 0;
                            // eslint-disable-next-line
                            state.userTeam[state.zoruaIndexUserTeam].faint = true;
                          } else if (state.userTeam[state.zoroarkIndexUserTeam].faint === false) {
                            // eslint-disable-next-line
                            state.userTeam[state.zoroarkIndexUserTeam].currentHP = 0;
                            // eslint-disable-next-line
                            state.userTeam[state.zoroarkIndexUserTeam].faint = true;
                          }
                          // eslint-disable-next-line
                        } else if (state.zoroarkIndexUserTeam !== -1 && state.zoruaIndexUserTeam === -1) {
                          // eslint-disable-next-line
                          state.userTeam[state.zoroarkIndexUserTeam].currentHP = 0;
                          // eslint-disable-next-line
                          state.userTeam[state.zoroarkIndexUserTeam].faint = true;
                          // eslint-disable-next-line
                        } else if (state.zoroarkIndexUserTeam === -1 && state.zoruaIndexUserTeam !== -1) {
                          // eslint-disable-next-line
                          state.userTeam[state.zoruaIndexUserTeam].currentHP = 0;
                          // eslint-disable-next-line
                          state.userTeam[state.zoruaIndexUserTeam].faint = true;
                        }
                      }
                      // eslint-disable-next-line
                      state.userTeam[state.userTeam.indexOf(pokemon)].currentHP = this.dataSplitted[i + 3].split('/')[0];
                      // eslint-disable-next-line
                      if (pokemon.formeChange.switchChange === true) {
                        // eslint-disable-next-line
                        state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.hasChange = false;
                        state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.form = '';
                      }
                    }
                  });
                } else if (state.userNumber !== 'p2') {
                  if (state.currentPokemonP2.name.substr(0, 7).trim() === 'Urshifu') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name.substr(0, 7).trim() === 'Urshifu') {
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint === true) {
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint = false;
                          state.rivalTeam.forEach((pokemonIllusion) => {
                            // eslint-disable-next-line
                            if (pokemonIllusion.name === 'Zoroark') {
                              // eslint-disable-next-line
                              state.zoroarkIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            } else if (pokemonIllusion.name === 'Zorua') {
                              state.zoruaIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            }
                          });
                          // eslint-disable-next-line
                          if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam !== -1) {
                            if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === true) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                              // eslint-disable-next-line
                            } else if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === false) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            }
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam === -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam === -1 && state.zoruaIndexRivalTeam !== -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                          }
                        }
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        if (pokemon.formeChange.switchChange === true) {
                          // eslint-disable-next-line
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        }
                      }
                    });
                  } else if (state.currentPokemonP2.name.substr(0, 8).trim() === 'Silvally') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name.substr(0, 8).trim() === 'Silvally') {
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint === true) {
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint = false;
                          state.rivalTeam.forEach((pokemonIllusion) => {
                            // eslint-disable-next-line
                            if (pokemonIllusion.name === 'Zoroark') {
                              // eslint-disable-next-line
                              state.zoroarkIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            } else if (pokemonIllusion.name === 'Zorua') {
                              state.zoruaIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            }
                          });
                          // eslint-disable-next-line
                          if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam !== -1) {
                            if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === true) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                              // eslint-disable-next-line
                            } else if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === false) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            }
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam === -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam === -1 && state.zoruaIndexRivalTeam !== -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                          }
                        }
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        if (pokemon.formeChange.switchChange === true) {
                          // eslint-disable-next-line
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        }
                      }
                    });
                  } else if (state.currentPokemonP2.name.substr(0, 9).trim() === 'Pumpkaboo') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name.substr(0, 9).trim() === 'Pumpkaboo') {
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint === true) {
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint = false;
                          state.rivalTeam.forEach((pokemonIllusion) => {
                            // eslint-disable-next-line
                            if (pokemonIllusion.name === 'Zoroark') {
                              // eslint-disable-next-line
                              state.zoroarkIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            } else if (pokemonIllusion.name === 'Zorua') {
                              state.zoruaIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            }
                          });
                          // eslint-disable-next-line
                          if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam !== -1) {
                            if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === true) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                              // eslint-disable-next-line
                            } else if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === false) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            }
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam === -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam === -1 && state.zoruaIndexRivalTeam !== -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                          }
                        }
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        if (pokemon.formeChange.switchChange === true) {
                          // eslint-disable-next-line
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        }
                      }
                    });
                  } else if (state.currentPokemonP2.name.substr(0, 9).trim() === 'Gourgeist') {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name.substr(0, 9).trim() === 'Gourgeist') {
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].name = this.dataSplitted[i + 2].split(',')[0];
                        if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint === true) {
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint = false;
                          state.rivalTeam.forEach((pokemonIllusion) => {
                            // eslint-disable-next-line
                            if (pokemonIllusion.name === 'Zoroark') {
                              // eslint-disable-next-line
                              state.zoroarkIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            } else if (pokemonIllusion.name === 'Zorua') {
                              state.zoruaIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            }
                          });
                          // eslint-disable-next-line
                          if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam !== -1) {
                            if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === true) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                              // eslint-disable-next-line
                            } else if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === false) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            }
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam === -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam === -1 && state.zoruaIndexRivalTeam !== -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                          }
                        }
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        if (pokemon.formeChange.switchChange === true) {
                          // eslint-disable-next-line
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        }
                      }
                    });
                  } else {
                    state.rivalTeam.forEach((pokemon) => {
                      // eslint-disable-next-line
                      if (pokemon.name === state.currentPokemonP2.name) {
                        if (state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint === true) {
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].faint = false;
                          state.rivalTeam.forEach((pokemonIllusion) => {
                            // eslint-disable-next-line
                            if (pokemonIllusion.name === 'Zoroark') {
                              // eslint-disable-next-line
                              state.zoroarkIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            } else if (pokemonIllusion.name === 'Zorua') {
                              state.zoruaIndexRivalTeam = state.rivalTeam.indexOf(pokemonIllusion);
                            }
                          });
                          // eslint-disable-next-line
                          if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam !== -1) {
                            if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === true) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                              // eslint-disable-next-line
                            } else if (state.rivalTeam[state.zoroarkIndexRivalTeam].faint === false) {
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                              // eslint-disable-next-line
                              state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            }
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam !== -1 && state.zoruaIndexRivalTeam === -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoroarkIndexRivalTeam].faint = true;
                            // eslint-disable-next-line
                          } else if (state.zoroarkIndexRivalTeam === -1 && state.zoruaIndexRivalTeam !== -1) {
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].currentHPpercentage = 0;
                            // eslint-disable-next-line
                            state.rivalTeam[state.zoruaIndexRivalTeam].faint = true;
                          }
                        }
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 3].split('/')[0];
                        // eslint-disable-next-line
                        state.rivalTeam[state.rivalTeam.indexOf(pokemon)].nickname = this.dataSplitted[i + 1].substr(5);
                        if (pokemon.formeChange.switchChange === true) {
                          // eslint-disable-next-line
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                          state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                        }
                      }
                    });
                  }
                }
                commit('addMessageToChat', { text: `${this.p2} sent out ${state.currentPokemonP2.name}!`, type: 'div' });
              }
            }
          } else if ((this.dataSplitted[i] === '-boost') || (this.dataSplitted[i] === '-unboost')) {
            // eslint-disable-next-line
            commit('statBoost', { boost: this.dataSplitted[i], number: this.dataSplitted[i + 3].trim(), player: this.dataSplitted[i + 1].substr(0, 2), statName: this.dataSplitted[i + 2] });
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `${pokemon.name}'s ${state.boostText}`, type: 'div' });
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s ${state.boostText}`, type: 'div' });
                }
              });
            }
          } else if (this.dataSplitted[i] === '-setboost') {
            // eslint-disable-next-line
            commit('statBoost', { boost: this.dataSplitted[i], number: this.dataSplitted[i + 3].trim(), player: this.dataSplitted[i + 1].substr(0, 2), statName: this.dataSplitted[i + 2] });
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `${pokemon.name}'s ${state.boostText}`, type: 'div' });
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s ${state.boostText}`, type: 'div' });
                }
              });
            }
          } else if (this.dataSplitted[i] === '-swapboost') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              // eslint-disable-next-line
              if (this.dataSplitted[i + 4].trim() === '[from] move: Guard Swap') {
                if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                  state.currentPokemonP1.boost.stats.def = state.currentPokemonP2.boost.stats.def;
                  state.currentPokemonP1.boost.stats.spd = state.currentPokemonP2.boost.stats.spd;
                  state.currentPokemonP2.boost.stats.def = 0;
                  state.currentPokemonP2.boost.stats.spd = 0;
                  commit('addMessageToChat', { text: `${state.currentPokemonP1.name} switched all changes to its Defense and Special Defense with its target!`, type: 'div' });
                } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                  state.currentPokemonP2.boost.stats.def = state.currentPokemonP1.boost.stats.def;
                  state.currentPokemonP2.boost.stats.spd = state.currentPokemonP1.boost.stats.spd;
                  state.currentPokemonP1.boost.stats.def = 0;
                  state.currentPokemonP1.boost.stats.spd = 0;
                  commit('addMessageToChat', { text: `${state.currentPokemonP2.name} switched all changes to its Defense and Special Defense with its target!`, type: 'div' });
                }
              } else if (this.dataSplitted[i + 4].trim() === '[from] move: Power Swap') {
                if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                  state.currentPokemonP1.boost.stats.atk = state.currentPokemonP2.boost.stats.atk;
                  state.currentPokemonP1.boost.stats.spa = state.currentPokemonP2.boost.stats.spa;
                  state.currentPokemonP2.boost.stats.atk = 0;
                  state.currentPokemonP2.boost.stats.spa = 0;
                  commit('addMessageToChat', { text: `${state.currentPokemonP1.name} switched all changes to its Attack and Special Attack with its target!`, type: 'div' });
                } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                  state.currentPokemonP2.boost.stats.atk = state.currentPokemonP1.boost.stats.atk;
                  state.currentPokemonP2.boost.stats.spa = state.currentPokemonP1.boost.stats.spa;
                  state.currentPokemonP1.boost.stats.atk = 0;
                  state.currentPokemonP1.boost.stats.spa = 0;
                  commit('addMessageToChat', { text: `${state.currentPokemonP2.name} switched all changes to its Attack and Special Attack with its target!`, type: 'div' });
                }
              }
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              if (this.dataSplitted[i + 4].trim() === '[from] move: Guard Swap') {
                if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                  state.currentPokemonP1.boost.stats.def = state.currentPokemonP2.boost.stats.def;
                  state.currentPokemonP1.boost.stats.spd = state.currentPokemonP2.boost.stats.spd;
                  state.currentPokemonP2.boost.stats.def = 0;
                  state.currentPokemonP2.boost.stats.spd = 0;
                  commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} switched all changes to its Defense and Special Defense with its target!`, type: 'div' });
                } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                  state.currentPokemonP2.boost.stats.def = state.currentPokemonP1.boost.stats.def;
                  state.currentPokemonP2.boost.stats.spd = state.currentPokemonP1.boost.stats.spd;
                  state.currentPokemonP1.boost.stats.def = 0;
                  state.currentPokemonP1.boost.stats.spd = 0;
                  commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} switched all changes to its Defense and Special Defense with its target!`, type: 'div' });
                }
              } else if (this.dataSplitted[i + 4].trim() === '[from] move: Power Swap') {
                if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                  state.currentPokemonP1.boost.stats.atk = state.currentPokemonP2.boost.stats.atk;
                  state.currentPokemonP1.boost.stats.spa = state.currentPokemonP2.boost.stats.spa;
                  state.currentPokemonP2.boost.stats.atk = 0;
                  state.currentPokemonP2.boost.stats.spa = 0;
                  commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} switched all changes to its Attack and Special Attack with its target!`, type: 'div' });
                } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                  state.currentPokemonP2.boost.stats.atk = state.currentPokemonP1.boost.stats.atk;
                  state.currentPokemonP2.boost.stats.spa = state.currentPokemonP1.boost.stats.spa;
                  state.currentPokemonP1.boost.stats.atk = 0;
                  state.currentPokemonP1.boost.stats.spa = 0;
                  commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} switched all changes to its Attack and Special Attack with its target!`, type: 'div' });
                }
              }
            }
          } else if (this.dataSplitted[i] === '-invertboost') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.currentPokemonP1.boost.stats.atk = -state.currentPokemonP1.boost.stats.atk;
                state.currentPokemonP1.boost.stats.def = -state.currentPokemonP1.boost.stats.def;
                state.currentPokemonP1.boost.stats.spa = -state.currentPokemonP1.boost.stats.spa;
                state.currentPokemonP1.boost.stats.spd = -state.currentPokemonP1.boost.stats.spd;
                state.currentPokemonP1.boost.stats.spe = -state.currentPokemonP1.boost.stats.spe;
                // eslint-disable-next-line
                state.currentPokemonP1.boost.stats.accuracy = -state.currentPokemonP1.boost.stats.accuracy;
                commit('addMessageToChat', { text: `${state.currentPokemonP1.name}'s stat changes were inverted!`, type: 'div' });
              } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.currentPokemonP2.boost.stats.atk = -state.currentPokemonP2.boost.stats.atk;
                state.currentPokemonP2.boost.stats.def = -state.currentPokemonP2.boost.stats.def;
                state.currentPokemonP2.boost.stats.spa = -state.currentPokemonP2.boost.stats.spa;
                state.currentPokemonP2.boost.stats.spd = -state.currentPokemonP2.boost.stats.spd;
                state.currentPokemonP2.boost.stats.spe = -state.currentPokemonP2.boost.stats.spe;
                // eslint-disable-next-line
                state.currentPokemonP2.boost.stats.accuracy = -state.currentPokemonP2.boost.stats.accuracy;
                commit('addMessageToChat', { text: `${state.currentPokemonP2.name}'s stat changes were inverted!`, type: 'div' });
              }
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.currentPokemonP1.boost.stats.atk = -state.currentPokemonP1.boost.stats.atk;
                state.currentPokemonP1.boost.stats.def = -state.currentPokemonP1.boost.stats.def;
                state.currentPokemonP1.boost.stats.spa = -state.currentPokemonP1.boost.stats.spa;
                state.currentPokemonP1.boost.stats.spd = -state.currentPokemonP1.boost.stats.spd;
                state.currentPokemonP1.boost.stats.spe = -state.currentPokemonP1.boost.stats.spe;
                // eslint-disable-next-line
                state.currentPokemonP1.boost.stats.accuracy = -state.currentPokemonP1.boost.stats.accuracy;
                commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name}'s stat changes were inverted!`, type: 'div' });
              } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.currentPokemonP2.boost.stats.atk = -state.currentPokemonP2.boost.stats.atk;
                state.currentPokemonP2.boost.stats.def = -state.currentPokemonP2.boost.stats.def;
                state.currentPokemonP2.boost.stats.spa = -state.currentPokemonP2.boost.stats.spa;
                state.currentPokemonP2.boost.stats.spd = -state.currentPokemonP2.boost.stats.spd;
                state.currentPokemonP2.boost.stats.spe = -state.currentPokemonP2.boost.stats.spe;
                // eslint-disable-next-line
                state.currentPokemonP2.boost.stats.accuracy = -state.currentPokemonP2.boost.stats.accuracy;
                commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name}'s stat changes were inverted!`, type: 'div' });
              }
            }
          } else if (this.dataSplitted[i] === '-clearboost') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.currentPokemonP1.boost.stats.atk = 0;
                state.currentPokemonP1.boost.stats.def = 0;
                state.currentPokemonP1.boost.stats.spa = 0;
                state.currentPokemonP1.boost.stats.spd = 0;
                state.currentPokemonP1.boost.stats.spe = 0;
                state.currentPokemonP1.boost.stats.accuracy = 0;
                commit('addMessageToChat', { text: `${state.currentPokemonP1.name}'s stat changes were removed!`, type: 'div' });
              } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.currentPokemonP2.boost.stats.atk = 0;
                state.currentPokemonP2.boost.stats.def = 0;
                state.currentPokemonP2.boost.stats.spa = 0;
                state.currentPokemonP2.boost.stats.spd = 0;
                state.currentPokemonP2.boost.stats.spe = 0;
                state.currentPokemonP2.boost.stats.accuracy = 0;
                commit('addMessageToChat', { text: `${state.currentPokemonP2.name}'s stat changes were removed!`, type: 'div' });
              }
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.currentPokemonP1.boost.stats.atk = 0;
                state.currentPokemonP1.boost.stats.def = 0;
                state.currentPokemonP1.boost.stats.spa = 0;
                state.currentPokemonP1.boost.stats.spd = 0;
                state.currentPokemonP1.boost.stats.spe = 0;
                state.currentPokemonP1.boost.stats.accuracy = 0;
                commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name}'s stat changes were removed!`, type: 'div' });
              } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.currentPokemonP2.boost.stats.atk = 0;
                state.currentPokemonP2.boost.stats.def = 0;
                state.currentPokemonP2.boost.stats.spa = 0;
                state.currentPokemonP2.boost.stats.spd = 0;
                state.currentPokemonP2.boost.stats.spe = 0;
                state.currentPokemonP2.boost.stats.accuracy = 0;
                commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name}'s stat changes were removed!`, type: 'div' });
              }
            }
          } else if (this.dataSplitted[i].trim() === '-clearallboost') {
            state.currentPokemonP1.boost.stats.atk = 0;
            state.currentPokemonP1.boost.stats.def = 0;
            state.currentPokemonP1.boost.stats.spa = 0;
            state.currentPokemonP1.boost.stats.spd = 0;
            state.currentPokemonP1.boost.stats.spe = 0;
            state.currentPokemonP1.boost.stats.accuracy = 0;
            state.currentPokemonP2.boost.stats.atk = 0;
            state.currentPokemonP2.boost.stats.def = 0;
            state.currentPokemonP2.boost.stats.spa = 0;
            state.currentPokemonP2.boost.stats.spd = 0;
            state.currentPokemonP2.boost.stats.spe = 0;
            state.currentPokemonP2.boost.stats.accuracy = 0;
            commit('addMessageToChat', { text: 'All stat changes were eliminated!', type: 'div' });
          } else if (this.dataSplitted[i] === '-clearnegativeboost') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                if (state.currentPokemonP1.boost.stats.atk < 0) {
                  state.currentPokemonP1.boost.stats.atk = 0;
                } else if (state.currentPokemonP1.boost.stats.def < 0) {
                  state.currentPokemonP1.boost.stats.def = 0;
                } else if (state.currentPokemonP1.boost.stats.spa < 0) {
                  state.currentPokemonP1.boost.stats.spa = 0;
                } else if (state.currentPokemonP1.boost.stats.spd < 0) {
                  state.currentPokemonP1.boost.stats.spd = 0;
                } else if (state.currentPokemonP1.boost.stats.spe < 0) {
                  state.currentPokemonP1.boost.stats.spe = 0;
                } else if (state.currentPokemonP1.boost.stats.accuracy < 0) {
                  state.currentPokemonP1.boost.stats.accuracy = 0;
                }
                if (this.dataSplitted[i - 1].trim() !== 'White Herb') {
                  commit('addMessageToChat', { text: `${state.currentPokemonP1.name} returned its lowered stats to normal!`, type: 'div' });
                }
              } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                if (state.currentPokemonP2.boost.stats.atk < 0) {
                  state.currentPokemonP2.boost.stats.atk = 0;
                } else if (state.currentPokemonP2.boost.stats.def < 0) {
                  state.currentPokemonP2.boost.stats.def = 0;
                } else if (state.currentPokemonP2.boost.stats.spa < 0) {
                  state.currentPokemonP2.boost.stats.spa = 0;
                } else if (state.currentPokemonP2.boost.stats.spd < 0) {
                  state.currentPokemonP2.boost.stats.spd = 0;
                } else if (state.currentPokemonP2.boost.stats.spe < 0) {
                  state.currentPokemonP2.boost.stats.spe = 0;
                } else if (state.currentPokemonP2.boost.stats.accuracy < 0) {
                  state.currentPokemonP2.boost.stats.accuracy = 0;
                }
                if (this.dataSplitted[i - 1].trim() !== 'White Herb') {
                  commit('addMessageToChat', { text: `${state.currentPokemonP2.name} returned its lowered stats to normal!`, type: 'div' });
                }
              }
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                if (state.currentPokemonP1.boost.stats.atk < 0) {
                  state.currentPokemonP1.boost.stats.atk = 0;
                } else if (state.currentPokemonP1.boost.stats.def < 0) {
                  state.currentPokemonP1.boost.stats.def = 0;
                } else if (state.currentPokemonP1.boost.stats.spa < 0) {
                  state.currentPokemonP1.boost.stats.spa = 0;
                } else if (state.currentPokemonP1.boost.stats.spd < 0) {
                  state.currentPokemonP1.boost.stats.spd = 0;
                } else if (state.currentPokemonP1.boost.stats.spe < 0) {
                  state.currentPokemonP1.boost.stats.spe = 0;
                } else if (state.currentPokemonP1.boost.stats.accuracy < 0) {
                  state.currentPokemonP1.boost.stats.accuracy = 0;
                }
                commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} returned its lowered stats to normal!`, type: 'div' });
              } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                if (state.currentPokemonP2.boost.stats.atk < 0) {
                  state.currentPokemonP2.boost.stats.atk = 0;
                } else if (state.currentPokemonP2.boost.stats.def < 0) {
                  state.currentPokemonP2.boost.stats.def = 0;
                } else if (state.currentPokemonP2.boost.stats.spa < 0) {
                  state.currentPokemonP2.boost.stats.spa = 0;
                } else if (state.currentPokemonP2.boost.stats.spd < 0) {
                  state.currentPokemonP2.boost.stats.spd = 0;
                } else if (state.currentPokemonP2.boost.stats.spe < 0) {
                  state.currentPokemonP2.boost.stats.spe = 0;
                } else if (state.currentPokemonP2.boost.stats.accuracy < 0) {
                  state.currentPokemonP2.boost.stats.accuracy = 0;
                }
                commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} returned its lowered stats to normal!`, type: 'div' });
              }
            }
          } else if (this.dataSplitted[i] === '-copyboost') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.currentPokemonP1.boost.stats.atk = state.currentPokemonP2.boost.stats.atk;
                state.currentPokemonP1.boost.stats.def = state.currentPokemonP2.boost.stats.def;
                state.currentPokemonP1.boost.stats.spa = state.currentPokemonP2.boost.stats.spa;
                state.currentPokemonP1.boost.stats.spd = state.currentPokemonP2.boost.stats.spd;
                state.currentPokemonP1.boost.stats.spe = state.currentPokemonP2.boost.stats.spe;
                // eslint-disable-next-line
                state.currentPokemonP1.boost.stats.accuracy = state.currentPokemonP2.boost.stats.accuracy;
                commit('addMessageToChat', { text: `${state.currentPokemonP1.name} copied the opposing ${state.currentPokemonP2.name}'s stat changes!`, type: 'div' });
              } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.currentPokemonP2.boost.stats.atk = state.currentPokemonP1.boost.stats.atk;
                state.currentPokemonP2.boost.stats.def = state.currentPokemonP1.boost.stats.def;
                state.currentPokemonP2.boost.stats.spa = state.currentPokemonP1.boost.stats.spa;
                state.currentPokemonP2.boost.stats.spd = state.currentPokemonP1.boost.stats.spd;
                state.currentPokemonP2.boost.stats.spe = state.currentPokemonP1.boost.stats.spe;
                // eslint-disable-next-line
                state.currentPokemonP2.boost.stats.accuracy = state.currentPokemonP1.boost.stats.accuracy;
                commit('addMessageToChat', { text: `${state.currentPokemonP2.name} copied the opposing ${state.currentPokemonP1.name}'s stat changes!`, type: 'div' });
              }
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.currentPokemonP1.boost.stats.atk = state.currentPokemonP2.boost.stats.atk;
                state.currentPokemonP1.boost.stats.def = state.currentPokemonP2.boost.stats.def;
                state.currentPokemonP1.boost.stats.spa = state.currentPokemonP2.boost.stats.spa;
                state.currentPokemonP1.boost.stats.spd = state.currentPokemonP2.boost.stats.spd;
                state.currentPokemonP1.boost.stats.spe = state.currentPokemonP2.boost.stats.spe;
                // eslint-disable-next-line
                state.currentPokemonP1.boost.stats.accuracy = state.currentPokemonP2.boost.stats.accuracy;
                commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} copied ${state.currentPokemonP2.name}'s stat changes!`, type: 'div' });
              } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.currentPokemonP2.boost.stats.atk = state.currentPokemonP1.boost.stats.atk;
                state.currentPokemonP2.boost.stats.def = state.currentPokemonP1.boost.stats.def;
                state.currentPokemonP2.boost.stats.spa = state.currentPokemonP1.boost.stats.spa;
                state.currentPokemonP2.boost.stats.spd = state.currentPokemonP1.boost.stats.spd;
                state.currentPokemonP2.boost.stats.spe = state.currentPokemonP1.boost.stats.spe;
                // eslint-disable-next-line
                state.currentPokemonP2.boost.stats.accuracy = state.currentPokemonP1.boost.stats.accuracy;
                commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} copied ${state.currentPokemonP1.name}'s stat changes!`, type: 'div' });
              }
            }
          } else if (this.dataSplitted[i] === 'turn') {
            commit('addMessageToChat', { text: `Turn ${this.dataSplitted[i + 1]}`, type: 'h2' });
          } else if (this.dataSplitted[i] === 'move') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                // console.log(`el pokemon.name es ${pokemon.name}, el nickname es ${pokemon.nickname} y el que te dan es ${this.dataSplitted[i + 1].substr(5).trim()}`);
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 4].trim() === '[from]Magic Bounce') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s Magic Bounce]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} bounce the ${this.dataSplitted[i + 2].trim()} back!`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} used ${this.dataSplitted[i + 2]}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 4].trim() === '[from]Nature Power') {
                    commit('addMessageToChat', { text: `Nature Power turned into ${this.dataSplitted[i + 2]}!`, type: 'div' });
                  } else {
                    commit('addMessageToChat', { text: `${pokemon.name} used ${this.dataSplitted[i + 2]}!`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                // console.log(`el pokemon.name es ${pokemon.name}, el nickname es ${pokemon.nickname} y el que te dan es ${this.dataSplitted[i + 1].substr(5).trim()}`);
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  if (this.dataSplitted[i + 4].trim() === '[from]Magic Bounce') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s Magic Bounce]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} bounce the ${this.dataSplitted[i + 2].trim()} back!`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} used ${this.dataSplitted[i + 2]}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 4].trim() === '[from]Nature Power') {
                    commit('addMessageToChat', { text: `Nature Power turned into ${this.dataSplitted[i + 2]}!`, type: 'div' });
                  } else {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} used ${this.dataSplitted[i + 2]}!`, type: 'div' });
                  }
                }
              });
            }
            if (this.dataSplitted[i + 2].trim() === 'Perish Song') {
              commit('addMessageToChat', { text: 'All Pok\u00E9mon that heard the song will faint in three turns!', type: 'div' });
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
            let damage = '';
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].substr(2).trim() === 'fnt'){
                    // eslint-disable-next-line
                    damage = (100*(state.userTeam[state.userTeam.indexOf(pokemon)].currentHP))/state.userTeam[state.userTeam.indexOf(pokemon)].maxHP;
                    state.userTeam[state.userTeam.indexOf(pokemon)].currentHP = 0;
                  } else {
                    damage = (100 * (state.userTeam[state.userTeam.indexOf(pokemon)].currentHP - this.dataSplitted[i + 2].split('/')[0])) / state.userTeam[state.userTeam.indexOf(pokemon)].maxHP;
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].currentHP = this.dataSplitted[i + 2].split('/')[0];
                  }
                  if (this.dataSplitted[i + 3] !== null) {
                    if (this.dataSplitted[i + 3].substr(0, 6) !== '[from]') {
                      commit('addMessageToChat', { text: `${pokemon.name} lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(0, 6) === '[from]') {
                      if (this.dataSplitted[i + 3].substr(7, 4) === 'item') {
                        if (this.dataSplitted[i + 4].substr(0, 4) === '[of]') {
                          if (state.rivalNumber === 'p1') {
                            commit('addMessageToChat', { text: `${pokemon.name} was hurt by ${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 3].substr(13).trim()} and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                          } else {
                            commit('addMessageToChat', { text: `${pokemon.name} was hurt by ${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 3].substr(13).trim()} and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                          }
                        } else {
                          commit('addMessageToChat', { text: `${pokemon.name} was hurt by its ${this.dataSplitted[i + 3].substr(13).trim()} and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                        }
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'brn') {
                        commit('addMessageToChat', { text: `${pokemon.name} was hurt by its burn and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'psn' || this.dataSplitted[i + 3].substr(7).trim() === 'tox') {
                        commit('addMessageToChat', { text: `${pokemon.name} was hurt by poison and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'confusion') {
                        commit('addMessageToChat', { text: `${pokemon.name} hurt itself in its confusion and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Recoil' || this.dataSplitted[i + 3].substr(7).trim() === 'recoil') {
                        commit('addMessageToChat', { text: `${pokemon.name} was damaged by the recoil and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Sandstorm') {
                        commit('addMessageToChat', { text: `${pokemon.name} was buffeted by the sandstorm and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Hail') {
                        commit('addMessageToChat', { text: `${pokemon.name} was buffeted by the hail and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'highjumpkick') {
                        commit('addMessageToChat', { text: `${pokemon.name} kept going, crashed and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Curse') {
                        commit('addMessageToChat', { text: `${pokemon.name} was afflicted by the curse and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Leech Seed') {
                        commit('addMessageToChat', { text: `${pokemon.name}'s health was sapped by Leech Seed and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Spikes') {
                        commit('addMessageToChat', { text: `${pokemon.name} was hurt by the spikes and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Stealth Rock') {
                        commit('addMessageToChat', { text: `Pointed stones dug into ${pokemon.name} and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7, 7) === 'ability') {
                        if (this.dataSplitted[i + 4].substr(5, 2) === state.userNumber) {
                          commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                          commit('addMessageToChat', { text: `${pokemon.name} was hurt and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(5, 2) !== state.userNumber) {
                          if (this.dataSplitted[i + 4].substr(5, 2) === 'p1') {
                            commit('addMessageToChat', { text: `[The opposing ${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                            commit('addMessageToChat', { text: `${pokemon.name} was hurt and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                          } else if (this.dataSplitted[i + 4].substr(5, 2) === 'p2') {
                            commit('addMessageToChat', { text: `[The opposing ${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                            commit('addMessageToChat', { text: `${pokemon.name} was hurt and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                          }
                        }
                      } else if (this.dataSplitted[i + 3].substr(7, 4) === 'move') {
                        commit('addMessageToChat', { text: `${pokemon.name} was hurt by ${this.dataSplitted[i + 3].substr(13)} and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
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
                    damage = state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage;
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = 0;
                  } else {
                    damage = state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage - this.dataSplitted[i + 2].split('/')[0];
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 2].split('/')[0];
                  }
                  if (this.dataSplitted[i + 3] !== null) {
                    if (this.dataSplitted[i + 3].substr(0, 6) !== '[from]') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(0, 6) === '[from]') {
                      if (this.dataSplitted[i + 3].substr(7, 4) === 'item') {
                        if (this.dataSplitted[i + 4].substr(0, 4) === '[of]') {
                          if (state.userNumber === 'p1') {
                            commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by ${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 3].substr(13).trim()} and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                          } else {
                            commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by ${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 3].substr(13).trim()} and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                          }
                        } else {
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by its ${this.dataSplitted[i + 3].substr(13).trim()} and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                        }
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'brn') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by its burn and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'psn' || this.dataSplitted[i + 3].substr(7).trim() === 'tox') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by poison and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'confusion') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} hurt itself in its confusion and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Recoil' || this.dataSplitted[i + 3].substr(7).trim() === 'recoil') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} was damaged by the recoil and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Sandstorm') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} was buffeted by the sandstorm and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Hail') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} was buffeted by the hail and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'highjumpkick') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} kept going, crashed and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Curse') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} was afflicted by the curse and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Leech Seed') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s health was sapped by Leech Seed and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Spikes') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by the spikes and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Stealth Rock') {
                        commit('addMessageToChat', { text: `Pointed stones dug into the opposing ${pokemon.name} and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                      } else if (this.dataSplitted[i + 3].substr(7, 7) === 'ability') {
                        if (this.dataSplitted[i + 4].substr(5, 2) === state.rivalNumber) {
                          commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                          commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                        } else if (this.dataSplitted[i + 4].substr(5, 2) !== state.rivalNumber) {
                          if (this.dataSplitted[i + 4].substr(5, 2) === 'p1') {
                            commit('addMessageToChat', { text: `[${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                            commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                          } else if (this.dataSplitted[i + 4].substr(5, 2) === 'p2') {
                            commit('addMessageToChat', { text: `[${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                            commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
                          }
                        }
                      } else if (this.dataSplitted[i + 3].substr(7, 4) === 'move') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} was hurt by ${this.dataSplitted[i + 3].substr(13)} and lost ${parseFloat(damage).toFixed(1)}% of its health!`, type: 'div' });
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
                    commit('addMessageToChat', { text: `${pokemon.name} restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].substr(0, 6) === '[from]') {
                    if (this.dataSplitted[i + 3].substr(7, 4) === 'item') {
                      commit('addMessageToChat', { text: `${pokemon.name} restored ${parseFloat(healing).toFixed(1)}% of its health thanks to its ${this.dataSplitted[i + 3].substr(13).trim()}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7) === 'drain') {
                      if (state.rivalNumber === 'p1') {
                        commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} had its energy drained! ${state.currentPokemonP1.name} restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div' });
                      } else {
                        commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} had its energy drained! ${state.currentPokemonP2.name} restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div' });
                      }
                    } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Grassy Terrain') {
                      commit('addMessageToChat', { text: `${pokemon.name} restored ${parseFloat(healing).toFixed(1)}% of its health thanks to the terrain!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Aqua Ring') {
                      commit('addMessageToChat', { text: `A veil of water restored ${parseFloat(healing).toFixed(1)}% of ${pokemon.name}'s health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Ingrain') {
                      commit('addMessageToChat', { text: `${pokemon.name} absorbed nutrients with its roots and restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7) === 'ability') {
                      commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                      commit('addMessageToChat', { text: `${pokemon.name} restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7, 4).trim() === 'move') {
                      if (this.dataSplitted[i + 3].substr(13).trim() === 'Wish') {
                        state.rivalTeam.forEach((pokemonWisher) => {
                          // eslint-disable-next-line
                          if (pokemonWisher.name === this.dataSplitted[i + 4].substr(9).trim() || pokemonWisher.nickname === this.dataSplitted[i + 4].substr(9).trim()) {
                            // eslint-disable-next-line
                            commit('addMessageToChat', { text: `${pokemonWisher.name}'s wish came true and ${pokemon.name} restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div'});
                          }
                        });
                      } else if (this.dataSplitted[i + 3].substr(13).trim() === 'Healing Wish') {
                        commit('addMessageToChat', { text: `The healing wish came true and ${pokemon.name} restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div' });
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
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].substr(0, 6) === '[from]') {
                    if (this.dataSplitted[i + 3].substr(7, 4) === 'item') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} restored ${parseFloat(healing).toFixed(1)}% of its health thanks to its ${this.dataSplitted[i + 3].substr(13).trim()}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7) === 'drain') {
                      if (state.rivalNumber === 'p1') {
                        commit('addMessageToChat', { text: `${state.currentPokemonP2.name} had its energy drained! ${state.currentPokemonP1.name} restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div' });
                      } else {
                        commit('addMessageToChat', { text: `${state.currentPokemonP1.name} had its energy drained! ${state.currentPokemonP2.name} restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div' });
                      }
                    } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Grassy Terrain') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} restored ${parseFloat(healing).toFixed(1)}% of its health thanks to the terrain!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Aqua Ring') {
                      commit('addMessageToChat', { text: `A veil of water restored ${parseFloat(healing).toFixed(1)}% of the opposing ${pokemon.name}'s health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7).trim() === 'Ingrain') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} absorbed nutrients with its roots and restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7) === 'ability') {
                      commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].substr(7, 4).trim() === 'move') {
                      if (this.dataSplitted[i + 3].substr(13).trim() === 'Wish') {
                        state.rivalTeam.forEach((pokemonWisher) => {
                          // eslint-disable-next-line
                          if (pokemonWisher.name === this.dataSplitted[i + 4].substr(9).trim() || pokemonWisher.nickname === this.dataSplitted[i + 4].substr(9).trim()) {
                            // eslint-disable-next-line
                            commit('addMessageToChat', { text: `The opposing ${pokemonWisher.name}'s wish came true and ${pokemon.name} restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div'});
                          }
                        });
                      } else if (this.dataSplitted[i + 3].substr(13).trim() === 'Healing Wish') {
                        commit('addMessageToChat', { text: `The healing wish came true and the opposing ${pokemon.name} restored ${parseFloat(healing).toFixed(1)}% of its health!`, type: 'div' });
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
                  if (this.dataSplitted[i + 2].substr(0, 14) === '[from] ability') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16).trim()}]`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].substr(0, 14) === '[from] ability') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                  }
                  commit('addMessageToChat', { text: `It doesn't affect ${pokemon.name}...`, type: 'div' });
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].substr(0, 14) === '[from] ability') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16).trim()}]`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].substr(0, 14) === '[from] ability') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                  }
                  commit('addMessageToChat', { text: `It doesn't affect the opposing ${pokemon.name}...`, type: 'div' });
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
                  if (pokemon.name === state.currentPokemonP1.name) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'brn';
                    commit('addMessageToChat', { text: `${state.currentPokemonP1.name} was burned!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'brn' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2.name) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'brn';
                    commit('addMessageToChat', { text: `${state.currentPokemonP2.name} was burned!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'psn' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1.name) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'psn';
                    commit('addMessageToChat', { text: `${state.currentPokemonP1.name} was poisoned!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'psn' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2.name) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'psn';
                    commit('addMessageToChat', { text: `${state.currentPokemonP2.name} was poisoned!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'tox' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1.name) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'tox';
                    commit('addMessageToChat', { text: `${state.currentPokemonP1.name} was badly poisoned!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'tox' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2.name) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'tox';
                    commit('addMessageToChat', { text: `${state.currentPokemonP2.name} was badly poisoned!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'par' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1.name) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'par';
                    commit('addMessageToChat', { text: `${state.currentPokemonP1.name} is paralyzed! It may be unable to move!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'par' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2.name) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'par';
                    commit('addMessageToChat', { text: `${state.currentPokemonP2.name} is paralyzed! It may be unable to move!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'slp' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1.name) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'slp';
                    commit('addMessageToChat', { text: `${state.currentPokemonP1.name} fell asleep!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'slp' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2.name) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'slp';
                    commit('addMessageToChat', { text: `${state.currentPokemonP2.name} fell asleep!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'frz' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1.name) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'frz';
                    commit('addMessageToChat', { text: `${state.currentPokemonP1.name} was frozen solid!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'frz' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2.name) {
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].status = 'frz';
                    commit('addMessageToChat', { text: `${state.currentPokemonP2.name} was frozen solid!`, type: 'div' });
                  }
                });
              }
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              if (this.dataSplitted[i + 2].trim() === 'brn' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1.name) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'brn';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} was burned!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'brn' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2.name) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'brn';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} was burned!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'psn' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1.name) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'psn';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} was poisoned!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'psn' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2.name) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'psn';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} was poisoned!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'tox' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1.name) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'tox';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} was badly poisoned!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'tox' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2.name) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'tox';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} was badly poisoned!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'par' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1.name) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'par';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} is paralyzed! It may be unable to move!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'par' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2.name) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'par';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} is paralyzed! It may be unable to move!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'slp' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1.name) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'slp';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} fell asleep!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'slp' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2.name) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'slp';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} fell asleep!`, type: 'div' });
                  }
                });
              }
              if (this.dataSplitted[i + 2].trim() === 'frz' && this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP1.name) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'frz';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} was frozen solid!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].trim() === 'frz' && this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === state.currentPokemonP2.name) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].status = 'frz';
                    commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} was frozen solid!`, type: 'div' });
                  }
                });
              }
            }
          } else if (this.dataSplitted[i] === '-curestatus') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(4).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(4).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 3].trim() === '[from] ability: Natural Cure') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s Natural Cure]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} is cured by its Natural Cure!`, type: 'div' });
                  }
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
                    commit('addMessageToChat', { text: `${pokemon.name} thawed out!`, type: 'div' });
                  }
                  state.userTeam[state.userTeam.indexOf(pokemon)].status = '';
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(4).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(4).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 3].trim() === '[from] ability: Natural Cure') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s Natural Cure]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is cured by its Natural Cure!`, type: 'div' });
                  }
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
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} thawed out!`, type: 'div' });
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
                  } else if (this.dataSplitted[i + 2].trim() === 'Disable') {
                    commit('addMessageToChat', { text: `${pokemon.name} can't use ${this.dataSplitted[i + 3].trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Taunt') {
                    commit('addMessageToChat', { text: `${pokemon.name} can't use ${this.dataSplitted[i + 3]} after the taunt!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Throat Chop') {
                    commit('addMessageToChat', { text: `The effects of Throat Chop prevent ${pokemon.name} from using certain moves!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Imprison') {
                    commit('addMessageToChat', { text: `${pokemon.name} can't use its sealed ${this.dataSplitted[i + 3].trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Truant') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} is loafing around!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Damp' || this.dataSplitted[i + 2].trim() === 'ability: Queenly Majesty') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} cannot use ${this.dataSplitted[i + 3]}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} cannot use ${this.dataSplitted[i + 3]}!`, type: 'div' });
                    }
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
                  } else if (this.dataSplitted[i + 2].trim() === 'Disable') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} can't use ${this.dataSplitted[i + 3].trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Taunt') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} can't use ${this.dataSplitted[i + 3]} after the taunt!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Throat Chop') {
                    commit('addMessageToChat', { text: `The effects of Throat Chop prevent the opposing ${pokemon.name} from using certain moves!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Imprison') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} can't use its sealed ${this.dataSplitted[i + 3].trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Truant') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is loafing around!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Damp' || this.dataSplitted[i + 2].trim() === 'ability: Queenly Majesty') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP2.name} cannot use ${this.dataSplitted[i + 3]}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP1.name} cannot use ${this.dataSplitted[i + 3]}!`, type: 'div' });
                    }
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
            const messageRaw = '<div class="broadcast-red"><strong>This battle is invite-only!</strong><br />Users must be invited with <code>/invite</code> (or be staff) to join</div>';
            if (this.dataSplitted[i + 1].trim() === messageRaw) {
              commit('addMessageToChat', { text: 'This battle is invite-only! Users must be invited with /invite (or be staff) to join.', type: 'div' });
            } else {
              const pointsAfter = this.dataSplitted[i + 1].split('<strong>')[1].substr(0, 4);
              const pointsEarned = this.dataSplitted[i + 1].split('<br />')[1].trim();
              commit('addMessageToChat', { text: `${this.dataSplitted[i + 1].split('&')[0]} --> ${pointsAfter} ${pointsEarned}`, type: 'div' });
            }
          } else if (this.dataSplitted[i] === '-fail') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'heal') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s HP is full!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'unboost') {
                    if (this.dataSplitted[i + 4].substr(0, 14) === '[from] ability') {
                      commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 4].substr(16).trim()}]`, type: 'div' });
                    }
                    commit('addMessageToChat', { text: `${pokemon.name}'s stats were not lowered!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Substitute') {
                    if (pokemon.currentHP >= pokemon.maxHP / 4) {
                      commit('addMessageToChat', { text: `But ${pokemon.name} already has a substitute!`, type: 'div' });
                    } else {
                      commit('addMessageToChat', { text: `But ${pokemon.name} does not have enough HP left to make a substitute!`, type: 'div' });
                    }
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
                    if (this.dataSplitted[i + 4].substr(0, 14) === '[from] ability') {
                      commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 4].substr(16).trim()}]`, type: 'div' });
                    }
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s stats were not lowered!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Substitute') {
                    if (pokemon.currentHPpercentage >= pokemon.maxHPpercentage / 4) {
                      commit('addMessageToChat', { text: `But the opposing ${pokemon.name} already has a substitute!`, type: 'div' });
                    } else {
                      commit('addMessageToChat', { text: `But the opposing ${pokemon.name} does not have enough HP left to make a substitute!`, type: 'div' });
                    }
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
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Bind') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `${pokemon.name} was squeezed by the opposing ${state.currentPokemonP2.name}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `${pokemon.name} was squeezed by the opposing ${state.currentPokemonP1.name}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Charge') {
                    commit('addMessageToChat', { text: `${pokemon.name} began charging power!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Destiny Bond') {
                    commit('addMessageToChat', { text: `${pokemon.name} took its attacker down with it!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Fire Spin') {
                    commit('addMessageToChat', { text: `${pokemon.name} became trapped in the fiery vortex!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Whirlpool') {
                    commit('addMessageToChat', { text: `${pokemon.name} became trapped in the vortex!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Infestation') {
                    commit('addMessageToChat', { text: `${pokemon.name} has been afflicted with an infestation!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Wrap') {
                    commit('addMessageToChat', { text: `${pokemon.name} was wrapped!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Grudge') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s ${this.dataSplitted[i + 3].trim()} lost all of its PP due to the grudge!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Sand Tomb') {
                    commit('addMessageToChat', { text: `${pokemon.name} became trapped by the quicksand!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Lock-On' || this.dataSplitted[i + 2].trim() === 'move: Mind Reader') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `${pokemon.name} took aim at the opposing ${state.currentPokemonP2.name}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `${pokemon.name} took aim at the opposing ${state.currentPokemonP1.name}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Sticky Web') {
                    commit('addMessageToChat', { text: `${pokemon.name} was caught in a sticky web!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Substitute') {
                    commit('addMessageToChat', { text: `The substitute took damage for ${pokemon.name}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Aromatherapy') {
                    commit('addMessageToChat', { text: 'A soothing aroma wafted through the area!', type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Poltergeist') {
                    commit('addMessageToChat', { text: `${pokemon.name} is about to be attacked by its ${this.dataSplitted[i + 3].trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Trick') {
                    commit('addMessageToChat', { text: `${pokemon.name} switched items with its target!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Struggle') {
                    commit('addMessageToChat', { text: `${pokemon.name} has no moves left!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Gravity') {
                    commit('addMessageToChat', { text: `${pokemon.name} fell from the sky due to the gravity!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Attract') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `${pokemon.name} is in love with the opposing ${state.currentPokemonP2.name}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `${pokemon.name} is in love with the opposing ${state.currentPokemonP1.name}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Celebrate') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `Congratulations, ${this.p1}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `Congratulations, ${this.p2}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Endure') {
                    commit('addMessageToChat', { text: `${pokemon.name} endured the hit!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Feint') {
                    commit('addMessageToChat', { text: `${pokemon.name} fell for the feint!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Guard Split') {
                    commit('addMessageToChat', { text: `${pokemon.name} shared its guard with the target!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Heal Bell') {
                    commit('addMessageToChat', { text: 'A bell chimed!', type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Power Split') {
                    commit('addMessageToChat', { text: `${pokemon.name} shared its power with the target!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Phantom Force') {
                    commit('addMessageToChat', { text: `It broke through ${pokemon.name}'s protection!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Skill Swap') {
                    commit('addMessageToChat', { text: `${pokemon.name} swapped Abilities with its target!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Speed Swap') {
                    commit('addMessageToChat', { text: `${pokemon.name} switched Speed with its target!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Spite') {
                    commit('addMessageToChat', { text: `It reduced the PP of ${pokemon.name}'s ${this.dataSplitted[i + 3].trim()} by ${this.dataSplitted[i + 4].trim()}!`, type: 'div' });
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
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Synchronize') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Forewarn') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 3].trim()} was revealed!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 3].trim()} was revealed!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Mimicry') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} returned to its original type!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Quick Draw') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `Quick Draw made ${pokemon.name} move faster!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Wandering Spirit') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} swapped Abilities with its target!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Ice Face') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Protective Pads') {
                    commit('addMessageToChat', { text: `${pokemon.name} protected itself with its Protective Pads!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Safety Goggles') {
                    commit('addMessageToChat', { text: `${pokemon.name} is not affected by ${this.dataSplitted[i + 3].trim()} thanks to its Safety Goggles!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Focus Band') {
                    commit('addMessageToChat', { text: `${pokemon.name} hung on using its Focus Band!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Leppa Berry') {
                    commit('addMessageToChat', { text: `${pokemon.name} restored PP to its move ${this.dataSplitted[i + 3].trim()} using its Leppa Berry!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Quick Claw') {
                    commit('addMessageToChat', { text: `${pokemon.name} can act faster than normal, thanks to its Quick Claw!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'trapped') {
                    commit('addMessageToChat', { text: `${pokemon.name} can no longer escape!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'confusion') {
                    commit('addMessageToChat', { text: `${pokemon.name} is confused!`, type: 'div' });
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
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Bind') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} was squeezed by ${state.currentPokemonP2.name}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} was squeezed by ${state.currentPokemonP1.name}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Charge') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} began charging power!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Destiny Bond') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} took its attacker down with it!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Fire Spin') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} became trapped in the fiery vortex!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Whirlpool') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} became trapped in the vortex!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Infestation') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} has been afflicted with an infestation!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Wrap') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} was wrapped!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Grudge') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s ${this.dataSplitted[i + 3].trim()} lost all of its PP due to the grudge!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Sand Tomb') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} became trapped by the quicksand!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Lock-On' || this.dataSplitted[i + 2].trim() === 'move: Mind Reader') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} took aim at ${state.currentPokemonP2.name}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} took aim at ${state.currentPokemonP1.name}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Sticky Web') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} was caught in a sticky web!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Substitute') {
                    commit('addMessageToChat', { text: `The substitute took damage for the opposing ${pokemon.name}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Aromatherapy') {
                    commit('addMessageToChat', { text: 'A soothing aroma wafted through the area!', type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Poltergeist') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is about to be attacked by its ${this.dataSplitted[i + 3].trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Trick') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} switched items with its target!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Struggle') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} has no moves left!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Gravity') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} fell from the sky due to the gravity!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Attract') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} is in love with ${state.currentPokemonP2.name}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} is in love with ${state.currentPokemonP1.name}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Celebrate') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `Congratulations, ${this.p1}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `Congratulations, ${this.p2}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Endure') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} endured the hit!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Feint') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} fell for the feint!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Guard Split') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} shared its guard with the target!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Heal Bell') {
                    commit('addMessageToChat', { text: 'A bell chimed!', type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Power Split') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} shared its power with the target!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Phantom Force') {
                    commit('addMessageToChat', { text: `It broke through the opposing ${pokemon.name}'s protection!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Skill Swap') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} swapped Abilities with its target!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Speed Swap') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} switched Speed with its target!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Spite') {
                    commit('addMessageToChat', { text: `It reduced the PP of the opposing ${pokemon.name}'s ${this.dataSplitted[i + 3].trim()} by ${this.dataSplitted[i + 4].trim()}!`, type: 'div' });
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
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Synchronize') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Forewarn') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 3].trim()} was revealed!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 3].trim()} was revealed!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Mimicry') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} returned to its original type!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Quick Draw') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `Quick Draw made ${pokemon.name} move faster!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Wandering Spirit') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} swapped Abilities with its target!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Ice Face') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Protective Pads') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} protected itself with its Protective Pads!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Safety Goggles') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is not affected by ${this.dataSplitted[i + 3].trim()} thanks to its Safety Goggles!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Focus Band') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} hung on using its Focus Band!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Leppa Berry') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} restored PP to its move ${this.dataSplitted[i + 3].trim()} using its Leppa Berry!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'item: Quick Claw') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} can act faster than normal, thanks to its Quick Claw!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'trapped') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} can no longer escape!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'confusion') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is confused!`, type: 'div' });
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
                  } else if (this.dataSplitted[i + 2].trim() === 'Cloud Nine') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: 'The effects of the weather disappeared.', type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Mold Breaker') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} breaks the mold!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Neutralizing Gas') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: 'Neutralizing gas filled the area!', type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Perish Body') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: 'Both Pok\u00E9mon will faint in three turns!', type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Pressure') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} is exerting its pressure!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Unnerve') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: 'The opposing team is too nervous to eat Berries!', type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Anticipation') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} shuddered!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Sturdy') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `${pokemon.name} endured the hit!!`, type: 'div' });
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
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Cloud Nine') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: 'The effects of the weather disappeared.', type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Mold Breaker') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} breaks the mold!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Neutralizing Gas') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: 'Neutralizing gas filled the area!', type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Perish Body') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: 'Both Pok\u00E9mon will faint in three turns!', type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Pressure') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is exerting its pressure!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Unnerve') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: 'Your team is too nervous to eat Berries!', type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Anticipation') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} shuddered!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Sturdy') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} endured the hit!!`, type: 'div' });
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
                  commit('addMessageToChat', { text: `The opposing ${pokemon.name} fainted!`, type: 'div' });
                }
              });
            }
          } else if (this.dataSplitted[i] === '-fieldstart') {
            if (this.dataSplitted[i + 2].substr(0, 14) === '[from] ability') {
              if (this.dataSplitted[i + 3].substr(5, 2) === state.userNumber) {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === this.dataSplitted[i + 3].substr(10).trim() || pokemon.nickname === this.dataSplitted[i + 3].substr(10).trim()) {
                    // eslint-disable-next-line
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16)}]`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 3].substr(5, 2) !== state.userNumber) {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === this.dataSplitted[i + 3].substr(10).trim() || pokemon.nickname === this.dataSplitted[i + 3].substr(10).trim()) {
                    // eslint-disable-next-line
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(16)}]`, type: 'div' });
                  }
                });
              }
            }
            if (this.dataSplitted[i + 1].substr(6).trim() === 'Electric Terrain') {
              commit('addMessageToChat', { text: 'An electric current ran across the battlefield!', type: 'div' });
            } else if (this.dataSplitted[i + 1].substr(6).trim() === 'Grassy Terrain') {
              commit('addMessageToChat', { text: 'Grass grew to cover the battlefield!', type: 'div' });
            } else if (this.dataSplitted[i + 1].substr(6).trim() === 'Misty Terrain') {
              commit('addMessageToChat', { text: 'Mist swirled around the battlefield!', type: 'div' });
            } else if (this.dataSplitted[i + 1].substr(6).trim() === 'Psychic Terrain') {
              commit('addMessageToChat', { text: 'The battlefield got weird!', type: 'div' });
            } else if (this.dataSplitted[i + 1].substr(6).trim() === 'Gravity') {
              commit('addMessageToChat', { text: 'Gravity intensified!', type: 'div' });
            } else if (this.dataSplitted[i + 1].substr(6).trim() === 'Magic Room') {
              commit('addMessageToChat', { text: 'It created a bizarre area in which Pok\u00E9mon\'s held items lose their effects!', type: 'div' });
            } else if (this.dataSplitted[i + 1].substr(6).trim() === 'Trick Room') {
              if (this.dataSplitted[i + 2].substr(5, 2) === state.userNumber) {
                state.userTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === this.dataSplitted[i + 2].substr(10).trim() || pokemon.nickname === this.dataSplitted[i + 3].substr(10).trim()) {
                    // eslint-disable-next-line
                    commit('addMessageToChat', { text: `${pokemon.name} twisted the dimensions!`, type: 'div' });
                  }
                });
              } else if (this.dataSplitted[i + 2].substr(5, 2) !== state.userNumber) {
                state.rivalTeam.forEach((pokemon) => {
                  // eslint-disable-next-line
                  if (pokemon.name === this.dataSplitted[i + 2].substr(10).trim() || pokemon.nickname === this.dataSplitted[i + 3].substr(10).trim()) {
                    // eslint-disable-next-line
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} twisted the dimensions!`, type: 'div' });
                  }
                });
              }
            } else if (this.dataSplitted[i + 1].substr(6).trim() === 'Wonder Room') {
              commit('addMessageToChat', { text: 'It created a bizarre area in which Defense and Sp. Def stats are swapped!', type: 'div' });
            }
          } else if (this.dataSplitted[i] === '-fieldend') {
            if (this.dataSplitted[i + 1].substr(6).trim() === 'Electric Terrain') {
              commit('addMessageToChat', { text: 'The electricity disappeared from the battlefield.', type: 'div' });
            } else if (this.dataSplitted[i + 1].substr(6).trim() === 'Grassy Terrain') {
              commit('addMessageToChat', { text: 'The grass disappeared from the battlefield.', type: 'div' });
            } else if (this.dataSplitted[i + 1].trim() === 'Misty Terrain') {
              commit('addMessageToChat', { text: 'The mist disappeared from the battlefield.', type: 'div' });
            } else if (this.dataSplitted[i + 1].substr(6).trim() === 'Psychic Terrain') {
              commit('addMessageToChat', { text: 'The weirdness disappeared from the battlefield!', type: 'div' });
            } else if (this.dataSplitted[i + 1].substr(6).trim() === 'Gravity') {
              commit('addMessageToChat', { text: 'Gravity returned to normal!', type: 'div' });
            } else if (this.dataSplitted[i + 1].substr(6).trim() === 'Magic Room') {
              commit('addMessageToChat', { text: 'Magic Room wore off, and held items\' effects returned to normal!', type: 'div' });
            } else if (this.dataSplitted[i + 1].substr(6).trim() === 'Trick Room') {
              commit('addMessageToChat', { text: 'The twisted dimensions returned to normal!', type: 'div' });
            } else if (this.dataSplitted[i + 1].substr(6).trim() === 'Wonder Room') {
              commit('addMessageToChat', { text: 'Wonder Room wore off, and Defense and Sp. Def stats returned to normal!', type: 'div' });
            }
          } else if (this.dataSplitted[i] === '-sidestart') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              if (this.dataSplitted[i + 2].trim() === 'move: Aurora Veil') {
                commit('addMessageToChat', { text: 'Aurora Veil made your team stronger against physical and special moves!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Light Screen') {
                commit('addMessageToChat', { text: 'Light Screen made your team stronger against special moves!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Reflect') {
                commit('addMessageToChat', { text: 'Reflect made your team stronger against physical moves!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Mist') {
                commit('addMessageToChat', { text: 'Your team became shrouded in mist!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Safeguard') {
                commit('addMessageToChat', { text: 'Your team cloaked itself in a mystical veil!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Spikes') {
                commit('addMessageToChat', { text: 'Spikes were scattered on the ground all around your team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Stealth Rock') {
                commit('addMessageToChat', { text: 'Pointed stones float in the air around your team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Sticky Web') {
                commit('addMessageToChat', { text: 'A sticky web has been laid out on the ground around your team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Tailwind') {
                commit('addMessageToChat', { text: 'The Tailwind blew from behind your team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Toxic Spikes') {
                commit('addMessageToChat', { text: 'Poison spikes were scattered on the ground all around your team!', type: 'div' });
              }
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              if (this.dataSplitted[i + 2].trim() === 'move: Aurora Veil') {
                commit('addMessageToChat', { text: 'Aurora Veil made the opposing team stronger against physical and special moves!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Light Screen') {
                commit('addMessageToChat', { text: 'Light Screen made the opposing team stronger against special moves!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Reflect') {
                commit('addMessageToChat', { text: 'Reflect made the opposing team stronger against physical moves!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Mist') {
                commit('addMessageToChat', { text: 'The opposing team became shrouded in mist!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Safeguard') {
                commit('addMessageToChat', { text: 'The opposing team cloaked itself in a mystical veil!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Spikes') {
                commit('addMessageToChat', { text: 'Spikes were scattered on the ground all around the opposing team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Stealth Rock') {
                commit('addMessageToChat', { text: 'Pointed stones float in the air around the opposing team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Sticky Web') {
                commit('addMessageToChat', { text: 'A sticky web has been laid out on the ground around the opposing team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Tailwind') {
                commit('addMessageToChat', { text: 'The Tailwind blew from behind the opposing team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Toxic Spikes') {
                commit('addMessageToChat', { text: 'Poison spikes were scattered on the ground all around the opposing team!', type: 'div' });
              }
            }
          } else if (this.dataSplitted[i] === '-sideend') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              if (this.dataSplitted[i + 2].trim() === 'move: Aurora Veil') {
                commit('addMessageToChat', { text: 'Your team\'s Aurora Veil wore off!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Light Screen') {
                commit('addMessageToChat', { text: 'Your team\'s Light Screen wore off!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Reflect') {
                commit('addMessageToChat', { text: 'Your team\'s Reflect wore off!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Mist') {
                commit('addMessageToChat', { text: 'Your team is no longer protected by mist!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Safeguard') {
                commit('addMessageToChat', { text: 'Your team is no longer protected by Safeguard!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Spikes') {
                commit('addMessageToChat', { text: 'The spikes disappeared from the ground around your team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Stealth Rock') {
                commit('addMessageToChat', { text: 'The pointed stones disappeared from around your team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Sticky Web') {
                commit('addMessageToChat', { text: 'The sticky web has disappeared from the ground around your team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Tailwind') {
                commit('addMessageToChat', { text: 'Your team\'s Tailwind petered out!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Toxic Spikes') {
                commit('addMessageToChat', { text: 'The poison spikes disappeared from the ground around your team!', type: 'div' });
              }
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              if (this.dataSplitted[i + 2].trim() === 'move: Aurora Veil') {
                commit('addMessageToChat', { text: 'The opposing team\'s Aurora Veil wore off!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Light Screen') {
                commit('addMessageToChat', { text: 'The opposing team\'s Light Screen wore off!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Reflect') {
                commit('addMessageToChat', { text: 'The opposing team\'s Reflect wore off!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Mist') {
                commit('addMessageToChat', { text: 'The opposing team is no longer protected by mist!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Safeguard') {
                commit('addMessageToChat', { text: 'The opposing team is no longer protected by Safeguard!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Spikes') {
                commit('addMessageToChat', { text: 'The spikes disappeared from the ground around the opposing team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Stealth Rock') {
                commit('addMessageToChat', { text: 'The pointed stones disappeared from around the opposing team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Sticky Web') {
                commit('addMessageToChat', { text: 'The sticky web has disappeared from the ground around the opposing team!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'move: Tailwind') {
                commit('addMessageToChat', { text: 'The opposing team\'s Tailwind petered out!', type: 'div' });
              } else if (this.dataSplitted[i + 2].trim() === 'Toxic Spikes') {
                commit('addMessageToChat', { text: 'The poison spikes disappeared from the ground around the opposing team!', type: 'div' });
              }
            }
          } else if (this.dataSplitted[i] === '-start') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'Aqua Ring') {
                    commit('addMessageToChat', { text: `${pokemon.name} surrounded itself with a veil of water!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Attract') {
                    if (this.dataSplitted[i + 3].trim() === '[from] item: Destiny Knot') {
                      commit('addMessageToChat', { text: `${pokemon.name} fell in love because of the Destiny Knot!`, type: 'div' });
                    } else {
                      commit('addMessageToChat', { text: `${pokemon.name} fell in love!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'Autotomize') {
                    commit('addMessageToChat', { text: `${pokemon.name} became nimble!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Curse') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} cut its own HP and put a curse on ${pokemon.name}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} cut its own HP and put a curse on ${pokemon.name}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'Disable') {
                    if (this.dataSplitted[i + 4].trim() === '[from] ability: Cursed Body') {
                      if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                        commit('addMessageToChat', { text: `[The opposing ${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 4].substr(16)}]`, type: 'div' });
                      } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                        commit('addMessageToChat', { text: `[The opposing ${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 4].substr(16)}]`, type: 'div' });
                      }
                    }
                    commit('addMessageToChat', { text: `${pokemon.name}'s ${this.dataSplitted[i + 3].trim()} was disabled!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Imprison') {
                    commit('addMessageToChat', { text: `${pokemon.name} sealed any moves its target shares with it!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Doom Desire') {
                    commit('addMessageToChat', { text: `${pokemon.name} chose Doom Desire as its destiny!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Encore') {
                    commit('addMessageToChat', { text: `${pokemon.name} must do an encore!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Focus Energy') {
                    commit('addMessageToChat', { text: `${pokemon.name} is getting pumped!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Future Sight') {
                    commit('addMessageToChat', { text: `${pokemon.name} foresaw an attack!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Ingrain') {
                    commit('addMessageToChat', { text: `${pokemon.name} planted its roots!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Laser Focus') {
                    commit('addMessageToChat', { text: `${pokemon.name} concentrated intensely!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Leech Seed') {
                    commit('addMessageToChat', { text: `${pokemon.name} was seeded!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Magnet Rise') {
                    commit('addMessageToChat', { text: `${pokemon.name} levitated with electromagnetism!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Mimic') {
                    commit('addMessageToChat', { text: `${pokemon.name} learned ${this.dataSplitted[i + 3].trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: No Retreat') {
                    commit('addMessageToChat', { text: `${pokemon.name} can no longer escape because it used No Retreat!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Octolock') {
                    commit('addMessageToChat', { text: `${pokemon.name} can no longer escape because of Octolock!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'perish3' && this.dataSplitted[i + 3].trim() !== '[silent]') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s perish count fell to 3.`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'perish2' && this.dataSplitted[i + 3].trim() !== '[silent]') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s perish count fell to 2.`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'perish1' && this.dataSplitted[i + 3].trim() !== '[silent]') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s perish count fell to 1.`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'perish0' && this.dataSplitted[i + 3].trim() !== '[silent]') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s perish count fell to 0.`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Power Trick') {
                    commit('addMessageToChat', { text: `${pokemon.name} switched its Attack and Defense!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Smack Down') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP2.name} fell straight down!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP1.name} fell straight down!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'stockpile1') {
                    commit('addMessageToChat', { text: `${pokemon.name} stockpiled 1!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'stockpile2') {
                    commit('addMessageToChat', { text: `${pokemon.name} stockpiled 2!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'stockpile3') {
                    commit('addMessageToChat', { text: `${pokemon.name} stockpiled 3!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Substitute') {
                    commit('addMessageToChat', { text: `${pokemon.name} put in a substitute!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Tar Shot') {
                    commit('addMessageToChat', { text: `${pokemon.name} became weaker to fire!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Taunt') {
                    commit('addMessageToChat', { text: `${pokemon.name} fell for the taunt!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Torment') {
                    commit('addMessageToChat', { text: `${pokemon.name} was subjected to torment!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Uproar') {
                    if (this.dataSplitted[i + 3].trim() === '[upkeep]') {
                      commit('addMessageToChat', { text: `${pokemon.name} is making an uproar!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].trim() !== '[upkeep]') {
                      commit('addMessageToChat', { text: `${pokemon.name} caused an uproar!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'confusion') {
                    commit('addMessageToChat', { text: `${pokemon.name} became confused!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Yawn') {
                    commit('addMessageToChat', { text: `${pokemon.name} grew drowsy!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Flash Fire') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The power of ${pokemon.name}'s Fire-type moves rose!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'typechange') {
                    if (this.dataSplitted[i + 4].substr(0, 14).trim() === '[from] ability') {
                      commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 4].substr(16).trim()}]`, type: 'div' });
                      commit('addMessageToChat', { text: `${pokemon.name}'s type changed to ${this.dataSplitted[i + 3].trim()}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].trim() === '[from] move: Reflect Type') {
                      if (this.dataSplitted[i + 1].substr(0, 2).trim() === 'p1') {
                        commit('addMessageToChat', { text: `${pokemon.name}'s type became the same as the opposing ${state.currentPokemonP2.name}'s type!`, type: 'div' });
                      } else if (this.dataSplitted[i + 1].substr(0, 2).trim() === 'p2') {
                        commit('addMessageToChat', { text: `${pokemon.name}'s type became the same as the opposing ${state.currentPokemonP1.name}'s type!`, type: 'div' });
                      }
                    } else {
                      commit('addMessageToChat', { text: `${pokemon.name}'s type changed to ${this.dataSplitted[i + 3].trim()}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'typeadd') {
                    if (this.dataSplitted[i + 4].substr(0, 14).trim() === '[from] ability') {
                      commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 4].substr(16).trim()}]`, type: 'div' });
                    }
                    commit('addMessageToChat', { text: `${this.dataSplitted[i + 3].trim()} type was added to ${pokemon.name}!`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'Aqua Ring') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} surrounded itself with a veil of water!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Attract') {
                    if (this.dataSplitted[i + 3].trim() === '[from] item: Destiny Knot') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} fell in love because of the Destiny Knot!`, type: 'div' });
                    } else {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} fell in love!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'Autotomize') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} became nimble!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Curse') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP2.name} cut its own HP and put a curse on the opposing ${pokemon.name}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP1.name} cut its own HP and put a curse on the opposing ${pokemon.name}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'Disable') {
                    if (this.dataSplitted[i + 4].trim() === '[from] ability: Cursed Body') {
                      if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                        commit('addMessageToChat', { text: `[${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 4].substr(16)}]`, type: 'div' });
                      } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                        commit('addMessageToChat', { text: `[${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 4].substr(16)}]`, type: 'div' });
                      }
                    }
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s ${this.dataSplitted[i + 3].trim()} was disabled!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Imprison') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} sealed any moves its target shares with it!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Doom Desire') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} chose Doom Desire as its destiny!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Encore') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} must do an encore!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Focus Energy') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is getting pumped!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Future Sight') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} foresaw an attack!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Ingrain') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} planted its roots!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Laser Focus') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} concentrated intensely!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Leech Seed') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} was seeded!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Magnet Rise') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} levitated with electromagnetism!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Mimic') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} learned ${this.dataSplitted[i + 3].trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: No Retreat') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} can no longer escape because it used No Retreat!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Octolock') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} can no longer escape because of Octolock!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'perish3' && this.dataSplitted[i + 3].trim() !== '[silent]') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s perish count fell to 3.`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'perish2' && this.dataSplitted[i + 3].trim() !== '[silent]') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s perish count fell to 2.`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'perish1' && this.dataSplitted[i + 3].trim() !== '[silent]') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s perish count fell to 1.`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'perish0' && this.dataSplitted[i + 3].trim() !== '[silent]') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s perish count fell to 0.`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Power Trick') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} switched its Attack and Defense!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Smack Down') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} fell straight down!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'stockpile1') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} stockpiled 1!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'stockpile2') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} stockpiled 2!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'stockpile3') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} stockpiled 3!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Substitute') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} put in a substitute!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Tar Shot') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} became weaker to fire!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Taunt') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} fell for the taunt!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Torment') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} was subjected to torment!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Uproar') {
                    if (this.dataSplitted[i + 3].trim() === '[upkeep]') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} is making an uproar!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].trim() !== '[upkeep]') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} caused an uproar!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'confusion') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} became confused!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Yawn') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} grew drowsy!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'ability: Flash Fire') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].substr(9).trim()}]`, type: 'div' });
                    commit('addMessageToChat', { text: `The power of the opposing ${pokemon.name}'s Fire-type moves rose!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'typechange') {
                    if (this.dataSplitted[i + 4].substr(0, 14).trim() === '[from] ability') {
                      commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 4].substr(16).trim()}]`, type: 'div' });
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s type changed to ${this.dataSplitted[i + 3].trim()}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].trim() === '[from] move: Reflect Type') {
                      if (this.dataSplitted[i + 1].substr(0, 2).trim() === 'p1') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s type became the same as ${state.currentPokemonP2.name}'s type!`, type: 'div' });
                      } else if (this.dataSplitted[i + 1].substr(0, 2).trim() === 'p2') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s type became the same as ${state.currentPokemonP1.name}'s type!`, type: 'div' });
                      }
                    } else {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s type changed to ${this.dataSplitted[i + 3].trim()}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'typeadd') {
                    if (this.dataSplitted[i + 4].substr(0, 14).trim() === '[from] ability') {
                      commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 4].substr(16).trim()}]`, type: 'div' });
                    }
                    commit('addMessageToChat', { text: `${this.dataSplitted[i + 3].trim()} type was added to the opposing ${pokemon.name}!`, type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-end') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'Attract') {
                    commit('addMessageToChat', { text: `${pokemon.name} got over its infatuation!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Disable') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s move is no longer disabled!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Doom Desire') {
                    commit('addMessageToChat', { text: `${pokemon.name} took the Doom Desire attack!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Encore') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s encore ended!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Future Sight') {
                    commit('addMessageToChat', { text: `${pokemon.name} took the Future Sight attack!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Leech Seed') {
                    commit('addMessageToChat', { text: `${pokemon.name} was freed from Leech Seed!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Magnet Rise') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s electromagnetism wore off!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Stockpile') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s stockpiled effect wore off!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Substitute') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s substitute faded!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Taunt') {
                    commit('addMessageToChat', { text: `${pokemon.name} shook off the taunt!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Torment') {
                    commit('addMessageToChat', { text: `${pokemon.name} is no longer tormented!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Uproar') {
                    commit('addMessageToChat', { text: `${pokemon.name} calmed down.`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'confusion') {
                    commit('addMessageToChat', { text: `${pokemon.name} snapped out of its confusion!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Power Trick') {
                    commit('addMessageToChat', { text: `${pokemon.name} switched its Attack and Defense!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Illusion') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s illusion wore off!`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'Attract') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} got over its infatuation!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Disable') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s move is no longer disabled!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Doom Desire') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} took the Doom Desire attack!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Encore') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s encore ended!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Future Sight') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} took the Future Sight attack!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Leech Seed') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} was freed from Leech Seed!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Magnet Rise') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s electromagnetism wore off!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Stockpile') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s stockpiled effect wore off!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Substitute') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s substitute faded!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Taunt') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} shook off the taunt!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Torment') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is no longer tormented!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Uproar') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} calmed down.`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'confusion') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} snapped out of its confusion!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Power Trick') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} switched its Attack and Defense!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Illusion') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s illusion wore off!`, type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-crit') {
            commit('addMessageToChat', { text: 'A critical hit!', type: 'div' });
          } else if (this.dataSplitted[i] === '-item') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 3].substr(0, 6) === '[from]') {
                    if (this.dataSplitted[i + 3].trim() === '[from] move: Recycle') {
                      commit('addMessageToChat', { text: `${pokemon.name} found one ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].trim() === '[from] move: Thief' || this.dataSplitted[i + 3].trim() === '[from] move: Covet') {
                      if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                        commit('addMessageToChat', { text: `${pokemon.name} stole the opposing ${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                        commit('addMessageToChat', { text: `${pokemon.name} stole the opposing ${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      }
                    } else if (this.dataSplitted[i + 3].trim() === '[from] ability: Magician' || this.dataSplitted[i + 3].trim() === '[from] ability: Pickpocket') {
                      commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                      if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                        commit('addMessageToChat', { text: `${pokemon.name} stole the opposing ${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                        commit('addMessageToChat', { text: `${pokemon.name} stole the opposing ${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      }
                    } else if (this.dataSplitted[i + 3].trim() === '[from] ability: Frisk') {
                      if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                        commit('addMessageToChat', { text: `[${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                        commit('addMessageToChat', { text: `${state.currentPokemonP2.name} frisked the opposing ${pokemon.name} and found its ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                        commit('addMessageToChat', { text: `[${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                        commit('addMessageToChat', { text: `${state.currentPokemonP1.name} frisked the opposing ${pokemon.name} and found its ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      }
                    } else if (this.dataSplitted[i + 3].trim() === '[from] ability: Harvest') {
                      commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                      commit('addMessageToChat', { text: `${pokemon.name} harvested one ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 3].substr(0, 6) !== '[from]') {
                    commit('addMessageToChat', { text: `${pokemon.name} floats in the air with its Air Balloon!`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 3].substr(0, 6) === '[from]') {
                    if (this.dataSplitted[i + 3].trim() === '[from] move: Recycle') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} found one ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3].trim() === '[from] move: Thief' || this.dataSplitted[i + 3].trim() === '[from] move: Covet') {
                      if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} stole ${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} stole ${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      }
                    } else if (this.dataSplitted[i + 3].trim() === '[from] ability: Magician' || this.dataSplitted[i + 3].trim() === '[from] ability: Pickpocket') {
                      commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                      if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} stole ${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                        commit('addMessageToChat', { text: `The opposing ${pokemon.name} stole ${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      }
                    } else if (this.dataSplitted[i + 3].trim() === '[from] ability: Frisk') {
                      if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                        commit('addMessageToChat', { text: `[The opposing ${state.currentPokemonP2.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                        commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} frisked ${pokemon.name} and found its ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                        commit('addMessageToChat', { text: `[The opposing ${state.currentPokemonP1.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                        commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} frisked ${pokemon.name} and found its ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      }
                    } else if (this.dataSplitted[i + 3].trim() === '[from] ability: Harvest') {
                      commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} harvested one ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 3].substr(0, 6) !== '[from]') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} floats in the air with its Air Balloon!`, type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-enditem') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'Air Balloon') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s Air Balloon popped!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Eject Button') {
                    commit('addMessageToChat', { text: `${pokemon.name} is switched out with the Eject Button!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Focus Sash') {
                    if (this.dataSplitted[i + 3] !== '[silent]' && this.dataSplitted[i + 3] !== '[from] move: Corrosive Gas') {
                      commit('addMessageToChat', { text: `${pokemon.name} hung on using its Focus Sash!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3] === '[from] move: Corrosive Gas') {
                      if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                        commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} corroded ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                        commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} corroded ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      }
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'Power Herb') {
                    commit('addMessageToChat', { text: `${pokemon.name} became fully charged due to its Power Herb!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Red Card') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `${pokemon.name} held up its Red Card against the opposing ${state.currentPokemonP2.name}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `${pokemon.name} held up its Red Card against the opposing ${state.currentPokemonP1.name}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'White Herb') {
                    commit('addMessageToChat', { text: `${pokemon.name} returned its stats to normal using its White Herb!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[from] move: Knock Off') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} knocked off ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} knocked off ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 3].trim() === '[from] stealeat') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} stole and ate its target's ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} stole and ate its target's ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 3].trim() === '[from] move: Corrosive Gas') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP2.name} corroded ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `The opposing ${state.currentPokemonP1.name} corroded ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 3].trim() === '[from] move: Fling') {
                    commit('addMessageToChat', { text: `${pokemon.name} flung its ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[from] move: Incinerate') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s ${this.dataSplitted[i + 2].trim()} was burned up!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[eat]') {
                    commit('addMessageToChat', { text: `${pokemon.name} ate its ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[weaken]') {
                    commit('addMessageToChat', { text: `The ${this.dataSplitted[i + 2].trim()} weakened the damage to ${pokemon.name}!`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'Air Balloon') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s Air Balloon popped!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Eject Button') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is switched out with the Eject Button!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Focus Sash') {
                    if (this.dataSplitted[i + 3] !== '[silent]' && this.dataSplitted[i + 3] !== '[from] move: Corrosive Gas') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} hung on using its Focus Sash!`, type: 'div' });
                    } else if (this.dataSplitted[i + 3] === '[from] move: Corrosive Gas') {
                      if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                        commit('addMessageToChat', { text: `${state.currentPokemonP2.name} corroded the opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                        commit('addMessageToChat', { text: `${state.currentPokemonP1.name} corroded the opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                      }
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'Power Herb') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} became fully charged due to its Power Herb!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Red Card') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} held up its Red Card against ${state.currentPokemonP2.name}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `The opposing ${pokemon.name} held up its Red Card against ${state.currentPokemonP1.name}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 2].trim() === 'White Herb') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} returned its stats to normal using its White Herb!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[from] move: Knock Off') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP2.name} knocked off the opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP1.name} knocked off the opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 3].trim() === '[from] stealeat') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP2.name} stole and ate its target's ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP1.name} stole and ate its target's ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 3].trim() === '[from] move: Corrosive Gas') {
                    if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP2.name} corroded the opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                      commit('addMessageToChat', { text: `${state.currentPokemonP1.name} corroded the opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                    }
                  } else if (this.dataSplitted[i + 3].trim() === '[from] move: Fling') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} flung its ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[from] move: Incinerate') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s ${this.dataSplitted[i + 2].trim()} was burned up!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[eat]') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} ate its ${this.dataSplitted[i + 2].trim()}!`, type: 'div' });
                  } else if (this.dataSplitted[i + 3].trim() === '[weaken]') {
                    commit('addMessageToChat', { text: `The ${this.dataSplitted[i + 2].trim()} weakened the damage to the opposing ${pokemon.name}!`, type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-prepare') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'Bounce') {
                    commit('addMessageToChat', { text: `${pokemon.name} sprang up!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Dig') {
                    commit('addMessageToChat', { text: `${pokemon.name} burrowed its way under the ground!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Dive') {
                    commit('addMessageToChat', { text: `${pokemon.name} hid underwater!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Fly') {
                    commit('addMessageToChat', { text: `${pokemon.name} flew up high!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Phantom Force') {
                    commit('addMessageToChat', { text: `${pokemon.name} vanished instantly!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Skull Bash') {
                    commit('addMessageToChat', { text: `${pokemon.name} tucked in its head!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Sky Attack') {
                    commit('addMessageToChat', { text: `${pokemon.name} became cloaked in a harsh light!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Solar Beam' || this.dataSplitted[i + 2].trim() === 'Solar Blade') {
                    commit('addMessageToChat', { text: `${pokemon.name} absorbed light!`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'Bounce') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} sprang up!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Dig') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} burrowed its way under the ground!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Dive') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} hid underwater!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Fly') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} flew up high!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Phantom Force') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} vanished instantly!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Skull Bash') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} tucked in its head!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Sky Attack') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} became cloaked in a harsh light!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Solar Beam' || this.dataSplitted[i + 2].trim() === 'Solar Blade') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} absorbed light!`, type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-mustrecharge') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `${pokemon.name} must recharge the next turn!`, type: 'div' });
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  commit('addMessageToChat', { text: `The opposing ${pokemon.name} must recharge the next turn!`, type: 'div' });
                }
              });
            }
          } else if (this.dataSplitted[i] === '-hitcount') {
            console.log(parseInt(this.dataSplitted[i + 2].trim(), 10));
            if (parseInt(this.dataSplitted[i + 2].trim(), 10) > 1) {
              commit('addMessageToChat', { text: `The Pok\u00E9mon was hit ${this.dataSplitted[i + 2].trim()} times!`, type: 'div' });
            } else {
              commit('addMessageToChat', { text: 'The Pok\u00E9mon was hit 1 time!', type: 'div' });
            }
          } else if (this.dataSplitted[i] === 'drag') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                    state.currentPokemonP1.name = pokemon.name;
                    state.currentPokemonP1.boost.stats.atk = 0;
                    state.currentPokemonP1.boost.stats.def = 0;
                    state.currentPokemonP1.boost.stats.spa = 0;
                    state.currentPokemonP1.boost.stats.spd = 0;
                    state.currentPokemonP1.boost.stats.spe = 0;
                    state.currentPokemonP1.boost.stats.accuracy = 0;
                  } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                    state.currentPokemonP2.name = pokemon.name;
                    state.currentPokemonP2.boost.stats.atk = 0;
                    state.currentPokemonP2.boost.stats.def = 0;
                    state.currentPokemonP2.boost.stats.spa = 0;
                    state.currentPokemonP2.boost.stats.spd = 0;
                    state.currentPokemonP2.boost.stats.spe = 0;
                    state.currentPokemonP2.boost.stats.accuracy = 0;
                  }
                  if (pokemon.formeChange.switchChange === true) {
                    // eslint-disable-next-line
                    state.userTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                    state.userTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                  }
                  commit('addMessageToChat', { text: `${pokemon.name} was dragged out!`, type: 'div' });
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                    state.currentPokemonP1.name = pokemon.name;
                    state.currentPokemonP1.boost.stats.atk = 0;
                    state.currentPokemonP1.boost.stats.def = 0;
                    state.currentPokemonP1.boost.stats.spa = 0;
                    state.currentPokemonP1.boost.stats.spd = 0;
                    state.currentPokemonP1.boost.stats.spe = 0;
                    state.currentPokemonP1.boost.stats.accuracy = 0;
                  } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                    state.currentPokemonP2.name = pokemon.name;
                    state.currentPokemonP2.boost.stats.atk = 0;
                    state.currentPokemonP2.boost.stats.def = 0;
                    state.currentPokemonP2.boost.stats.spa = 0;
                    state.currentPokemonP2.boost.stats.spd = 0;
                    state.currentPokemonP2.boost.stats.spe = 0;
                    state.currentPokemonP2.boost.stats.accuracy = 0;
                  }
                  if (pokemon.formeChange.switchChange === true) {
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                  }
                  commit('addMessageToChat', { text: `The opposing ${pokemon.name} was dragged out!`, type: 'div' });
                }
              });
            }
          } else if (this.dataSplitted[i] === '-singlemove') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'Destiny Bond') {
                    commit('addMessageToChat', { text: `${pokemon.name} is hoping to take its attacker down with it!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Grudge') {
                    commit('addMessageToChat', { text: `${pokemon.name} wants its target to bear a grudge!`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'Destiny Bond') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is hoping to take its attacker down with it!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Grudge') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} wants its target to bear a grudge!`, type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-singleturn') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'Protect') {
                    commit('addMessageToChat', { text: `${pokemon.name} protected itself!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Shell Trap') {
                    commit('addMessageToChat', { text: `${pokemon.name} set a shell trap!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Endure') {
                    commit('addMessageToChat', { text: `${pokemon.name} braced itself!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Electrify') {
                    commit('addMessageToChat', { text: `${pokemon.name}'s moves have been electrified!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Focus Punch') {
                    commit('addMessageToChat', { text: `${pokemon.name} is tightening its focus!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Magic Coat') {
                    commit('addMessageToChat', { text: `${pokemon.name} shrouded itself with Magic Coat!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Mat Block') {
                    commit('addMessageToChat', { text: `${pokemon.name} intends to flip up a mat and block incoming attacks!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Quick Guard' || this.dataSplitted[i + 2].trim() === 'Wide Guard' || this.dataSplitted[i + 2].trim() === 'Crafty Shield') {
                    commit('addMessageToChat', { text: `${this.dataSplitted[i + 2].trim()} protected your team!`, type: 'div' });
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 2].trim() === 'Protect') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} protected itself!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Shell Trap') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} set a shell trap!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Endure') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} braced itself!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Electrify') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name}'s moves have been electrified!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Focus Punch') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} is tightening its focus!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'move: Magic Coat') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} shrouded itself with Magic Coat!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Mat Block') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} intends to flip up a mat and block incoming attacks!`, type: 'div' });
                  } else if (this.dataSplitted[i + 2].trim() === 'Quick Guard' || this.dataSplitted[i + 2].trim() === 'Wide Guard' || this.dataSplitted[i + 2].trim() === 'Crafty Shield') {
                    commit('addMessageToChat', { text: `${this.dataSplitted[i + 2].trim()} protected the opposing team!`, type: 'div' });
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-fieldactivate') {
            if (this.dataSplitted[i + 1].trim() === 'move: Pay Day') {
              commit('addMessageToChat', { text: 'Coins were scattered everywhere!', type: 'div' });
            } else if (this.dataSplitted[i + 1].trim() === 'move: Fairy Lock') {
              commit('addMessageToChat', { text: 'No one will be able to run away during the next turn!', type: 'div' });
            }
          } else if (this.dataSplitted[i] === '-formechange') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 4].substr(0, 14).trim() === '[from] ability') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 4].substr(16).trim()}]`, type: 'div' });
                  }
                  state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.switchChange = true;
                  if (this.dataSplitted[i + 2].trim() === pokemon.name) {
                    state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.hasChange = false;
                    state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.form = '';
                  } else if (this.dataSplitted[i + 2].trim() !== pokemon.name) {
                    state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.hasChange = true;
                    // eslint-disable-next-line
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.form = this.dataSplitted[i + 2].trim();
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 4].substr(0, 14).trim() === '[from] ability') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 4].substr(16).trim()}]`, type: 'div' });
                  }
                  // eslint-disable-next-line
                  state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.switchChange = true;
                  if (this.dataSplitted[i + 2].trim() === pokemon.name) {
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                  } else if (this.dataSplitted[i + 2].trim() !== pokemon.name) {
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = true;
                    // eslint-disable-next-line
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = this.dataSplitted[i + 2].trim();
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === 'detailschange') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 4].substr(0, 14).trim() === '[from] ability') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 4].substr(16).trim()}]`, type: 'div' });
                  }
                  state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.switchChange = false;
                  if (this.dataSplitted[i + 2].trim().split(',')[0] === pokemon.name) {
                    state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.hasChange = false;
                    state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.form = '';
                  } else if (this.dataSplitted[i + 2].trim().split(',')[0] !== pokemon.name) {
                    state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.hasChange = true;
                    // eslint-disable-next-line
                    state.userTeam[state.userTeam.indexOf(pokemon)].formeChange.form = this.dataSplitted[i + 2].trim().split(' ')[0];
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 4].substr(0, 14).trim() === '[from] ability') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 4].substr(16).trim()}]`, type: 'div' });
                  }
                  // eslint-disable-next-line
                  state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.switchChange = false;
                  if (this.dataSplitted[i + 2].trim().split(',')[0] === pokemon.name) {
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = false;
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = '';
                  } else if (this.dataSplitted[i + 2].trim().split(',')[0] !== pokemon.name) {
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.hasChange = true;
                    // eslint-disable-next-line
                    state.rivalTeam[state.rivalTeam.indexOf(pokemon)].formeChange.form = this.dataSplitted[i + 2].trim().split(' ')[0];
                  }
                }
              });
            }
          } else if (this.dataSplitted[i] === '-sethp') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  state.userTeam[state.userTeam.indexOf(pokemon)].currentHP = this.dataSplitted[i + 2].split('/')[0];
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  state.rivalTeam[state.rivalTeam.indexOf(pokemon)].currentHPpercentage = this.dataSplitted[i + 2].split('/')[0];
                }
              });
            }
            commit('addMessageToChat', { text: 'The battlers shared their pain!', type: 'div' });
          } else if (this.dataSplitted[i] === '-transform') {
            if (this.dataSplitted[i + 1].substr(0, 2) === state.userNumber) {
              state.userTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 3].trim() === '[from] ability: Imposter') {
                    commit('addMessageToChat', { text: `[${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                  }
                  if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                    commit('addMessageToChat', { text: `${pokemon.name} transformed into ${state.currentPokemonP2.name}!`, type: 'div' });
                    state.currentPokemonP1.boost.stats.atk = state.currentPokemonP2.boost.stats.atk;
                    state.currentPokemonP1.boost.stats.def = state.currentPokemonP2.boost.stats.def;
                    state.currentPokemonP1.boost.stats.spa = state.currentPokemonP2.boost.stats.spa;
                    state.currentPokemonP1.boost.stats.spd = state.currentPokemonP2.boost.stats.spd;
                    state.currentPokemonP1.boost.stats.spe = state.currentPokemonP2.boost.stats.spe;
                    // eslint-disable-next-line
                    state.currentPokemonP1.boost.stats.accuracy = state.currentPokemonP2.boost.stats.accuracy;
                  } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                    commit('addMessageToChat', { text: `${pokemon.name} transformed into ${state.currentPokemonP1.name}!`, type: 'div' });
                    state.currentPokemonP2.boost.stats.atk = state.currentPokemonP1.boost.stats.atk;
                    state.currentPokemonP2.boost.stats.def = state.currentPokemonP1.boost.stats.def;
                    state.currentPokemonP2.boost.stats.spa = state.currentPokemonP1.boost.stats.spa;
                    state.currentPokemonP2.boost.stats.spd = state.currentPokemonP1.boost.stats.spd;
                    state.currentPokemonP2.boost.stats.spe = state.currentPokemonP1.boost.stats.spe;
                    // eslint-disable-next-line
                    state.currentPokemonP2.boost.stats.accuracy = state.currentPokemonP1.boost.stats.accuracy;
                  }
                }
              });
            } else if (this.dataSplitted[i + 1].substr(0, 2) !== state.userNumber) {
              state.rivalTeam.forEach((pokemon) => {
                // eslint-disable-next-line
                if (pokemon.name === this.dataSplitted[i + 1].substr(5).trim() || pokemon.nickname === this.dataSplitted[i + 1].substr(5).trim()) {
                  // eslint-disable-next-line
                  if (this.dataSplitted[i + 3].trim() === '[from] ability: Imposter') {
                    commit('addMessageToChat', { text: `[The opposing ${pokemon.name}'s ${this.dataSplitted[i + 3].substr(16).trim()}]`, type: 'div' });
                  }
                  if (this.dataSplitted[i + 1].substr(0, 2) === 'p1') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} transformed into ${state.currentPokemonP2.name}!`, type: 'div' });
                    state.currentPokemonP1.boost.stats.atk = state.currentPokemonP2.boost.stats.atk;
                    state.currentPokemonP1.boost.stats.def = state.currentPokemonP2.boost.stats.def;
                    state.currentPokemonP1.boost.stats.spa = state.currentPokemonP2.boost.stats.spa;
                    state.currentPokemonP1.boost.stats.spd = state.currentPokemonP2.boost.stats.spd;
                    state.currentPokemonP1.boost.stats.spe = state.currentPokemonP2.boost.stats.spe;
                    // eslint-disable-next-line
                    state.currentPokemonP1.boost.stats.accuracy = state.currentPokemonP2.boost.stats.accuracy;
                  } else if (this.dataSplitted[i + 1].substr(0, 2) === 'p2') {
                    commit('addMessageToChat', { text: `The opposing ${pokemon.name} transformed into ${state.currentPokemonP1.name}!`, type: 'div' });
                    state.currentPokemonP2.boost.stats.atk = state.currentPokemonP1.boost.stats.atk;
                    state.currentPokemonP2.boost.stats.def = state.currentPokemonP1.boost.stats.def;
                    state.currentPokemonP2.boost.stats.spa = state.currentPokemonP1.boost.stats.spa;
                    state.currentPokemonP2.boost.stats.spd = state.currentPokemonP1.boost.stats.spd;
                    state.currentPokemonP2.boost.stats.spe = state.currentPokemonP1.boost.stats.spe;
                    // eslint-disable-next-line
                    state.currentPokemonP2.boost.stats.accuracy = state.currentPokemonP1.boost.stats.accuracy;
                  }
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
