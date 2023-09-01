<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref, toRefs, nextTick } from "vue";
import { useDict } from "@admin/utils/common/dict";
import request from '@admin/api/system/menu';
import to from 'await-to-js';
import { handleTree } from '@admin/utils/common/content'


const emit = defineEmits(['search'])
const { sys_normal_disable, sys_show_hide } = useDict("sys_normal_disable", "sys_show_hide");

const menuOptions = ref([]);
const isLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('新增用户')
const data = reactive({
  ruleForm: defaultForm(),
  rules: {
    icon: [{ required: true, message: "菜单图标不能为空" }],
    menuName: [{ required: true, message: "菜单名称不能为空" }],
    orderNum: [{ required: true, message: "菜单顺序不能为空" }],
    path: [{ required: true, message: "路由地址不能为空" }]
  },
});
const { ruleForm, rules } = toRefs<any>(data);

function close() {
  ruleFormRef.value.resetFields()
  ruleForm.value = defaultForm()
}

function defaultForm() {
  return { 
    menuId: undefined,
    parentId: 0,
    menuName: undefined,
    icon: undefined,
    menuType: "M",
    orderNum: undefined,
    isFrame: "1",
    isCache: "0",
    visible: "0",
    status: "0" 
  }
}

const show = async (type: string, row?: any) => {
  getTreeselect()
  if(type === 'add') {
    if (row != null && row.menuId) {
      ruleForm.value.parentId = row.menuId;
    } else {
      ruleForm.value.parentId = 0;
    }
    title.value = '添加菜单'
  } else {
    const [err, res] = await to(request.getMenu(row.menuId))
    if(err) return
    ruleForm.value = res.data
    title.value = '修改菜单'
  }
  dialogVisible.value = true
}

const handleClose = async () => {
  const validate = await to(ruleFormRef.value.validate())
  if (!validate[1]) return
  const type = ruleForm.value.menuId ? 'updateMenu' : 'addMenu'
  isLoading.value = true
  const [err, res] = await to(request[type](ruleForm.value))
  isLoading.value = false
  if (err) return
  ElMessage.success(res.msg)
  dialogVisible.value = false
  emit('search')
}

/** 查询菜单下拉树结构 */
function getTreeselect() {
  menuOptions.value = [];
  request.listMenu().then(response => {
    const menu = { menuId: 0, menuName: "主类目", children: [] };
    menu.children = handleTree(response.data.data, "menuId");
    menuOptions.value.push(menu);
  });
}

defineExpose({
  show,
})
</script>

<template>
  <el-dialog @close="close" v-model="dialogVisible" :title="title" width="50%" class="d-dialog" draggable>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px" class="d-edit-form mr-10">
      <el-row :gutter="10">
        <el-col :lg="24" :span="24">
          <el-form-item label="上级菜单">
            <el-tree-select v-model="ruleForm.parentId" :data="menuOptions" style="width: 100%;"
              :props="{ value: 'menuId', label: 'menuName', children: 'children' }" value-key="menuId"
              placeholder="选择上级菜单" check-strictly />
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="ruleForm.menuType">
              <el-radio label="M">目录</el-radio>
              <el-radio label="C">菜单</el-radio>
              <el-radio label="F">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="24" :span="24" v-if="ruleForm.menuType !== 'F'">
          <el-form-item label="菜单图标" prop="icon">
            <d-icon-select v-model="ruleForm.icon"/>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="ruleForm.menuName" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="ruleForm.orderNum" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24" v-if="ruleForm.menuType !== 'F'">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                是否外链
              </span>
            </template>
            <el-radio-group v-model="ruleForm.isFrame">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24" v-if="ruleForm.menuType !== 'F'">
          <el-form-item prop="path">
            <template #label>
              <span>
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                路由地址
              </span>
            </template>
            <el-input v-model="ruleForm.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24" v-if="ruleForm.menuType === 'C'">
          <el-form-item prop="component">
            <template #label>
              <span>
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                组件路径
              </span>
            </template>
            <el-input v-model="ruleForm.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24" v-if="ruleForm.menuType !== 'M'">
          <el-form-item>
            <el-input v-model="ruleForm.perms" placeholder="请输入权限标识" maxlength="100" />
            <template #label>
              <span>
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                权限字符
              </span>
            </template>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24" v-if="ruleForm.menuType === 'C'">
          <el-form-item>
            <el-input v-model="ruleForm.query" placeholder="请输入路由参数" maxlength="255" />
            <template #label>
              <span>
                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                路由参数
              </span>
            </template>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24" v-if="ruleForm.menuType === 'C'">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                是否缓存
              </span>
            </template>
            <el-radio-group v-model="ruleForm.isCache">
              <el-radio label="0">缓存</el-radio>
              <el-radio label="1">不缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24" v-if="ruleForm.menuType !== 'F'">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                显示状态
              </span>
            </template>
            <el-radio-group v-model="ruleForm.visible">
              <el-radio v-for="dict in sys_show_hide" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :span="24" v-if="ruleForm.menuType !== 'F'">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                菜单状态
              </span>
            </template>
            <el-radio-group v-model="ruleForm.status">
              <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
              }}</el-radio>
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
