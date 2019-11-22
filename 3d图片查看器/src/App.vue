<template>
  <div id="app">
    <v-map :imgdate="imgdate" />
  </div>
</template>

<script>
import map from './components/map';
export default {
  name: 'App',
  data () {
    return {
      imgdate: {
        imgSrc: 'static/img/m.jpg',
        boxHeight: 600,
        boxWidth: 600
      }
    };
  },
  components: {
    'v-map': map
  }
};
</script>

<style>

</style>
