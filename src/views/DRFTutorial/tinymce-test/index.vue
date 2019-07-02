<template>
  <div>
    <tinymce-editor v-model="msg"
                    :disabled="disabled"
                    @onClick="onClick"
                    ref="editor"></tinymce-editor>
    <button @click="clear">清空内容</button>
    <button @click="disabled = true">禁用</button>
    <div class="editor-content" v-html="msg" />
    {{ msg }}
  </div>
</template>

<script>
import TinymceEditor from '@/components/Tinymce2'
export default {
  components: {
    TinymceEditor
  },
  data () {
    return {
      msg: '',
      disabled: false
    }
  },
  methods: {
    // 鼠标单击的事件
    onClick (e, editor) {
      // console.log('Element clicked')
      // console.log(e)
      // console.log(editor)
    },
    // 清空内容
    clear () {
      this.$refs.editor.clear()
    }
  }
}
</script>

<style scoped>
</style>
