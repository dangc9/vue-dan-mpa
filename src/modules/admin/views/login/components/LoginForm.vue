<template>
  <div class="login-title">
    <img class="icon" src="@admin/assets/image/log.png" alt="logo" />
    <h2 class="title grow text-center">{{ VITE_SYS_NAME }}</h2>
  </div>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
    <el-form-item label="" prop="username">
      <el-input placeholder="请输入用户名" autoComplete="on" style="position: relative" v-model.trim="ruleForm.username"
        @keyup.enter.native="submitForm()">
        <template #prefix>
          <el-icon class="el-input__icon">
            <Avatar />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="" prop="password">
      <el-input placeholder="请输入密码" autoComplete="on" @keyup.enter.native="submitForm()" v-model="ruleForm.password"
        :type="passwordType">
        <template #prefix>
          <el-icon class="el-input__icon">
            <GoodsFilled />
          </el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </div>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="" prop="code" v-if="captchaEnabled">
      <div class="flex w-full">
        <el-input v-model="ruleForm.code" placeholder="请输入验证码" autoComplete="on" class="relative grow"
          @keyup.enter.native="submitForm()">
          <template #prefix>
            <el-icon class="el-input__icon">
              <HelpFilled />
            </el-icon>
          </template>
        </el-input>
        <div class="login-code ml-2 sm:ml-4">
          <img :src="codeUrl" @click="getCode" class="h-full cursor-pointer" />
        </div>
      </div>
    </el-form-item>
    <el-checkbox v-model="ruleForm.rememberMe">记住密码</el-checkbox>
    <el-form-item style="width: 100%">
      <el-button :loading="loading" class="login-btn" type="primary" @click="submitForm()">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import to from 'await-to-js'
import request from '@admin/api/login'
import Cookies from "js-cookie";
import type { loginForm } from '@admin/types/login'
import type { FormInstance } from 'element-plus'

const { VITE_SYS_NAME } = import.meta.env
import { useRouter } from 'vue-router'
import { useUserStore } from "@admin/store/modules/user"
import { encrypt, decrypt } from '@admin/utils/encrypt/simpleEncrypt'

const router = useRouter()
// 验证码开关
const captchaEnabled = ref(true);
const UserStore = useUserStore()
const ruleFormRef = ref<FormInstance>()
const passwordType = ref('password')
const loading = ref(false)

const rules = reactive({
  password: [{ required: true, message: "请输入用户名" }],
  username: [{ required: true, message: "请输入密码" }],
  code: [{ required: true, message: "请输入验证码 " }],
})

const username = Cookies.get("oa_username");
const password = Cookies.get("oa_password");
const rememberMe = Cookies.get('oa_rememberMe') || false;

// 表单数据
const ruleForm = reactive<loginForm>({
  username: decrypt(username),
  password: decrypt(password),
  code: '',
  uuid: '',
  rememberMe: Boolean(rememberMe)
})

// 获取验证码
const codeUrl = ref('')
const getCode = async () => {
  const [err, res]  = await to(request.getCodeImg())
  if(err) return
  captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled
  if(captchaEnabled.value ) {
    codeUrl.value = "data:image/gif;base64," + res.img
    ruleForm.uuid = res.uuid
  }
}
getCode()
// 显示密码图标
const showPwd = () => {
  passwordType.value = passwordType.value === 'password' ? '' : 'password'
}

const submitForm = async () => {
  const validate = await to(ruleFormRef.value?.validate())
  if (!validate[1]) return
  if (ruleForm.rememberMe) {
    Cookies.set("oa_username", encrypt(ruleForm.username), { expires: 30 });
    Cookies.set("oa_password", encrypt(ruleForm.password), { expires: 30 });
    Cookies.set("oa_rememberMe", ruleForm.password, { expires: 30 });
  } else {
    Cookies.remove("oa_username");
    Cookies.remove("oa_password");
    Cookies.remove('oa_rememberMe');
  }
  const data = JSON.parse(JSON.stringify(ruleForm))
  // data.password = crypto.encrypt(data.password, 'degongdenglumima')
  loading.value = true
  const [err, res] = await to(UserStore.login(data))
  loading.value = false
  if (err) {
    ruleForm.code = ''
    captchaEnabled.value && getCode()
    return
  }
  nextTick(() => {
    console.log(2);
    console.log(router);
    router.push('/')
  })
}
</script>

<style lang="scss" scoped>
@import "@admin/styles/login/index";
</style>
