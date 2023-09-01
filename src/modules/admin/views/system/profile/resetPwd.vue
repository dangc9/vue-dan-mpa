<script setup lang="ts">
  import to from "await-to-js";
  import { ref, reactive } from "vue";
  import request from '@admin/api/system/profile'
  import { ElMessage } from "element-plus";

  const pwdRef = ref(null);
  const user = reactive({
    oldPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined
  });
  const equalToPassword = (rule, value, callback) => {
    if (user.newPassword !== value) {
      callback(new Error("两次输入的密码不一致"));
    } else {
      callback();
    }
  };
  const rules = ref({
    oldPassword: [{ required: true, message: "旧密码不能为空" }],
    newPassword: [{ required: true, message: "新密码不能为空" }, { min: 6, max: 20, message: "长度在 6 到 20 个字符" }],
    confirmPassword: [{ required: true, message: "确认密码不能为空" }, { required: true, validator: equalToPassword }]
  });

  /** 提交按钮 */
  async function submit() {
    const isValidate = await to(pwdRef.value.validate());
    if (isValidate[0]) return;
    const [err, res] = await to(request.updateUserPwd(user.oldPassword, user.newPassword));
    if(err) return
    ElMessage("修改成功");
  };
</script>

<template>
  <el-form ref="pwdRef" :model="user" :rules="rules" label-width="80px" hide-required-asterisk>
    <el-form-item label="旧密码:" prop="oldPassword">
        <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="新密码:" prop="newPassword">
        <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="确认密码:" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" placeholder="请确认新密码" type="password" show-password/>
    </el-form-item>
    <br>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>
