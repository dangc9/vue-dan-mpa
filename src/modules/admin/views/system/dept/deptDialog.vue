<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref, toRefs } from "vue";
import { useDict } from "@admin/utils/common/dict";
import request from '@admin/api/system/dept';
import to from 'await-to-js';
import { handleTree } from '@admin/utils/common/content'


const emit = defineEmits(['search'])
const { sys_normal_disable } = useDict("sys_normal_disable");

const deptOptions = ref([]);
const isLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('新增部门')
const data = reactive({
  ruleForm: defaultForm(),
  rules: {
    parentId: [{ required: true, message: "上级部门不能为空" }],
    deptName: [{ required: true, message: "部门名称不能为空" }],
    orderNum: [{ required: true, message: "显示排序不能为空" }],
    email: [{ type: "email", message: "请输入正确的邮箱地址" }],
    phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码" }]
  },
});
const { ruleForm, rules } = toRefs<any>(data);

function close() {
  ruleFormRef.value.resetFields()
  ruleForm.value = defaultForm()
}

function defaultForm() {
  return {
    deptId: undefined,
    parentId: undefined,
    deptName: undefined,
    orderNum: 0,
    leader: undefined,
    phone: undefined,
    email: undefined,
    status: "0"
  }
}

const show = async (type: string, row?: any) => {
  if (type === 'add') {
    getTreeselect()
    if (row != null && row.deptId) {
      ruleForm.value.parentId = row.deptId;
    }
    title.value = '添加部门'
  } else {
    const [err, res] = await to(Promise.all([request.listDeptExcludeChild(row.deptId), request.getDept(row.deptId)]))
    if (err) return
    deptOptions.value = handleTree(res[0].data, "deptId");
    ruleForm.value = res[1].data
    title.value = '修改部门'
  }
  dialogVisible.value = true
}

const handleClose = async () => {
  const validate = await to(ruleFormRef.value.validate())
  if (!validate[1]) return
  const type = ruleForm.value.deptId ? 'updateDept' : 'addDept'
  isLoading.value = true
  const [err, res] = await to(request[type](ruleForm.value))
  isLoading.value = false
  if (err) return
  ElMessage.success(res.msg)
  dialogVisible.value = false
  emit('search')
}

/** 查询菜单下拉树结构 */
async function getTreeselect() {
  const [err, res] = await to(request.listDept())
  if (err) return
  deptOptions.value = handleTree(res.data, "deptId");
}

defineExpose({
  show,
})
</script>

<template>
  <el-dialog @close="close" v-model="dialogVisible" :title="title" width="40%" class="d-dialog" draggable>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px" class="d-edit-form mr-10">
      <el-row :gutter="10">
        <el-col :lg="24" :span="24" v-if="ruleForm.parentId !== 0">
          <el-form-item label="上级部门" prop="parentId">
            <el-tree-select v-model="ruleForm.parentId" :data="deptOptions" value-key="deptId"
              :props="{ value: 'deptId', label: 'deptName', children: 'children' }" placeholder="选择上级部门" check-strictly />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="ruleForm.deptName" placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="ruleForm.orderNum" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="负责人" prop="leader">
            <d-select-user v-model="ruleForm.leader" v-model:nameList="ruleForm.leaderName" string :limit="1" class="w-full"></d-select-user>
            <!-- <el-input v-model="ruleForm.leader" placeholder="请输入负责人" maxlength="20" /> -->
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入联系电话" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="部门状态">
            <el-radio-group v-model="ruleForm.status">
              <el-radio v-for="dict in sys_normal_disable" :label="dict.value">{{ dict.label }}</el-radio>
            </el-radio-group>
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

<style lang="scss" scoped>
.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #FFFFFF none;
  border-radius: 4px;
  width: 100%;
}
</style>
