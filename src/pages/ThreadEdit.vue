<template>
  <div v-if="thread && text" class="col-full push-top">
    <h1>Editing <i>{{ thread.title }}</i></h1>

    <thread-editor :title="thread.title" :text="text" @save="save" @cancel="cancel"/>
  </div>
</template>

<script>
import ThreadEditor from '../components/ThreadEditor.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
export default {
  components: { ThreadEditor },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      return findById(this.$store.state.threads, this.id)
    },
    text () {
      const post = findById(this.$store.state.posts, this.thread.firstPostId)
      return post ? post.text : ''
    }
  },
  methods: {
    ...mapActions(['fetchThread', 'fetchPost', 'updateThread']),
    async save ({ title, text }) {
      const thread = await this.updateThread({
        id: this.id,
        text,
        title
      })
      this.$router.push({ name: 'ThreadShow', params: { id: thread.id } })
    },
    cancel () {
      this.$router.push({ name: 'ThreadShow', params: { id: this.id } })
    }
  },
  async created () {
    const thread = await this.fetchThread({ id: this.id })
    this.fetchPost({ id: thread.firstPostId })
  }
}
</script>

<style></style>
