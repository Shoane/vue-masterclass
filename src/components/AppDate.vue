<template>
  <span :title="humanFriendlyDate">
    {{ diffForHumans }}
  </span>
</template>

<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedDate from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedDate)

export default {
  props: {
    timestamp: {
      required: true,
      type: [Number, Object]
    }
  },
  computed: {
    normalizeTimestamp () {
      return this.timestamp?.seconds || this.timestamp
    },
    diffForHumans () {
      return dayjs.unix(this.normalizeTimestamp).fromNow()
    },
    humanFriendlyDate () {
      return dayjs.unix(this.normalizeTimestamp).format('llll')
    }
  }
}
</script>

<style>
</style>
