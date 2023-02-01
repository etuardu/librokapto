<script>
import { RouterLink, RouterView } from 'vue-router'
export default {
  data: () => ({
    drawer: null,
    nav_items: [
      { title: 'Library', icon: 'mdi-bookshelf', to: '/' },
      { title: 'Add books', icon: 'mdi-book-plus', to: '/insert' },
      { title: 'Settings', icon: 'mdi-cog', to: '/settings' },
      { title: 'About', icon: 'mdi-information', to: '/about' },
    ]
  }),
}
</script>
<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item
          v-for="item in nav_items"
          :key="item.title"
          :title="item.title"
          :to="item.to"
          :icon="item.icon"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>librokapto</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
