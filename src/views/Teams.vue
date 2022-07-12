<template>
  <SettingsBar/>
  <div style="margin: 1em">
    <h3>My created teams</h3>
    <button style="margin: 1em" type="button" class="btn btn-warning" @click="this.$router.push('/teambuilder')">Create team</button>
    <button style="margin: 1em" type="button" class="btn btn-outline-secondary btn-sm" @click="this.$router.push('/home')">Go back to home</button>
  </div>
  <table style="margin: 1em" v-if="userTeams.length > 0" class="table table-hover">
    <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col"></th>
      <th scope="col"></th>
    </tr>
    </thead>
    <tbody>
      <tr v-for="team in userTeams" :key="team" class="table-primary">
        <th scope="row">{{team.name}}</th>
        <td v-for="pokemon in team.pokemon" :key="pokemon">
          {{pokemon.species}}
        </td>
        <td>
          <button type="button" class="btn btn-danger" @click="deleteTeam(team._id)">Delete team</button>
          <button type="button" class="btn btn-info" @click="editTeam(team._id)">Edit team</button>
        </td>
      </tr>
    </tbody>
  </table>
  <b style="margin: 1em" v-if="userTeams.length <= 0">
    You have no teams yet!
  </b>
</template>

<script lang="ts">
/** View donde se muestran los equipos creados por el usuario. */

import {defineComponent} from "vue";
import SettingsBar from "@/components/SettingsBar.vue";
import {ITeam} from "@/interfaces/Team";
import {deleteTeam, getUserTeams} from "@/services/teambuilderService";

export default defineComponent({
  name: 'TeamsView',
  components: {
    SettingsBar,
  },
  data() {
    return {
      userTeams: [] as ITeam[], /** Equipos creados por el usuario. */
    }
  },
  methods: {
    /** Cargar desde el backend los equipos creados por el usuario. */
    async loadUserTeams() {
      const res = await getUserTeams(this.$store.state.user.username);

      this.userTeams = res.data;
    },

    /** Borrar un equipo de entre la lista de los equipos creados. */
    async deleteTeam(teamID: string) {
      if(confirm("Do you really want to delete this team?")) {
        await deleteTeam(this.$store.state.user.username, teamID);
        this.loadUserTeams();
      }
    },

    /** Editar un equipo de la lista de equipos creados. */
    async editTeam(teamID: string) {
      //aquí irá el push a la página de Teambuilder con el parámetro teamID para que se me muestre ese equipo para editarlo
    }
  },
  mounted() {
    this.loadUserTeams();
  }
})
</script>

<style scoped>

</style>
