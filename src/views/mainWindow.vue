<template>
  <section class="welcome">
    <div class="application_content welcome_content ">
      <h1 class="welcome_subtitle" >Pulse en el botón para jugar</h1>
      <Button @click="searchBattleWithTeam({ format, team })">
        Jugar
      </Button>
    </div>
  </section>
</template>

<script>
import Button from '@/components/Button.vue';

import { mapMutations } from 'vuex';

export default {
  name: 'Home',
  components: {
    Button,
  },
  data() {
    return {
      teamOu3: ['Skarmory||leftovers|keeneye|spikes,whirlwind,toxic,protect|Impish|252,,4,,252,|||||]'
      + 'Dugtrio||choiceband|arenatrap|earthquake,rockslide,aerialace,substitute|Jolly|4,252,,,,252|||||]'
      + 'Gengar||leftovers|levitate|thunderbolt,icepunch,gigadrain,firepunch|Timid|4,,,252,,252|||||]'
      + 'Swampert||leftovers|torrent|earthquake,icebeam,hydropump,roar|Relaxed|252,,216,40,,|||||]'
      + 'Salamence||choiceband|intimidate|crunch,rockslide,earthquake,fireblast|Adamant|4,252,,,,252|||||]'
      + 'Celebi||leftovers|naturalcure|calmmind,gigadrain,psychic,recover|Timid|252,,80,,,176|||||'],
      formatOu3: 'gen3ou',
      // eslint-disable-next-line
      // ['Jose Juan|Cloyster|focussash|skilllink|shellsmash,iciclespear,spikes,explosion|Jolly|,252,,,4,252|||||]'
      // eslint-disable-next-line
      // team: ['Ninjask||focussash|speedboost|swordsdance,sandstorm,acrobatics,bugbuzz|Jolly|,252,,,4,252|||||]'
      // eslint-disable-next-line
      // + 'Magearna||choicespecs|soulheart|fleurcannon,flashcannon,voltswitch,trick|Modest|88,,,252,,168|||||]'
      // eslint-disable-next-line
      // + 'Amoonguss||rockyhelmet|regenerator|spore,sludgebomb,gigadrain,toxic|Calm|248,,,8,252,|||||]'
      // eslint-disable-next-line
      // + 'Hippowdon||rockyhelmet|sandstream|stealthrock,whirlwind,slackoff,earthquake|Impish|248,8,252,,,|||||]'
      // eslint-disable-next-line
      // + 'Incineroar||heavydutyboots|intimidate|knockoff,flareblitz,partingshot,willowisp|Careful|248,,,,200,60|||||]'
      // eslint-disable-next-line
      // + 'Alakazam||focussash|magicguard|nastyplot,dazzlinggleam,focusblast,psyshock|Timid|,,,252,4,252|||||'],
      team: ['Rillaboom||focussash|grassysurge|protect,swordsdance,uproar,woodhammer|Jolly|,252,,,4,252|female||||]'
        + 'Ferrothorn||focussash|ironbarbs|protect,spikes,magnetrise,gyroball|Bold|,,252,,4,252|||||]'
        // eslint-disable-next-line
        + 'Amoonguss||focussash|regenerator|protect,energyball,gigadrain,toxic|Calm|248,,,8,,252|||||]'
        // eslint-disable-next-line
        + 'Alakazam||focussash|magicguard|protect,psyshock,futuresight,attract|Impish|248,8,252,,,|female||||]'
        // eslint-disable-next-line
        + 'Jirachi||focussash|serenegrace|protect,doomdesire,ironhead,healingwish|Careful|248,,,,200,60|||||]'
        // eslint-disable-next-line
        + 'Gengar||focussash|cursedbody|protect,disable,encore,shadowball|Timid|,,,252,4,252|||||'],
      format: 'gen8ou',
    };
  },
  methods: {
    onClick() {
      console.log('Has pulsado el botón');
    },
    ...mapMutations('webSocket', ['searchBattleWithTeam']),
  },
};
</script>

<style lang="scss" scoped>
  .welcome {
    background-color: var(--application-color-primary);
  }

  .welcome_content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--application-color-text);
  }

  .welcome_title,
  .welcome_subtitle {
    text-align: left;
  }

  .welcome_title{
    margin-bottom: 1.2em;
    font-size: 2.5rem;
    font-weight: 500;
    letter-spacing: 1px;
  }

  .welcome_subtitle{
    font-size: 2rem;
    margin-bottom: 1.2em; //para que haya un margen entre el texto y el botón
    font-weight: 300;
  }
</style>
