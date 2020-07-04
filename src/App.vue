<template>
  <div id="app">
    <router-view class="application_container"/>
  </div>
</template>

<style lang="scss">
  @import './styles/reset';
  @import './styles/layout';

  #app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  body {
    margin : 0;
    padding : 0;
    //CSS-variables
    //Colores
    --application-color-primary: #E23434;
    --application-color-accent: #333745;
    --application-color-text: #FFF;
  }

  * {
    box-sizing: border-box;
  }

</style>
