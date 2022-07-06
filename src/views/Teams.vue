<template>
  <SettingsBar/>
  <div>
    <h1>My created teams</h1>
    <button @click="this.$router.push('/teambuilder')">Create team</button>
    <button @click="this.$router.push('/home')">Go back to home</button>
  </div>
  <table v-if="userTeams.length > 0" class="table table-hover">
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
  <b v-if="userTeams.length <= 0">
    You have no teams yet!
  </b>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SettingsBar from "@/components/SettingsBar";
import {ITeam} from "@/interfaces/Team";
import {deleteTeam, getUserTeams} from "@/services/teambuilderService";

export default defineComponent({
  name: 'TeamsView',
  components: {
    SettingsBar,
  },
  data() {
    return {
      userTeams: [] as ITeam[],
    }
  },
  methods: {
    async loadUserTeams() {
      const res = await getUserTeams(this.$store.state.user.username);

      this.userTeams = res.data;
    },
    async deleteTeam(teamID: string) {
      if(confirm("Do you really want to delete this team?")) {
        await deleteTeam(this.$store.state.user.username, teamID);
        this.loadUserTeams();
      }
    },
    async editTeam(teamID: string) {
      //aquí irá el push a la página de teambuilder con el parámetro teamID para que se me muestre ese equipo para editarlo
    }
  },
  mounted() {
    this.loadUserTeams();
  }
})
</script>

<style scoped>

</style>
