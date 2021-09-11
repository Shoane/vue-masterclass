<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          v-model="postCopy.text"
          id=""
          class="form-input"
          rows="10"
          cols="30"
        ></textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">{{ post.id ? 'Update post' : 'Submit post' }}</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => ({ text: null })
    }
  },
  data () {
    return {
      postCopy: { ...this.post }
    }
  },
  methods: {
    save () {
      this.$emit('save', { post: this.postCopy })

      this.postCopy.text = ''
    }
  }
}
</script>

<style>
</style>
