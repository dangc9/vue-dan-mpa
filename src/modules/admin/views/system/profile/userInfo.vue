<script setup lang="ts">
  import to from "await-to-js";
  import { ref } from "vue";
  import request from '@admin/api/system/profile'
  import { ElMessage } from "element-plus";
  
  const props = defineProps({
    user: {
      type: Object
    }
  });
  const userRef = ref(null);
  const rules = ref({
    nickName: [{ required: true, message: "用户昵称不能为空", }],
    email: [{ required: true, message: "邮箱地址不能为空", }, { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    phonenumber: [{ required: true, message: "手机号码不能为空", }, { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", }],
  });
  /** 提交按钮 */
  async function submit() {
    const isValidate = await to(userRef.value.validate());
    if (isValidate[0]) return;
    const [err, res] = await to(request.updateUserProfile(props.user));
    if(err) return
    ElMessage.success("修改成功");
  };
</script>

<template>
   <el-form ref="userRef" :model="user" :rules="rules" label-width="80px" hide-required-asterisk>
      <el-form-item label="用户昵称:" prop="nickName">
         <el-input v-model="user.nickName" maxlength="30" />
      </el-form-item>
      <el-form-item label="手机号码:" prop="phonenumber">
         <el-input v-model="user.phonenumber" maxlength="11" />
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
         <el-input v-model="user.email" maxlength="50" />
      </el-form-item>
      <el-form-item label="性别:">
         <el-radio-group v-model="user.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
         </el-radio-group>
      </el-form-item>
      <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
   </el-form>
</template>
