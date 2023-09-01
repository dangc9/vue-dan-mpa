<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref, toRefs } from "vue";
import { useDict } from "@admin/utils/common/dict";
import request from '@admin/api/system/post';
import to from 'await-to-js';
const emit = defineEmits(['search'])
const { sys_normal_disable } = useDict("sys_normal_disable");

const isLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('新增')

const data = reactive({
  ruleForm: defaultForm(),
  rules: {
    postName: [{ required: true, message: "岗位名称不能为空", }],
    postCode: [{ required: true, message: "岗位编码不能为空", }],
    postSort: [{ required: true, message: "岗位顺序不能为空", }],
  },
});
const { ruleForm, rules } = toRefs<any>(data);

function defaultForm() {
  return {
    postId: undefined,
    postCode: undefined,
    postName: undefined,
    postSort: 0,
    status: "0",
    remark: undefined
  }
}

function close() {
  ruleForm.value = defaultForm()
  ruleFormRef.value.resetFields()
}

const show = async (item: any = {}) => {
  if (item.postId) {
    const [err, res] = await to(request.getPost(item.postId))
    if (err) return
    ruleForm.value = res.data
    title.value = '修改岗位'
  } else {
    title.value = '添加岗位'
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const validate = await to(ruleFormRef.value.validate())
  if (!validate[1]) return
  const type = ruleForm.value.postId ? 'updatePost' : 'addPost'
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
  <el-dialog @close="close" v-model="dialogVisible" :title="title" width="600px" class="d-dialog" draggable>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px" class="d-edit-form mr-10">
      <el-row :gutter="10">
        <el-col :lg="24" :span="24">
          <el-form-item label="岗位名称" prop="postName">
            <el-input v-model="ruleForm.postName" placeholder="请输入岗位名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="岗位编码" prop="postCode">
            <el-input v-model="ruleForm.postCode" placeholder="请输入编码名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="岗位顺序" prop="postSort">
            <el-input-number v-model="ruleForm.postSort" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="岗位状态" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit()" :loading="isLoading">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
