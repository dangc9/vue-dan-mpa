<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref, toRefs } from "vue";
import { useDict } from "@admin/utils/common/dict";
import request from '@admin/api/monitor/job';
import crontab from '@admin/components/Ruoyi/Crontab/index.vue'
import to from 'await-to-js';
const emit = defineEmits(['search'])
const { sys_job_group, sys_job_status } = useDict("sys_job_group", "sys_job_status");

const isLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const isDialog = ref<boolean>(false)
const isCronDialog = ref<boolean>(false)
const expression = ref("");
const title = ref('新增')

const data = reactive({
  ruleForm: defaultForm(),
  rules: {
    jobName: [{ required: true, message: "任务名称不能为空", trigger: "blur" }],
    invokeTarget: [{ required: true, message: "调用目标字符串不能为空", trigger: "blur" }],
    cronExpression: [{ required: true, message: "cron执行表达式不能为空", trigger: "change" }]
  },
});
const { ruleForm, rules } = toRefs<any>(data);

function defaultForm() {
  return {
    jobId: undefined,
    jobName: undefined,
    jobGroup: undefined,
    invokeTarget: undefined,
    cronExpression: undefined,
    misfirePolicy: 1,
    concurrent: 1,
    status: "0"
  }
}

function close() {
  ruleForm.value = defaultForm()
  ruleFormRef.value.resetFields()
}

const show = async (item: any = {}) => {
  if (item.jobId) {
    const [err, res] = await to(request.getJob(item.jobId))
    if (err) return
    ruleForm.value = res.data
    title.value = '修改任务'
  } else {
    title.value = '添加任务'
  }
  isDialog.value = true
}

const handleSubmit = async () => {
  const validate = await to(ruleFormRef.value.validate())
  if (!validate[1]) return
  const type = ruleForm.value.jobId ? 'updateJob' : 'addJob'
  isLoading.value = true
  const [err, res] = await to(request[type](ruleForm.value))
  isLoading.value = false
  if (err) return
  ElMessage.success(res.msg)
  isDialog.value = false
  emit('search')
}



/** cron表达式按钮操作 */
function handleShowCron() {
  expression.value = ruleForm.value.cronExpression;
  console.log( expression.value );
  isCronDialog.value = true;
}

/** 确定后回传值 */
function crontabFill(value) {
  ruleForm.value.cronExpression = value;
  console.log(ruleForm.value.cronExpression);
}
defineExpose({
  show,
})
</script>

<template>
  <el-dialog @close="close" v-model="isDialog" :title="title" width="40%" class="d-dialog" draggable>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="110px" class="d-edit-form mr-10">
      <el-row :gutter="10">
        <el-col :lg="12" :span="24">
          <el-form-item label="任务名称" prop="jobName">
            <el-input v-model="ruleForm.jobName" placeholder="请输入任务名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="任务分组" prop="jobGroup">
            <el-select v-model="ruleForm.jobGroup" placeholder="请选择">
              <el-option v-for="dict in sys_job_group" :key="dict.value" :label="dict.label"
                :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item prop="invokeTarget">
            <template #label>
              <span>
                <el-tooltip placement="top">
                  <template #content>
                    <div>
                      Bean调用示例：ryTask.ryParams('ry')
                      <br />Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
                      <br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                    </div>
                  </template>
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                调用方法
              </span>
            </template>
            <el-input v-model="ruleForm.invokeTarget" placeholder="请输入调用目标字符串" />
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="cron表达式" prop="cronExpression">
            <el-input v-model="ruleForm.cronExpression" placeholder="请输入cron执行表达式">
              <template #append>
                <el-button type="primary" @click="handleShowCron">生成表达式
                  <i class="el-icon-time el-icon--right"></i>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="执行策略" prop="misfirePolicy">
            <el-radio-group v-model="ruleForm.misfirePolicy">
              <el-radio-button label="1">立即执行</el-radio-button>
              <el-radio-button label="2">执行一次</el-radio-button>
              <el-radio-button label="3">放弃执行</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="是否并发" prop="concurrent">
            <el-radio-group v-model="ruleForm.concurrent">
              <el-radio-button label="0">允许</el-radio-button>
              <el-radio-button label="1">禁止</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="状态">
            <el-radio-group v-model="ruleForm.status">
              <el-radio v-for="dict in sys_job_status" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit()" :loading="isLoading">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-if="isCronDialog" @close="close" v-model="isCronDialog" title="Cron表达式生成器" width="50%" class="d-dialog"  append-to-body draggable>
    <crontab ref="crontabRef" @hide="isCronDialog=false" @fill="crontabFill" :expression="expression"></crontab>
  </el-dialog>
</template>
