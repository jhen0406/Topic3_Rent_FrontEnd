<script>
import { RouterLink, RouterView } from "vue-router";
import dataStore from "../stores/dataStore";
import { mapState } from "pinia";
import Login from "../components/Login.vue";

export default {
  // 在 template 當標籤使用的方法或是元件，import進來後要宣告在components:{}裡面
  data() {
    return {
      isNavVisible: false,
      showHeaderArea: true,
    };
  },
  watch: {
    $route(to, from) {
      // 當路由變化時，更新 headerArea 的顯示狀態
      this.updateHeaderVisibility(to);
    },
  },
  created() {
    this.updateHeaderVisibility(this.$route);
  },
  components: {
    RouterLink,
    Login
  },
  computed: {
    ...mapState(dataStore, ["page"]),
  },
  methods: {
    // 更新 headerArea 顯示狀態的方法
    updateHeaderVisibility(route) {
      // 隱藏 headerArea 的路由列表
      const hideHeaderRoutes = ['/TenantBillFirst', '/emptyRoomList', '/EmptyRoomDetail'];
      // 如果當前路由在隱藏列表中，設置 showHeaderArea 為 false，否則為 true
      this.showHeaderArea = !hideHeaderRoutes.includes(route.path);
    },
  },
};
</script>

<template>
  <!-- <div class="topArea">
  </div> -->


  <div class="topArea">
    <Login />
  </div>
  <div class="headerArea" v-if="showHeaderArea">
    <!-- <input type="checkbox" id="leftBar" v-model="isNavVisible" />
  <label for="leftBar" class="bars myMouse">
    <i class="fa-solid fa-bars fa-xl"></i>
  </label>
  <nav class="navArea" :class="{ active: isNavVisible }">
    <div>
      <label for="leftBar" class="bars myMouse" @click="isNavVisible = false">
        <span>X</span>
      </label>
    </div> -->
    <!-- ============== -->
    <!-- <RouterLink class="routerItem" :class="{ selectedPage: this.page === 20 }" to="/emptyRoomList">回首頁</RouterLink> -->
    <RouterLink class="routerItem" :class="{ selectedPage: this.page === 13 }" to="/Overview">總覽</RouterLink>
    <RouterLink class="routerItem" :class="{ selectedPage: this.page === 2 }" to="/roomlist">房間列表</RouterLink>
    <RouterLink class="routerItem" :class="{ selectedPage: this.page === 6 }" to="/ContractList">租約管理列表</RouterLink>
    <RouterLink class="routerItem" :class="{ selectedPage: this.page === 11 }" to="/lookupBill">帳單管理</RouterLink>
    <!-- <RouterLink
        class="routerItem"
        :class="{ selectedPage: this.page === 12 }"
        to="/TenantBillFirst"
        >房客</RouterLink
      > -->

    <!-- </nav> -->
  </div>
</template>

<style scoped lang="scss">
.topArea {
  width: 100dvw;
  height: 5%;
  background-color: #f6b47d;
}

.headerArea {
  height: 100dvh;
  width: 16%;
  background-color: #ffc89a;
  padding-top: 8%;
  position: fixed;
  z-index: 2;
  transition: width 0.3s;
  left: 0;

  .routerItem {
    color: black;
    background-color: #ffc89a;
    text-decoration: none;
    font-size: 22px;
    display: flex;
    letter-spacing: 8px;
    justify-content: center;
    padding: 5%;

    &:hover {
      cursor: pointer;
      background-color: #ff9d60;
      font-weight: 400;
      border-left: 16px solid #ffc89a;
      border-radius: 11% 0px 0px 11%;
    }
  }

  .accordion-body {
    padding: 0;
    background-color: #ffc89a;
    // padding-left: 33px;
  }

  .accordion-item {
    border: 0px;
    background-color: #ffc89a;
  }

  .dropdownBtn {
    color: black;
    background-color: #ffc89a;
    text-decoration: none;
    font-size: 22px;
    display: flex;
    letter-spacing: 8px;
    justify-content: center;
    padding: 5%;

    &:hover {
      cursor: pointer;
      background-color: #ff9d60;
      font-weight: 400;
      border-left: 16px solid #ffc89a;
      border-radius: 11% 0px 0px 11%;
      padding-left: 10px;
      padding-bottom: 10px;
    }

    &:checked {
      background-color: #ff9d60;
    }
  }

  .dropdownBtn[aria-expanded="true"] {
    background-color: #f6b47d;
    /* 展開時的背景顏色 */
  }

  .dropdownItem {
    background-color: #f2dcca;
    font-size: 18px;
    justify-content: center;
    height: 45px;
    width: 100%;
    display: flex;
    text-decoration: none;
    letter-spacing: 8px;
    color: black;
    border-left: 16px solid #ffc89a;
    border-radius: 11% 0px 0px 11%;
    align-items: center;
    padding: 5%;

    &:hover {
      cursor: pointer;
      background-color: #ff9d60;
      font-weight: 400;
      border-right: 0px;
      border-left: 16px solid #ffc89a;
      border-radius: 11% 0px 0px 11%;
    }
  }

  .selectedPage {
    background-color: #faf0e9;
    border-radius: 11% 0px 0px 11%;
    border-left: 16px solid #ffc89a;
    // padding-left: 25px;
    font-weight: 500;

    &:hover {
      cursor: default;
      background-color: #faf0e9;
      font-weight: 500;
    }
  }

  button {
    display: block; // 設置按鈕為區塊元素
    margin: 10px; // 設置按鈕外邊距
  }

  label {
    position: absolute;
    top: 10px;
    left: 10px;
    cursor: pointer;
    transition: 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  nav {
    position: fixed;
    height: 100%;
    width: 16%;
    left: -35%;
    overflow: hidden;
    transition: 0.3s ease;
    opacity: 95%;
    z-index: 2;
    background-color: #ffc89a;

    &.active {
      left: 0;
    }

    label {
      width: 30px;
      height: 30px;
      display: flex !important;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: 0.3s ease;

      span {
        font-size: 3rem;
        top: 1px;
        font-family: "Comfortaa", sans-serif;
        font-weight: bold;
      }
    }
  }
}

// =============</style>
