<script setup lang="ts">
  import { ref, reactive, computed } from "vue";
  import "vue-cropper/dist/index.css";
  import { VueCropper } from "vue-cropper";
  import { useUserStore } from "@admin/store/modules/user";
  import { ElMessage } from "element-plus";
  import request from "@admin/api/system/profile";

  const emits = defineEmits(["close"])
  const props = defineProps<{
    avatar: string;
  }>()
  const userStore = useUserStore() as any;
  const open = ref(true);
  const title = ref("修改头像");
  const cropper = ref(null);
  //图片裁剪数据
  const options = reactive({
    img: props.avatar, // 裁剪图片的地址
    autoCrop: true, // 是否默认生成截图框
    autoCropWidth: 200, // 默认生成截图框宽度
    autoCropHeight: 200, // 默认生成截图框高度
    fixedBox: true, // 固定截图框大小 不允许改变
    outputType: "png", // 默认生成截图为PNG格式
    previews: {
      url: '',
      img: '',
    } //预览数据
  });
  /** 覆盖默认上传行为 */
  function requestUpload() {}
  /** 向左旋转 */
  function rotateLeft() {
    cropper.value.rotateLeft();
  }
  /** 向右旋转 */
  function rotateRight() {
    cropper.value.rotateRight();
  }
  /** 图片缩放 */
  function changeScale(num) {
    num = num || 1;
    cropper.value.changeScale(num);
  }
  /** 上传预处理 */
  function beforeUpload(file) {
    if (file.type.indexOf("image/") == -1) {
      ElMessage.error("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        options.img = reader.result as string;
      };
    }
  }
  /** 上传图片 */
  function uploadImg() {
    cropper.value.getCropBlob(data => {
      let formData = new FormData();
      formData.append("avatarfile", data);
      request.uploadAvatar(formData).then(res => {
        open.value = false;
        ElMessage.success("修改成功");
        emits('close', res.imgUrl)
      });
    });
  }
  /** 实时预览 */
  function realTime(data) {
    options.previews = data;
  }
  /** 关闭窗口 */
  function closeDialog() {
    emits('close')
  }
</script>

<template>
  <el-dialog :title="title" v-model="open" width="1000" class="d-dialog max-md:w-full" append-to-body @close="closeDialog">
    <el-row>
      <el-col :xs="24" :md="14" class="h-96">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          :outputType="options.outputType"
          @realTime="realTime"/>
      </el-col>
      <el-col :xs="24" :md="10">
        <div class="flex items-center justify-center h-96 max-md:h-60">
          <div class="overflow-hidden rounded-full w-[200px] h-[200px]">
            <img :src="options.previews.url" :style="options.previews.img" class="max-w-none"/>
          </div>
        </div>
      </el-col>
    </el-row>
    <template #footer>
      <el-row class="text-center">
        <el-col :md="4" :span="8" class="text-left">
          <el-upload
            action="#"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload">
            <el-button type="primary" size="default">
              <el-icon class="el-icon--right"><Upload /></el-icon>上传图片
            </el-button>
          </el-upload>
        </el-col>
        <el-col :md="10" :span="16">
          <el-button size="default"  @click="changeScale(1)">
            <el-icon><Plus/></el-icon>
            <span class="max-md:hidden">放大</span>
          </el-button>
          <el-button size="default" @click="changeScale(-1)">
            <el-icon><Minus/></el-icon>
            <span class="max-md:hidden">缩小</span>
          </el-button>
          <el-button size="default" @click="rotateLeft()">
            <el-icon><RefreshLeft/></el-icon>
            <span class="max-md:hidden">左旋转</span>
          </el-button>
          <el-button size="default" @click="rotateRight()">
            <el-icon><RefreshRight/></el-icon>
            <span class="max-md:hidden">右旋转</span>
          </el-button>
        </el-col>
        <el-col :md="10" class="max-md:mt-10 text-right">
          <el-button type="primary" @click="uploadImg()">提 交</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>
