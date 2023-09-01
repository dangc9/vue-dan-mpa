<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, nextTick } from 'vue'
import dictTag from '@admin/components/Ruoyi/DictTag.vue'
import to from 'await-to-js'
import request from '@admin/api/system/menu'
import MenuDialog from './menuDialog.vue'
import { handleTree } from '@admin/utils/common/content'
import { useDict } from  '@admin/utils/common/dict'
const { sys_normal_disable } = useDict("sys_normal_disable");

const tableData = ref([])
const loading = ref(true)
const searchForm = ref<any>({})
const isExpandAll = ref(false);
const refreshTable = ref(true);
const ids = ref([]);
const menuDialog = ref()

const getList = async () => {
  let params = { ...searchForm.value }
  loading.value = true
  const [err, res] = await to(request.listMenu(params))
  loading.value = false
  if (err) return
  tableData.value = handleTree(res.data, "menuId");
}
getList()

function resetTable() {
  searchForm.value = {}
  getList()
}

const addHandler = (row) => {
  menuDialog.value.show('add', row)
}
const editHandler = (row) => {
  menuDialog.value.show('edit',row)
}

const del = async (row: any) => {
  const [confirm] = await to(ElMessageBox.confirm('是否确认删除名称为"' + row.menuName + '"的数据项?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }))
  if (confirm) return
  const [err] = await to(request.delMenu(row.menuId))
  if (err) return
  ElMessage.success('删除成功')
  getList()
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}
</script>

<template>
  <div class="app-container">
    <div class="header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="菜单名称" prop="roleName">
          <el-input v-model="searchForm.roleName" placeholder="请输入菜单名称" clearable @keyup.enter="getList()" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList()" icon="Search">查询</el-button>
          <el-button @click="resetTable">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <div class="util">
        <el-button type="primary" @click="addHandler" icon="CirclePlus" v-hasPermi="['system:menu:add']">新增菜单</el-button>
        <el-button type="info" plain :icon=" !isExpandAll ?  'FolderOpened' : 'Folder' "  @click="toggleExpandAll">{{  !isExpandAll ? "展开" : "折叠" }}</el-button>
      </div>
      <el-table 
        v-if="refreshTable"
        v-loading="loading" 
        :data="tableData" 
        border 
        :default-expand-all="isExpandAll"
        row-key="menuId">
        <el-table-column prop="menuName" label="菜单名称"/>
        <el-table-column prop="icon" label="图标" align="center" width="100">
          <template #default="{ row }">
            <el-icon>
              <component :is="row.icon === '#' ? '' : row.icon"></component>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" align="center"  width="60"></el-table-column>
        <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" width="200"></el-table-column>
        <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="status" label="状态" align="center"  width="80">
          <template #default="{ row }">
            <dict-tag :options="sys_normal_disable" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="170" prop="createTime">
          <template #default="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="160px" align="center" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="新增" placement="top" v-if="row.roleId !== 1">
              <el-button type="primary" size="small" icon="Plus" @click="addHandler(row)"
                v-hasPermi="['system:user:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top" v-if="row.roleId !== 1">
              <el-button type="primary" size="small" icon="Edit" @click="editHandler(row)"
                v-hasPermi="['system:user:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="row.roleId !== 1">
              <el-button @click="del(row)" type="danger" size="small" icon="Delete"
                v-hasPermi="['system:user:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <MenuDialog ref="menuDialog" @search="getList()" />
  </div>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  padding: 16px 16px 0px 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  background: white;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}

.footer {
  flex: 1;
  display: flex;
  padding: 16px;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
  background: white;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  position: relative;
  box-sizing: border-box;

  .util {
    margin-bottom: 15px;
    display: flex;
    flex-shrink: 0;
  }

  .table-inner {
    flex: 1;
    position: relative;
  }

  .table {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%
  }
}
</style>
