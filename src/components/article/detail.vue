<template>
  <div>
    <div>{{title}}</div>
    <div v-html="content"></div>
  </div>
</template>

<script>

import * as api from '@/services/draft'

export default {
  data () {
    return {

    }
  },
  computed: {
    title(){
        return this.$store.state.article.detail.title;
    },
    content(){
        return this.$store.state.article.detail.content;
    }
  },
  created () {
    this.$store.dispatch('article/getArticle', this.$route.params.id).then((e) => {
        this.$formatMessage(e, '获取文章详情');
    });
  },
  asyncData({store}){
    return store.dispatch('article/getArticle', this.$route.params.id);
  },
  methods: {

  }
}
</script>
<style>

</style>
