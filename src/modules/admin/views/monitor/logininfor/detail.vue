<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref, toRefs } from "vue";
import { useDict } from "@admin/utils/common/dict";
import request from '@admin/api/system/dict';
import to from 'await-to-js';
import { selectDictLabel } from '@admin/utils/ruoyi/index'
const emit = defineEmits(['search'])
const { sys_normal_disable, sys_oper_type } = useDict("sys_normal_disable", "sys_oper_type");

const isLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('操作日志详细')

const data = reactive({
  ruleForm: {},
});
const { ruleForm, rules } = toRefs<any>(data);

function close() {
  ruleForm.value = {}
  ruleFormRef.value.resetFields()
}

const show = async (item: any = {}) => {
  ruleForm.value = item
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const validate = await to(ruleFormRef.value.validate())
  if (!validate[1]) return
  const type = ruleForm.value.dictId ? 'updateType' : 'addType'
  isLoading.value = true
  const [err, res] = await to(request[type](ruleForm.value))
  isLoading.value = false
  if (err) return
  ElMessage.success(res.msg)
  dialogVisible.value = false
  emit('search')
}

/** 操作日志类型字典翻译 */
function typeFormat(row: any) {
  return selectDictLabel(sys_oper_type.value, row.businessType);
}

defineExpose({
  show,
})
</script>

<template>
  <el-dialog @close="close" v-model="dialogVisible" :title="title" width="50%" class="d-dialog" draggable>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px" class="d-edit-form mr-10">
      <el-row :gutter="10">
        <el-col :lg="12" :span="24">
          <el-form-item label="操作模块：">{{ ruleForm.title }} / {{ typeFormat(ruleForm) }}</el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="登录信息：">{{ ruleForm.operName }} / {{ ruleForm.operIp }} / {{ ruleForm.operLocation
          }}</el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="请求地址：">{{ ruleForm.operUrl }}</el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="请求方式：">{{ ruleForm.requestMethod }}</el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="操作方法：">{{ ruleForm.method }}</el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="请求参数：">{{ ruleForm.operParam }}</el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="返回参数：">{{ ruleForm.jsonResult }}</el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="操作状态：">
            <el-tag :type="ruleForm.status === 0 ? 'success' : 'danger'">{{ ruleForm.status === 0 ? '正常' : '失败' }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="消耗时间：">{{ ruleForm.costTime }}毫秒</el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="操作时间：">{{ ruleForm.operTime }}</el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="异常信息：" v-if="ruleForm.status === 1">{{ ruleForm.errorMsg }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
