export default {
  methods: {
    string2color(txt) {
      let hash = [...txt].reduce((acc, c) => {
        return c.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      return `hsl(${hash % 360}, 95%, 35%)`;
    },
  }
}
