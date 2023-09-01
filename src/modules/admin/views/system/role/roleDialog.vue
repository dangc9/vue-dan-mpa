<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref, toRefs, nextTick } from "vue";
import { useDict } from "@admin/utils/common/dict";
import request from '@admin/api/system/role';
import menuRequest from '@admin/api/system/menu';
import to from 'await-to-js';
const emit = defineEmits(['search'])
const { sys_normal_disable } = useDict("sys_normal_disable");



const menuOptions = ref([]);
const deptOptions = ref([]);
const isLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('新增用户')
const menuExpand = ref(false);
const menuNodeAll = ref(false);

const menuRef = ref(null);
const deptRef = ref(null);

const data = reactive({
  ruleForm: {
    roleId: undefined,
    roleName: undefined,
    roleKey: undefined,
    roleSort: 0,
    status: "0",
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    remark: undefined
  },
  rules: {
    roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
    roleKey: [{ required: true, message: "权限字符不能为空", trigger: "blur" }],
    roleSort: [{ required: true, message: "角色顺序不能为空", trigger: "blur" }]
  },
});
const { ruleForm, rules } = toRefs<any>(data);


function close() {
  ruleFormRef.value.resetFields()
  ruleForm.value = { menuCheckStrictly: true, }
}

const show = async (item: any = {}) => {
  menuRequest.treeselect().then(response => {
    menuOptions.value = response.data.data;
  });
  if (item.roleId) {
    const [err, res] = await to(Promise.all([request.getRole(item.roleId), getRoleMenuTreeselect(item.roleId)]))
    if(err) return
    ruleForm.value = res[0].data.data
    ruleForm.value.roleSort = Number(ruleForm.value.roleSort);
    nextTick(() => {
      let checkedKeys = res[1].data.checkedKeys;
      checkedKeys.forEach((v) => {
        nextTick(() => {
          menuRef.value.setChecked(v, true, false);
        });
      });
    })
    title.value = '修改角色'
  } else {
    title.value = '新增角色'
  }
  dialogVisible.value = true
}

/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}

const handleClose = async () => {
  const validate = await to(ruleFormRef.value.validate())
  if (!validate[1]) return
  ruleForm.value.menuIds = getMenuAllCheckedKeys();
  const type = ruleForm.value.roleId ? 'updateRole' : 'addRole'
  isLoading.value = true
  const [err, res] = await to(request[type](ruleForm.value))
  isLoading.value = false
  if (err) return
  ElMessage.success(res.data.msg)
  dialogVisible.value = false
  emit('search')
}
/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value, type) {
  if (type == "menu") {
    let treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  } else if (type == "dept") {
    let treeList = deptOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value, type) {
  if (type == "menu") {
    menuRef.value.setCheckedNodes(value ? menuOptions.value : []);
  } else if (type == "dept") {
    deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
  }
}
/** 树权限（父子联动） */
function handleCheckedTreeConnect(value, type) {
  if (type == "menu") {
    ruleForm.value.menuCheckStrictly = value ? true : false;
  } else if (type == "dept") {
    ruleForm.value.deptCheckStrictly = value ? true : false;
  }
}
/** 根据角色ID查询部门树结构 */
function getDeptTree(roleId) {
  return request.deptTreeSelect(roleId).then(res => {
    deptOptions.value = res.data.depts;
    return res;
  });
}
/** 根据角色ID查询菜单树结构 */
function getRoleMenuTreeselect(roleId) {
  return menuRequest.roleMenuTreeselect(roleId).then(response => {
    menuOptions.value = response.data.menus;
    return response;
  });
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
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="ruleForm.roleName" placeholder="请输入角色名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item prop="roleKey">
            <template #label>
              <span>
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                权限字符
              </span>
            </template>
            <el-input v-model="ruleForm.roleKey" placeholder="请输入权限字符" />
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="角色顺序" prop="roleSort">
            <el-input-number v-model="ruleForm.roleSort" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="状态">
            <el-radio-group v-model="ruleForm.status">
              <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="菜单权限">
            <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
            <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
            <el-checkbox v-model="ruleForm.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
            <el-tree class="tree-border" :data="menuOptions" show-checkbox ref="menuRef" node-key="id"
              :check-strictly="!ruleForm.menuCheckStrictly" empty-text="加载中，请稍候"
              :props="{ label: 'label', children: 'children' }">
            </el-tree>
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入内容"></el-input>
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
