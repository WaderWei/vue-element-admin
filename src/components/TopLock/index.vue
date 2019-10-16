<template>
  <span>
    <svg-icon icon-class="lock" @click="handleLock" />
    <el-dialog title="设置锁屏密码" :visible.sync="box" width="30%" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="锁屏密码" prop="password" :rules="[{ required: true, message: '锁屏密码不能为空'}]">
          <el-input v-model="form.password" placeholder="请输入锁屏密码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSetLock">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import { validatenull } from '@/utils/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'TopLock',
  data() {
    return {
      box: false,
      form: {
        password: ''
      }
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(['lockPassword'])
  },
  components: {},
  props: [],
  methods: {
    handleSetLock() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$store.commit('user/SET_LOCK_PASSWORD', this.form.password)
          this.handleLock()
        }
      })
    },
    handleLock() {
      if (validatenull(this.lockPassword)) {
        this.box = true
        return
      }
      this.$store.commit('user/SET_LOCK')
      setTimeout(() => {
        this.$router.push({ path: '/lock' })
      }, 100)
    }
  }
}
</script>
