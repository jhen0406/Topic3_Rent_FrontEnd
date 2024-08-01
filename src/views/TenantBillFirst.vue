<script>
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import TenantContract from "../components/TenantContract.vue";
import TenantBill from "../components/TenantBill.vue";
import { RouterLink } from "vue-router";
export default {
  data() {
    return {
      changeShow: "A",
      showNextPage: false,
    };
  },
  components: {
    RouterLink,
    TenantContract,
    TenantBill,
  },
  computed: {
    ...mapState(dataStore, ["tenantData", "page"]),
  },
  methods: {
    ...mapActions(dataStore, ["setPage"]),
    changePage(page){ // 頁籤間切換頁面
      this.changeShow = page;
    },
    goToNextPage(show) {
      this.showNextPage = show;
    },
    hideHeader(){
      this.$emit('header',false)
    }
  },
  mounted() {
    this.setPage(12);
    console.log("房客首頁的tenantData",this.tenantData)
    console.log("房客首頁的tenantData",this.tenantData.billList[0].address)
  },
  created(){
   this.hideHeader();
  }
};
</script>

<template>
  <div class="bigArea">
    <div class="topArea"></div>
    <span class="title" style="position: fixed;">親愛的承租人，您好</span>
    <!-- <div class="middleArea"> -->
         <TenantContract v-if="changeShow === 'A'" @next="changePage" :showNextPage="showNextPage" @goToNextPage="goToNextPage"></TenantContract>
        <TenantBill v-if="changeShow === 'B'" @next="changePage" :showNextPage="showNextPage" @goToNextPage="goToNextPage"></TenantBill>

    <!-- </div> -->
  </div>
</template>

<style scoped lang="scss">
.bigArea {
  width: 90vw;
  height: 10dvh;
  margin-left: 248px;
  color: black;
  // margin-top: 50px;
  .topArea{
    width: 144%;
    height: 19dvh;
    background-color: #ffdec2;
    margin-left: -524px;
    z-index: 0;
  }
  .title {
    font-size: 2.5em;
    margin-left: 35px;
    z-index: 1;
    position: absolute;
    background: transparent;
    left: 4%;
    top: 7%;
  }
  .titleBox {
    width: 76%;
    font-size: 1em;
    letter-spacing: 4px;
    margin-left: 53px;
    margin-top: 92px;
    background-color: transparent;
    .label {
      display: contents;
      &:checked {
        font-weight: 600;
      }
      .span {
        position: absolute;
        background: transparent;
        z-index: 99;
        font-size: 1.7em;
        top: 12%;
        &:hover {
          cursor: pointer;
        }
        &:active {
          cursor: pointer;
        }
        &:checked {
          color: #ffffff;
        }
      }
      .titleInput {
        -webkit-appearance: none;
        // background-color: rgb(240, 240, 240);
        color: white;
        margin-right: 3%;
        padding: 10px;
        height: 10dvh;
        width: 17%;
        top: 45px;
        position: relative;
        background-color: #ffdec2;
        // border-radius: 10px;
        &:hover {
          cursor: pointer;
        }
        &:active {
          cursor: pointer;
        }
        &:checked {
          border-bottom: 3px solid rgb(248, 134, 103);
        }
      }
    }
  }
}
</style>