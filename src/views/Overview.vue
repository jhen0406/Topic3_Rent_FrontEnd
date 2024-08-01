<script>
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import electricModal from "@/components/electricModal.vue";
import { RouterLink } from "vue-router";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      billList: [], // 全部帳單
      contractList: [], // 全部契約
      roomList: [], // 全部房間
      deadlineContract: [], // 快到期的契約
      deadlineBill: [],
      addressList: [], // 從契約中抓出的出租中地址
      contractLength: "",
      elecModal: false,
      lastMonth: [],
      lastSum: 0,
      thisMonth: [],
      thisSum: 0,
      contractList2: [],
      addressList2: [],
      emptyRoomList: [],
      rentingRoomList:[],
    };
  },
  components: {
    electricModal,
    RouterLink,
  },
  computed: {
    ...mapState(dataStore, ["page", "loginObj"]),
  },
  methods: {
    ...mapActions(dataStore, ["setPage"]),
    showContract() {
      // 繳費方式彈跳視窗的開關
      this.elecModal = !this.elecModal;
    },
    fetch() {// 抓全部資料
      let obj = {
        ownerAccount: this.loginObj.ownerAccount,
      };
      // url
      fetch("http://localhost:8080/room/allInformation", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("全部的", data);
          this.billList = data.billList;
          this.contractList = data.contractList;
          this.contractList2 = data.contractList;
          this.roomList = data.roomList;
          this.searchContractList();
          this.searchContractList2();
          this.findContract();
          this.findBill();
          this.findSum();
          this.alertDeadline();
        });
    },
    findContract() {//篩出快到期的契約(結束前31天)
      const today = new Date();
      // 設定篩選條件，結束日期在今天後31天以內
      const filteredContracts = this.contractList.filter((item) => {
        const endDate = new Date(item.endDate);
        // 計算結束日期與今天的時間差
        const timeDiff = endDate.getTime() - today.getTime();
        // 一天的毫秒數
        const oneDay = 24 * 60 * 60 * 1000;
        // 如果時間差小於31天（即時間差小於31 * 24小時 * 60分鐘 * 60秒 * 1000毫秒）
        return timeDiff < 31 * oneDay && timeDiff > 0;
      });
      // 將篩選後的結果賦值給 contractList
      this.contractList = filteredContracts;
      console.log("剩不到30天的租約", filteredContracts);
      this.contractLength = filteredContracts.length;
    },
    findBill() {// 找出繳費期限即將截止的帳單
      const today = new Date();
      // 設定篩選條件，結束日期在今天後31天以內
      this.deadlineBill = this.billList.filter((item) => {
        const paymentDate = new Date(item.paymentDate);
        // 計算結束日期與今天的時間差
        const timeDiff = paymentDate.getTime() - today.getTime();
        // 一天的毫秒數
        const oneDay = 24 * 60 * 60 * 1000;
        // 如果時間差小於31天（即時間差小於31 * 24小時 * 60分鐘 * 60秒 * 1000毫秒）
        return timeDiff < 5 * oneDay && timeDiff > 0;
      });
      console.log("剩不到5天的帳單", this.deadlineBill);
    },

    searchContractList2() { //從契約列表抓出空房的地址
      this.addInAddressList2();
      let newRoomList = [];
      for (let i = 0; i < this.roomList.length; i++) {
        let foundMatch = false;
        for (let j = 0; j < this.addressList2.length; j++) {
          if (this.roomList[i].address === this.addressList2[j].address) {
            foundMatch = true;
            break; // 一旦找到匹配的地址就跳出內層迴圈
          }
        }
        if (!foundMatch) {
          newRoomList.push(this.roomList[i]);
        }
      }
      this.emptyRoomList = newRoomList;
      console.log("空房列表", this.emptyRoomList);
    },
    addInAddressList2() {// searchContractList()中 用來判斷租約狀態
      let today = new Date();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      // 確保日期格式符合 2024-06-05，否則會變成 2024-6-5
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      let todayStr = today.getFullYear() + "-" + month + "-" + day;
      console.log(todayStr);
      this.addressList2 = this.contractList2.filter(item => (todayStr < item.startDate && todayStr >= item.signDate) || (todayStr >= item.startDate && todayStr <= item.endDate));
      console.log("契約列表撈出 狀態出租中", this.addressList2);
    },



    searchContractList() { //從契約列表抓出出租中的地址
      this.addInAddressList2();
      let newRoomList = [];
      for (let i = 0; i < this.roomList.length; i++) {
        for (let j = 0; j < this.addressList2.length; j++) {
          if (this.roomList[i].address === this.addressList2[j].address) {
            newRoomList.push(this.roomList[i]);
          }
          continue; // 一旦找到匹配的地址就跳出內層迴圈
        }
      }
      console.log(newRoomList)
      this.rentingRoomList = newRoomList;
      console.log("出租中房間列表",this.rentingRoomList)

    },








    findSum() {  // 算出營收加總
      // ======= 上月份營收 ==========
      const today = new Date();
      this.lastMonth = this.billList.filter((item) => {
        const periodEnd = new Date(item.periodEnd);
        return periodEnd.getMonth() === today.getMonth() - 1;
      });
      console.log("上月帳單", this.lastMonth);
      this.lastSum = this.lastMonth.reduce((sum, item) => sum + item.totalOneP, 0);
      console.log("上月帳單加總", this.lastSum);
      // ====== 本月份營收 ==========
      this.thisMonth = this.billList.filter((item) => {
        const periodEnd = new Date(item.periodEnd);
        return periodEnd.getMonth() === today.getMonth();
      });
      console.log("本月帳單", this.thisMonth);
      this.thisSum = this.thisMonth.reduce((sum, item) => sum + item.totalOneP, 0);
      console.log("本月帳單加總", this.thisSum);
    },
    showModal(type) {  // 彈跳視窗動態變化
      if (type === "contract") {
        this.modalTitle = "即將到期之租約列表";
        this.modalContentList = this.contractList;
        this.buttonText = "前往租約列表";
        this.goToPage = "/contractList";
      } else if (type === "bill") {
        this.modalTitle = "繳費即將截止之帳單列表";
        this.modalContentList = this.deadlineBill;
        this.buttonText = "前往帳單列表";
        this.goToPage = "/lookupBill";
      } else if (type === "allRoom") {
        this.modalTitle = "全部商辦";
        this.modalContentList = this.roomList;
        this.buttonText = "前往房間列表";
        this.goToPage = "/roomList";
      } else if (type === "tenanting") {
        this.modalTitle = "出租中";
        this.modalContentList = this.rentingRoomList;
        this.buttonText = "前往房間列表";
        this.goToPage = "/roomList";
      } else if (type === "emptyRoom") {
        this.modalTitle = "全部空房";
        this.modalContentList = this.emptyRoomList;
        this.buttonText = "前往房間列表";
        this.goToPage = "/roomList";
      } else if (type === "sumLast") {
        this.modalTitle = "上月份營收明細";
        this.modalContentList = this.lastMonth;
        this.buttonText = "前往帳單列表";
        this.goToPage = "/lookupBill";
      } else if (type === "sumThis") {
        this.modalTitle = "本月份目前營收";
        this.modalContentList = this.thisMonth;
        this.buttonText = "前往帳單列表";
        this.goToPage = "/lookupBill";
      }
      this.modalType = type;
      this.elecModal = true;
    },
    alertDeadline() {
      if(this.deadlineBill.length != 0 && this.contractLength != 0){
        Swal.fire({
          title: "提醒",
          html: "目前有<br>" + this.contractLength + "筆租約即將到期<br>" + this.deadlineBill.length + "筆帳單繳費期限即將截止",
          icon: "warning",
        });
      } else if(this.contractLength != 0){
        Swal.fire({
          title: "提醒",
          text: "目前有"+ this.contractLength + "筆租約即將到期",
          icon: "warning",
        });
      } else if(this.deadlineBill.length != 0){
        Swal.fire({
          title: "提醒",
          text: "目前有"+this.deadlineBill.length + "筆帳單繳費期限即將截止",
          icon: "warning",
        });
      } else{
      }
    },
  },
  mounted() {
    this.setPage(13);
  },
  created() {
    this.fetch();
  
  },
  updated() {},
};
</script>

<template>
  <div class="middleArea">
    <h1 style="margin-bottom: 30px">{{ this.loginObj.ownerName }}房東，您好</h1>
    <div class="deadlineBox mainBox">
      <div class="areabox"></div>
      <span class="title" style="right: 474px">即將到期</span>
      <button
        class="box1 box"
        @click="this.showModal('contract')"
        style="right: 128px"
      >
        <div class="alert" v-if="this.contractLength" title="30天內即將到期!" style="right: 7px">
          !
        </div>
        <div class="" v-else="(this.contractLength = 0)"></div>
        <span
          class="deadlineText"
          style="position: absolute; left: 28px; top: 7px; margin-left: 0"
          >租約</span
        >
        <span class="deadlineContent">{{ this.contractLength }}</span>
        <span class="deadlineText per">筆</span>
      </button>
      <button
        class="box1 box"
        style="right: -186px"
        @click="this.showModal('bill')"
      >
        <div class="alert" title="5天內繳費截止!" v-if="this.deadlineBill.length">
          !
        </div>
        <div class="" v-else="(this.deadlineBill.length = 0)"></div>
        <span class="deadlineText">帳單</span>
        <span class="deadlineContent">{{ this.deadlineBill.length }}</span>
        <span class="deadlineText per">筆</span>
      </button>
    </div>

    <div class="roomBox mainBox">
      <div
        class="areabox"
        style="left: 2%; width: 35%; height: 361%; top: -126%"
      ></div>
      <span class="title" style="top: -165px; left: 36px">房間狀態</span>

      <button
        class="box2 box"
        style="left: 138px; top: -152px"
        @click="this.showModal('allRoom')"
      >
        <span class="roomText">總數</span>
        <span class="roomContent">{{ this.roomList.length }}</span>
        <span class="deadlineText per" style="top: 64px; left: 132px">間</span>
      </button>
      <button
        class="box2 box"
        style="left: 138px"
        @click="this.showModal('tenanting')"
      >
        <span class="roomText">出租中</span>
        <span class="roomContent">{{ this.rentingRoomList.length }}</span>
        <span class="deadlineText per" style="top: 64px; left: 132px">間</span>
      </button>
      <button
        class="box2 box"
        style="left: 138px; top: 206px"
        @click="this.showModal('emptyRoom')"
      >
        <span class="roomText">空房</span>
        <span class="roomContent">{{ this.emptyRoomList.length }}</span>
        <span class="deadlineText per" style="top: 64px; left: 132px">間</span>
      </button>
    </div>
    <div class="electricBox mainBox">
      <div class="areabox" style="top: -142px"></div>
      <span class="title" style="top: -136px; right: 474px">營收金額</span>
      <button
        class="box1 box"
        style="right: -186px; top: -115px"
        @click="this.showModal('sumLast')"
      >
        <span class="roomText" style="top: 16px; left: 28px">上月營收總計</span>
        <span
          class="roomContent"
          style="font-size: 1.5em; font-weight: 500; top: 61px; left: 120px"
          >{{ this.lastSum }}元</span
        >
      </button>
      <button
        class="box1 box"
        style="right: 128px; top: -115px"
        @click="this.showModal('sumThis')"
      >
        <span class="roomText" style="top: 16px; left: 28px">本月目前營收</span>
        <span
          class="roomContent"
          style="font-size: 1.5em; font-weight: 500; top: 61px; left: 72px; width: 250px;"
          >{{ this.thisSum }}元</span
        >
      </button>
    </div>
  </div>
  <electricModal v-if="this.elecModal" @alertModal="this.showContract()">
    <template v-slot:header>
      <div class="headerArea">
        <p class="slotTitle">{{ modalTitle }}</p>
      </div>
    </template>
    <template v-slot:content>
      <div class="contentArea" id="style-3">
        <table class="contract" v-if="modalType === 'contract'">
          <thead>
            <th scope="col" class="thead">編號</th>
            <th scope="col" class="thead">承租人</th>
            <th scope="col" class="thead">地址</th>
            <th scope="col" class="thead">契約終止日</th>
          </thead>
          <tbody>
            <tr class="content" v-for="(item, index) in this.modalContentList">
              <td>{{ index + 1 }}</td>
              <td>{{ item.tenantName }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.endDate }}</td>
            </tr>
          </tbody>
        </table>
        <table class="contract" v-if="modalType === 'bill'">
          <thead>
            <th scope="col" class="thead">編號</th>
            <th scope="col" class="thead">承租人</th>
            <th scope="col" class="thead">地址</th>
            <th scope="col" class="thead">繳費截止日</th>
          </thead>
          <tbody>
            <tr class="content" v-for="(item, index) in this.modalContentList">
              <td>{{ index + 1 }}</td>
              <td>{{ item.tenantName }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.paymentDate }}</td>
            </tr>
          </tbody>
        </table>
        <table class="contract" v-if="modalType === 'allRoom'">
          <thead>
            <th scope="col" class="thead">編號</th>
            <th scope="col" class="thead">地址</th>
            <th scope="col" class="thead">樓層</th>
            <th scope="col" class="thead">房號</th>
          </thead>
          <tbody>
            <tr class="content" v-for="(item, index) in this.modalContentList">
              <td>{{ index + 1 }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.floor }}</td>
              <td>{{ item.roomId }}</td>
            </tr>
          </tbody>
        </table>
        <table class="contract" v-if="modalType === 'tenanting'">
          <thead>
            <th scope="col" class="thead">編號</th>
            <th scope="col" class="thead">地址</th>
            <th scope="col" class="thead">樓層</th>
            <th scope="col" class="thead">房號</th>
          </thead>
          <tbody>
            <tr class="content" v-for="(item, index) in this.modalContentList">
              <td>{{ index + 1 }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.floor }}</td>
              <td>{{ item.roomId }}</td>
            </tr>
          </tbody>
        </table>
        <table class="contract" v-if="modalType === 'emptyRoom'">
          <thead>
            <th scope="col" class="thead">編號</th>
            <th scope="col" class="thead">地址</th>
            <th scope="col" class="thead">樓層</th>
            <th scope="col" class="thead">房號</th>
          </thead>
          <tbody>
            <tr class="content" v-for="(item, index) in this.modalContentList">
              <td>{{ index + 1 }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.floor }}</td>
              <td>{{ item.roomId }}</td>
            </tr>
          </tbody>
        </table>
        <table class="contract" v-if="modalType === 'sumLast'">
          <thead>
            <th scope="col" class="thead">編號</th>
            <th scope="col" class="thead">承租人</th>
            <th scope="col" class="thead">地址</th>
            <th scope="col" class="thead">計費迄日</th>
            <th scope="col" class="thead">總金額</th>
          </thead>
          <tbody>
            <tr class="content" v-for="(item, index) in this.modalContentList">
              <td>{{ index + 1 }}</td>
              <td>{{ item.tenantName }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.periodEnd }}</td>
              <td>{{ item.totalOneP }}</td>
            </tr>
          </tbody>
        </table>
        <table class="contract" v-if="modalType === 'sumThis'">
          <thead>
            <th scope="col" class="thead">編號</th>
            <th scope="col" class="thead">承租人</th>
            <th scope="col" class="thead">地址</th>
            <th scope="col" class="thead">計費迄日</th>
            <th scope="col" class="thead">總金額</th>
          </thead>
          <tbody>
            <tr class="content" v-for="(item, index) in this.modalContentList">
              <td>{{ index + 1 }}</td>
              <td>{{ item.tenantName }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.periodEnd }}</td>
              <td>{{ item.totalOneP }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-slot:footer>
      <RouterLink :to="goToPage"
        ><button class="goToBtn">{{ buttonText }}</button></RouterLink
      >
    </template>
  </electricModal>
</template>

<style scoped lang="scss">
.middleArea {
  // margin-left: 20%;
  margin-top: 3%;
  width: 100%;
  height: 100dvh;
}
.title {
  font-size: 2em;
  font-weight: 500;
  margin-top: 1%;
  writing-mode: vertical-rl;
  position: absolute;
  left: 40px;
  background-color: transparent;
}
.mainBox {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
  width: 80%;
  height: 23%;
  position: relative;
  background-color: transparent;
}
.areabox {
  width: 80%;
  height: 119%;
  background-color: rgb(214 201 184 / 57%);
  position: absolute;
  left: 43%;
  top: -7px;
  border-radius: 10px;
}
.box {
  border: none;
  border-radius: 10px;
  background-color: #f9ddc6;
  position: absolute;
  border-bottom: 3px solid salmon;
  border-right: 3px solid rgb(219, 114, 102);
  &:hover {
    background-color: #ffdec3;
    &:active {
      border: none;
      transform: scale(0.95);
    }
  }
}
.box1 {
  width: 28%;
  height: 81%;
  top: 17px;
  padding-top: 5px;
}
.box2 {
  width: 19%;
  height: 74%;
  top: 27px;
  z-index: 99;
}
.box3 {
  top: 22px;
  height: 63%;
}
.deadlineText {
  background: transparent;
  font-size: 1.8em;
  font-weight: 450;
  position: absolute;
  left: 28px;
  top: 7px;
}
.per {
  position: absolute;
  font-size: 1.3em;
  top: 72px;
  left: 217px;
}
.deadlineContent {
  position: absolute;
  top: 57px;
  font-size: 2em;
  left: 128px;
  font-weight: 600;
  background: transparent;
}
.moreBtn {
  border: none;
  &:hover {
    color: rgb(220, 138, 38);
  }
}
.roomText {
  position: absolute;
  background: transparent;
  font-size: 1.3em;
  font-weight: 500;
  top: 7px;
  left: 42px;
}
.roomContent {
  background: transparent;
  position: absolute;
  font-size: 2em;
  font-weight: 600;
  left: 54px;
  top: 41px;
}
.headerArea {
  background-color: #ffc89a;
  width: 100%;
  height: 50px;
  position: relative;
  .slotTitle {
    margin: auto 0;
    font-size: 0.6em;
    background-color: transparent;
    padding-left: 10px;
    padding-top: 7px;
    color: #7a451d;
    font-weight: 500;
  }
}
.contentArea {
  margin: 31px auto;
  height: 40dvh;
  width: 88%;
  margin-left: 43px;
  overflow: auto;
}
.contract {
  width: 98%;
  // height: 100%;
  border-collapse: collapse;
  background-color: #cdc6a5;
  text-align: center;
}
.tenantName {
  background-color: transparent;
  text-decoration: none;
}
.thead {
  background-color: #ff9b5cc2;
  border: white;
  padding: 1%;
  height: 47px;
  font-size: 0.5em;
}
.content {
  text-align: center;
  height: 50px;
}
td {
  background-color: #f9ddc6;
  padding: 5px;
  font-size: 0.5em;
}
tr:nth-of-type(odd) td {
  background-color: #ebebeb9e;
}
//捲軸底色
#style-3::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f9ddc6;
  border-radius: 20px;
}
//捲軸寬度
#style-3::-webkit-scrollbar {
  width: 8px;
  background-color: transparent;
}
//捲軸本體顏色
#style-3::-webkit-scrollbar-thumb {
  background-color: #ff9b5cc2;
  border-radius: 20px;
}
.goToBtn {
  font-size: 0.6em;
  border: none;
  background: #e6987bcf;
  color: white;
  width: 156px;
  height: 45px;
  border-radius: 10px;
  position: absolute;
  right: 46px;
  bottom: 14px;
  &:hover {
    background: #ae6347cf;
  }
  &:active {
    transform: scale(0.96);
  }
}
.alert {
  width: 30px;
  height: 30px;
  border: none;
  background-color: red;
  position: absolute;
  top: 7px;
  right: 8px;
  border-radius: 50px;
  padding-top: 3px;
  padding-left: 12px;
  color: white;
  font-weight: 700;
}
</style>