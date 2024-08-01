<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from"./components/Header.vue"


</script>

<template>
  <div class="header">
    <Header />
  </div>
<div class="top">
  <topHeader />


  <button class="login">登入/註冊</button>
</div>


  <RouterView />
</template>

<style scoped lang="scss">

.header {
  width: 23dvw;
  height: 100dvh;
  z-index: 2;
  background-color: transparent;
}

//這邊可以讓topheader浮出來
.top{
  position: fixed;
  z-index: -99;
}

.login{
    width: 8%;
    height: 3%;
    font-size: larger;
    margin-left: 60%;
    z-index: 1;
}
</style>