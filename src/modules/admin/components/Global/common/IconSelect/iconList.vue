<template>
  <div class="icon-body">
    <el-input ref="filterInput" v-model="iconName" class="icon-search" clearable placeholder="请输入图标名称" @clear="filterIcons"
      @input="filterIcons">
      <template #suffix><i class="el-icon-search el-input__icon" /></template>
    </el-input>
    <div class="icon-list relative" v-if="hasIcon">
      <div v-for="item in iconList">
        <div v-if="item.icons.length > 0">
          <div class="my-1.5 mt-4 text-base font-bold" v-html="getIconNameHtml(item.name)"></div>
          <div class="icon-type-list">
            <template v-for="icon in item.icons" :key="icon">
              <div :class="['icon-item', { active: activeIcon === icon }]" @click="selectedIcon(icon)">
                <el-icon>
                  <component :is="icon" />
                </el-icon>
                <span class="text-xs mt-2 px-2" v-html="getIconNameHtml(icon)"></span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无图标" />
  </div>
</template>

<script setup  lang="ts">
import { ref, computed, onMounted } from 'vue'
import iconLists from '@lib/icons/element/iconNames.json'

const props = defineProps({
  activeIcon: {
    type: String
  },
  categroy: {
    type: Array,
    default: () => ["System", "Arrow", "Document", "Media", "Traffic", "Food", "Items", "Weather", "Other"]
  }
});

interface iconListType {
  name: string;
  code: String
  icons: string[];
}

const iconName = ref<string>('');
const iconList = ref<iconListType[]>(getIconList());
const filterInput = ref<HTMLElement>();
const emit = defineEmits(['selected']);

const hasIcon = computed(() => {
  return iconList.value.filter(item => item.icons.length > 0).length > 0
})


function filterIcons() {
  if(!iconName.value) {
    iconList.value = getIconList()
    return
  }
  const currIconList = JSON.parse(JSON.stringify(getIconList())) as iconListType[]
  currIconList.forEach(item => {
    if(item.name.indexOf(iconName.value) !== -1) return
    item.icons = item.icons.filter(icon => icon.toLowerCase().indexOf(iconName.value.toLowerCase()) !== -1)
  })
  iconList.value = currIconList;
}

function getIconList() {
  return iconLists.filter(item => props.categroy.includes(item.code))
}

function getIconNameHtml(str: string) {
  return str.replace(new RegExp(iconName.value, "gi"), '<span class="icon-highlight">$&</span>');
}

function selectedIcon(name: string) {
  emit('selected', name)
}

function reset() {
  iconName.value = ''
  iconList.value = getIconList()
}
onMounted(() => {
  console.log(1);
  filterInput.value.focus()
})

defineExpose({
  reset
})
</script>

<style lang='scss' scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-search {
    position: relative;
    margin-bottom: 5px;
  }
  .icon-list {
    height: 300px;
    padding-right: 10px;
    overflow: auto;
    .icon-type-list {
      border-top: 1px solid var(--el-border-color);
      border-left: 1px solid var(--el-border-color);
      border-radius: 4px;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
    }

    .icon-item {
      text-align: center;
      cursor: pointer;
      color: var(--el-text-color-regular);
      height: 60px;
      font-size: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-right: 1px solid var(--el-border-color);
      border-bottom: 1px solid var(--el-border-color);
      transition: background-color var(--el-transition-duration);
      &:hover {
        background-color: var(--el-border-color-extra-light);
        color: var(--brand-color-light);
      }
      &.active {
        background-color: #409EFF;
        color: var(--el-color-white);
      }
    }
  }
}
:deep(.icon-highlight) {
  color: #409EFF;
}
</style>