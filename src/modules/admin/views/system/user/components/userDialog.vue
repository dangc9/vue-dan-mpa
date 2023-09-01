<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref } from "vue";
import { useDict } from "@admin/utils/common/dict";
import request from '@admin/api/system/user';
import to from 'await-to-js';
const emit = defineEmits(['search'])
const { sys_normal_disable, sys_user_sex } = useDict("sys_normal_disable", "sys_user_sex");

defineProps({
  deptOptions: { type: Array, required: true }
})

const postOptions = ref([]);
const roleOptions = ref([]);
const isLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('新增用户')

const rules = reactive({
  userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
  nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }, { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }],
  email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
  phonenumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
})

const ruleForm = ref<any>({})

async function init(id: string | number) {
  const res = await request.getUserInfo(id)
  postOptions.value = res.posts;
  roleOptions.value = res.roles;
}

function close() {
  ruleFormRef.value.resetFields()
  Object.keys(ruleForm.value).forEach(key => {
    if (key === 'sex') ruleForm.value[key] = '男'
    else if (key === 'status') ruleForm.value[key] = true
    else ruleForm.value[key] = null

  })
}

const show = async (item: any = {}) => {
  const  id = item.userId || ''
  init(id)
  title.value = '新增用户'
  if (item.nickName) {
    title.value = '编辑用户'
    const [err, res] = await to(request.getUserInfo(id))
    if (err) return
    ruleForm.value = res.data;
    ruleForm.value.postIds = res.postIds;
    ruleForm.value.roleIds = res.roleIds;
    // ruleForm.value = item
    // Object.keys(item).forEach(key => {
    //   ruleForm[key] = item[key]
    // })
  }
  dialogVisible.value = true
}

const handleClose = async () => {
  const validate = await to(ruleFormRef.value.validate())
  if(!validate[1]) return
  const type = ruleForm.value.userId ? 'edit' : 'add'
  isLoading.value = true
  const [err, res] = await to(request[type](ruleForm.value))
  isLoading.value = false
  if (err) return 
  ElMessage.success(res.msg)
  dialogVisible.value = false
  emit('search')
}

defineExpose({
  show,
})
</script>

<template>
  <el-dialog @close="close" v-model="dialogVisible" :title="title" class="d-dialog" draggable>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules"  label-width="100px" class="d-edit-form mr-10" >
      <el-row :gutter="10">
        <el-col :lg="12" :span="24">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="ruleForm.nickName" placeholder="用户昵称" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="归属部门" prop="deptId">
            <el-tree-select v-model="ruleForm.deptId" :data="deptOptions"
              :props="{ value: 'id', label: 'label', children: 'children' }" value-key="id" placeholder="请选择归属部门"
              check-strictly />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24" v-if="!ruleForm.userId">
          <el-form-item label="用户名称" prop="userName">
            <el-input v-model="ruleForm.userName" placeholder="用户名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24"  v-if="!ruleForm.userId">
          <el-form-item label="用户密码" prop="password">
            <el-input v-model="ruleForm.password" placeholder="用户密码" type="password" maxlength="20" show-password />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="ruleForm.phonenumber" placeholder="手机号码" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="邮箱" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="用户性别">
            <el-select v-model="ruleForm.sex" placeholder="请选择">
              <el-option v-for="dict in sys_user_sex" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="状态">
            <el-radio-group v-model="ruleForm.status">
              <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="岗位">
            <el-select v-model="ruleForm.postIds" multiple placeholder="请选择">
              <el-option v-for="item in postOptions" :key="item.postId" :label="item.postName" :value="item.postId"
                :disabled="item.status == 1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="角色">
            <el-select v-model="ruleForm.roleIds" multiple placeholder="请选择">
              <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId"
                :disabled="item.status == 1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark" type="textarea" placeholder="备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleClose()" :loading="isLoading">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
