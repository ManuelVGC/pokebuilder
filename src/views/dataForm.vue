<template>
  <b-container>
    <h2 class="mt-5">Acceso a Pokémon Showdown</h2>
    <b-row align-h="center">
      <b-col cols="12" lg="12">
        <b-form @submit.stop.prevent>
          <b-form-group
            id="userName-group"
            label="Usuario"
            label-for="userName">
            <b-form-input
              id="user"
              type="text"
              placeholder="Introduzca su nombre de usuario"
              @keydown.space.prevent
              @keydown.ñ.prevent
              v-model.lazy="$v.userName.$model"
              :state="$v.userName.$dirty ? !$v.userName.$error : null"
              @input="$v.userName.$reset()"
              @blur="$v.userName.$touch()">
            </b-form-input>
            <div class="error" v-if="!$v.userName.minLength">
              El nombre de usuario tiene que tener mínimo 5 caracteres</div>
          </b-form-group>
          <b-form-group
            id="password-group"
            label="Contraseña"
            label-for="password">
            <b-form-input
              id="pass"
              type="password"
              placeholder="Introduzca su contraseña"
              @keydown.space.prevent
              @keydown.ñ.prevent
              v-model.lazy="$v.password.$model"
              :state="$v.password.$dirty ? !$v.password.$error : null"
              @input="$v.password.$reset()"
              @blur="$v.password.$touch()">
            </b-form-input>
            <div class="error" v-if="!$v.password.minLength">
              La contraseña tiene que tener mínimo 8 caracteres</div>
          </b-form-group>
          <b-form-group
            id="repeatPassword-group"
            label="Repite la contraseña"
            label-for="repeatPassword">
            <b-form-input
              id="repeatPass"
              type="password"
              placeholder="Introduzca de nuevo su contraseña"
              @keydown.space.prevent
              @keydown.ñ.prevent
              v-model.lazy="$v.repeatPassword.$model"
              :state="$v.repeatPassword.$dirty ? !$v.repeatPassword.$error : null"
              @input="$v.repeatPassword.$reset()"
              @blur="$v.repeatPassword.$touch()">
            </b-form-input>
            <div class="error" v-if="!$v.repeatPassword.sameAsPassword && $v.repeatPassword.$dirty">
              Las contraseñas tienen coincidir.</div>
          </b-form-group>
          <b-button
            class="mt-5"
            variant="primary"
            block
            @click="postRequest([userName, password])"
            :disabled="$v.$invalid">Acceder a Pokémon Showdown</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {
  required, minLength, sameAs,
} from 'vuelidate/lib/validators';

import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      userName: '',
      password: '',
      repeatPassword: '',
    };
  },
  validations: {
    userName: {
      required,
      minLength: minLength(5),
    },
    password: {
      required,
      minLength: minLength(8),
    },
    repeatPassword: {
      sameAsPassword: sameAs('password'),
    },
  },
  methods: {
    ...mapMutations('webSocket', [
      'onOpen',
      'messageListener',
      'postRequest',
    ]),
  },
  created() {
    this.onOpen();
    this.messageListener();
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
