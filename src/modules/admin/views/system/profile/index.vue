<script setup lang="ts" name="Profile">
  import { ref, reactive, computed } from 'vue'
  import to from 'await-to-js'
  import request from '@admin/api/system/profile'
  import userInfo from './userInfo.vue'
  import resetPwd from './resetPwd.vue'
  import AvatarEdit from "./AvatarEdit.vue";
  import { useUserStore } from "@admin/store/modules/user";

  const userStore = useUserStore();
  const isEditAvatar = ref(false);
  const activeTab = ref("userinfo");
  const state = reactive<any>({
    user: {},
    roleGroup: {},
    postGroup: {}
  });
  const profileList =  computed(() => {
    const { userName, phonenumber, email, createTime } = state.user
    return [
      { label: '用户名',icon: 'User',value: userName },
      { label: '手机号码', icon: 'Iphone', value: phonenumber },
      { label: '用户邮箱', icon: 'Message', value: email },
      { label: '所属部门', icon: 'HomeFilled', value: `${state.user.dept?.deptName}/${ state.postGroup }` },
      { label: '所属角色', icon: 'UserFilled', value: state.roleGroup },
      { label: '创建日期', icon: 'Calendar', value: createTime },
    ]
  })
  const getUserProfile = async () => {
    const [err, res] = await to(request.getUserProfile())
    if (err) return
    state.user = res.data;
    state.roleGroup = res.roleGroup;
    state.postGroup = res.postGroup;
  }

  function avatarClose(val: string) {
    isEditAvatar.value = false;
    if(val) {
      userStore.userInfo.avatar = val;
    }
  }

  getUserProfile()
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20" class=" max-sm:my-3">
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card class="mb-4">
          <template #header>
            <span class="text-xl">个人信息</span>
          </template>
          <div>
            <div class="text-center">
              <div class="user-info-head" @click="isEditAvatar = true">
                <img :src="userStore.avatar" title="点击上传头像" class="img-circle img-lg" />
              </div>
            </div>
            <div class="text-base">
              <div class="flex py-3 user-item" v-for="item in profileList">
                <div class="flex items-center mr-4"><el-icon class="mr-2"><component :is="item.icon"/></el-icon> {{ item.label }}</div>
                <div class="flex-1 text-right line-clamp-1" :title="item.value">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="16">
        <el-card>
          <template #header>
            <span class="text-xl">个人信息</span>
          </template>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="state.user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <AvatarEdit v-if="isEditAvatar" :avatar="userStore.avatar" @close="avatarClose"/>
  </div>
</template>

<style lang="scss" scoped>
  :deep(.el-card__header) {
    padding: 15px 20px 7px;
  }
  .user-item {
    border-bottom: 1px solid var(--el-border-color);
  }
  .user-info-head {
    position: relative;
    display: inline-block;
    height: 120px;
    width: 120px;
    border-radius: 50%;
    overflow: hidden;
  }
  

  .user-info-head:hover:after {
    content: "+重新上传";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    color: #eee;
    background: rgba(0, 0, 0, 0.5);
    font-size: 12px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    cursor: pointer;
    line-height: 110px;
    border-radius: 50%;
  }
</style>