<template>
  <div>
    <div ref="quagga_el">
    </div>
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
  beforeUnmount() {
    Quagga.stop()
  },
  mounted() {
    Quagga.init({
      inputStream : {
        name : "Live",
        type : "LiveStream",
        target: this.$refs['quagga_el'],
        constraints: {
          width: { min: 640 },
          height: { min: 480 },
          facingMode: "environment",
          aspectRatio: { min: 1, max: 2 },
        }
      },
      decoder : {
        readers : ["ean_reader"]
      },
      locate: true,
      locator: {
        patchSize: "medium",
        halfSample: true,
      },
      numOfWorkers: 4,
      frequency: 10,
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
