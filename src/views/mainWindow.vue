<template>
  <section class="welcome">
    <div class="application_content welcome_content ">
      <h1 class="welcome_subtitle" >Pulse en el botón para jugar</h1>
      <Button @click="onClick">
        Jugar
      </Button>
    </div>
  </section>
</template>

<script>
import Button from '@/components/Button.vue';

export default {
  name: 'Home',
  components: {
    Button,
  },
  methods: {
    onClick() {
      console.log('Has pulsado el botón');
    },
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
