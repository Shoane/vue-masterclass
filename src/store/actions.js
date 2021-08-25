import firebase from 'firebase'
import { findById } from '@/helpers'

export default {
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = Math.floor(Date.now() / 1000)
    const batch = firebase.firestore().batch()
    const postRef = firebase.firestore().collection('posts').doc()
    const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
    batch.set(postRef, post)
    batch.update(threadRef, {
      posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
      contributors: firebase.firestore.FieldValue.arrayUnion(state.authId)
    })
    await batch.commit()
    commit('setItem', { resource: 'posts', item: { ...post, id: postRef.id } })
    commit('appendPostToThread', { childId: postRef.id, parentId: post.threadId })
    commit('appendContributorToThread', { childId: post.userId, parentId: post.threadId })
  },
  async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
    const id = 'gggg' + Math.random()
    const userId = state.authId
    const publishedAt = Math.floor(Date.now() / 1000)
    const thread = { forumId, title, publishedAt, userId, id }
    commit('setItem', { resource: 'threads', item: thread })
    commit('appendThreadToUser', { childId: id, parentId: userId })
    commit('appendThreadtoForum', { childId: id, parentId: forumId })
    dispatch('createPost', { text, threadId: id })
    return findById(state.threads, id)
  },
  async updateThread ({ commit, state }, { title, text, id }) {
    const thread = findById(state.threads, id)
    const post = findById(state.posts, thread.posts[0])
    const newThread = { ...thread, title }
    const newPost = { ...post, text }
    commit('setItem', { resource: 'threads', item: newThread })
    commit('setItem', { resource: 'posts', item: newPost })
    return newThread
  },
  updateUser ({ commit }, user) {
    commit('setItem', { resource: 'users', item: user })
  },
  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids }),
  fetchAllCategories ({ commit }) {
    return new Promise((resolve) => {
      firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
        const categories = querySnapshot.docs.map(doc => {
          const item = { id: doc.id, ...doc.data() }
          commit('setItem', { resource: 'categories', item })
          return item
        })

        resolve(categories)
      })
    })
  },
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id }),
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id }),
  fetchAuthUser: ({ dispatch, state }) => dispatch('fetchItem', { resource: 'users', id: state.authId }),

  fetchItem ({ commit, state }, { resource, id }) {
    return new Promise((resolve) => {
      firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        const item = { ...doc.data(), id: doc.id }
        commit('setItem', { resource, item })
        resolve(item)
      })
    })
  },
  fetchItems ({ dispatch }, { ids, resource }) {
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource })))
  }
}
