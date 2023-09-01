<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-avatar :size="30" class="avatar" :src="avatar" >
        <img src="@admin/assets/image/avatar.png">
      </el-avatar>
      {{ userInfo.nickName }}
      <!-- <el-icon class="header-icon el-icon--right">
        <arrow-down />
      </el-icon> -->
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :command="3" divided @click="goProfile">
          <el-icon><Avatar/></el-icon>个人中心
        </el-dropdown-item>
        <el-dropdown-item :command="4" divided @click="logOut">
          <el-icon>
            <SwitchButton />
          </el-icon>退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <PersonalDialog ref="person" />
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, ref } from "vue";
import AvatarLogo from '@admin/assets/image/avatar.png'
import { useUserStore } from "@admin/store/modules/user"
import { useTagsViewStore } from "@admin/store/modules/tagsView"
import { usePermissionStore } from "@admin/store/modules/permission"
import PersonalDialog from './PersonalDialog.vue'


const router = useRouter()
const UserStore = useUserStore()
const TagsViewStore = useTagsViewStore()
const PermissionStore = usePermissionStore()


// 用户信息
const userInfo: any = computed(() => UserStore.userInfo)
const person = ref()
const avatar = computed(() => `${import.meta.env.VITE_BASE_API}${userInfo.value.avatar}` || AvatarLogo)
const logOut = async () => {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    UserStore.logout().then(() => {
      location.href = '/admin/index';
      TagsViewStore.clearVisitedView()
      PermissionStore.clearRoutes()
      ElMessage({
        type: "success",
        message: "退出登录成功！"
      });
    })
  });
}
const goProfile = () => {
  router.push({
    name: 'profile'
  })
}
</script>

<style lang="scss" scoped>
.avatar {
  margin-right: 6px
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  outline: none;
  margin: 0 4px 0 16px;
}
</style>
