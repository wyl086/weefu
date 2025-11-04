<template>
    <audio ref="audioRef" :controls="false" >
        <source :src="src" >
    </audio>
</template>


<script>

export default {

    props: {
        src: {
            type: [String],
            require: true,
            default: require('@/assets/audio/prompt_tone.mp3')
        },
    },

    data() {
      return {

      }
    },
	methods: {
        play() {
            this.$refs.audioRef?.play()
        }
    }
}
</script>

