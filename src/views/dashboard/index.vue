<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin">主要按钮</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGoodsList } from '@/api/user'
// import { getToken } from '@/utils/auth' // get token from cookie

export default {
  name: 'Dashboard',
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    handleLogin () {
      this.loading = true
      getGoodsList().then(response => {
        console.log(response.data)
        this.$message.info(response.data.count.toString())
        this.loading = false
      }).catch((e) => {
        this.loading = false
        // this.$message.error(e.message)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
