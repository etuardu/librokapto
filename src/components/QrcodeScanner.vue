<template>
  <div
    id="qr-code-full-region"
  ></div>
</template>
<script>
export default {
  mounted() {
    const html5QrcodeScanner = new Html5QrcodeScanner('qr-code-full-region', {
      qrbox: 250,
      fps: 10,
    });
    html5QrcodeScanner.render(this.onrender);
  },
  methods: {
    onrender(a, b) {
      console.log(a, b)
      //this.$emit('onScan', decodedText, decodedResult)
    }
  }
}
</script>
