<script>
export default {};
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
  <div class="slotArea">
    <!-- 彈出視窗的整個頁面 -->
    <div class="block">
      <!-- 彈出視窗的框框 -->
      <slot name="header">
      </slot>

      <button type="button" class="close" @click="$emit('alertModal')">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <slot name="content"></slot>
      <slot name="footer"></slot>
      <!-- <button type="button" class="closefooter" @click="$emit('alertModal')">
        取消
      </button> -->
    </div>
    <div class="bg"></div>
    <!-- 彈出視窗框框外的背景-->
  </div>
</template>

<style lang="scss" scoped>
.slotArea {
  // 彈出視窗的整個頁面
  width: 100dvw;
  height: 200dvh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  .block {
    // 彈出視窗
    width: 800px;
    height: 430px;
    background-color: #faf0e9;
    position: absolute;
    top: 10%;
    left: 24%;
    font-size: 36px;
    z-index: 2;
  }

  .bg {
    width: 100dvw;
    height: 200dvh;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgb(109, 109, 109, 0.4);
    backdrop-filter: blur(10px);
  }
}
.close {
  position: absolute;
  border: none;
  position: absolute;
  top: 1px;
  right: 18px;
  font-size: 0.8em;
  background: transparent;
  
}
.fa-solid {
  background: transparent;
  color: #7a451d;
  &:hover{
    color: #c6a387;
  }
}
.closefooter {
  border: none;
  background-color: #adadad;
  color: white;
  width: 50px;
  height: 40px;
  border-radius: 5px;
  font-size: 0.5em;
  position: absolute;
  bottom: 25px;
  right: 117px;
  &:hover{
    background-color: #c0bfbf;
  }
}

</style>
