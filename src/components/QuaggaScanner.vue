<template>
  <div ref="quagga_el">
  </div>
</template>
<script>
import Quagga from 'quagga'
export default {
  data: () => ({
    last_code: undefined,
    attempts: [0,0,0,0], // to avoid misread codes we fill this array with 
    // each code with the detected elements. Then, if every elements of the array are
    // the same, emit the code.
    attempts_i: 0,
  }),
  mounted() {
    Quagga.init({
      inputStream : {
        name : "Live",
        type : "LiveStream",
        target: this.$refs['quagga_el']
      },
      decoder : {
        readers : ["ean_reader"]
      }
    },
    function(err) {
      if (err) {
        console.err(err);
        return
      }
      console.log("Quagga: Initialization finished. Ready to start");
      Quagga.start();
    });
    const that = this
    Quagga.onDetected(function(data) {

      const code = data.codeResult.code
      if (code == that.last_code) return

      that.attempts[that.attempts_i] = code
      that.attempts_i = (that.attempts_i + 1) % that.attempts.length

      if (that.attempts.every(v => v == code)) {
        that.$emit('onscan', code)
        that.last_code = code
      }

    });
  }
}
</script>
