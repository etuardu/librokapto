<script>
import { RouterLink, RouterView } from 'vue-router'
export default {
  data: () => ({ drawer: null }),
}
</script>
<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <!--  -->
    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>ubicalibri</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
