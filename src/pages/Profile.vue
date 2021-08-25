<template>
  <div class="flex-grid">
          <div class="col-3 push-top">
            <user-profile-card v-if="!edit" :user="user"/>
            <user-porfile-card-editor v-else :user="user"/>
          </div>

          <div class="col-7 push-top">

              <div class="profile-header">
                  <span class="text-lead">
                      {{user.username}}'s recent activity
                  </span>
                  <a href="#">See only started threads?</a>
              </div>

              <hr>

              <post-list :posts="user.posts"/>
          </div>
      </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PostList from '../components/PostList.vue'
import UserPorfileCardEditor from '../components/UserPorfileCardEditor.vue'
import UserProfileCard from '../components/UserProfileCard.vue'

export default {
  components: { PostList, UserProfileCard, UserPorfileCardEditor },
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({ user: 'authUser' })
  }

}
</script>

<style>

</style>
