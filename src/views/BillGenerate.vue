<script>
import searchInput from "@/components/searchInput.vue";
import { RouterLink } from "vue-router";
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import electricModal from "@/components/electricModal.vue";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      elecModal: false,
      changeIf: "no",
      newBillSearch: [],
      newnewBillSearch: [],
      cutDateBill: [],
    };
  },
  components: {
    searchInput,
    RouterLink,
    electricModal,
  },
  computed: {
    ...mapState(dataStore, [
      "page",
      "loginObj",
      "monthBill",
      "oneContractObj",
      "perBill",
      "finalBill",
    ]),
  },
  methods: {
    ...mapActions(dataStore, [
      "setPage",
      "setPerBill",
      "setFinalBill",
      "setBillToContract",
    ]),
    showElectric() {
      // 更新帳單資料的彈跳視窗的開關
      this.elecModal = !this.elecModal;
    },
    search() { // 篩出房東和截止日前的帳單
      let empty = {};
      // 讓當天日期變成post欄位stardate的值
      let today = new Date();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      // 確保日期格式符合 2024-06-05，否則會變成 2024-6-5
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;

      let todayStr = today.getFullYear() + "-" + month + "-" + day;
      fetch("http://localhost:8080/bill/billSearch", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(empty),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("全部房東的", data);
          //   this.newBillSearch = data
          this.newBillSearch = data.billList.filter(
            (item) => item.ownerName === this.loginObj.ownerName
          );
          console.log("只有現在房東的", this.newBillSearch);
          this.newnewBillSearch = this.newBillSearch.filter(
            (item) => item.paymentDate > todayStr
          );
          console.log("未截止", this.newnewBillSearch);
          this.newnewBillSearch.sort((a, b) => {  // 繳費期限由小到大排序
            return new Date(a.paymentDate) - new Date(b.paymentDate);
          });
        });
    },
    bringToEdit(index) { // 將選擇的帳單帶到輸入用電量的視窗
      // this.newnewBillSearch[index];
      this.setPerBill(this.newnewBillSearch[index]);
      console.log("選的帳單", this.perBill);
      // this.perBill.eletricV = "";
    },
    updateElectricV() { // 更新用電量
      let electricObj = {
        ai: this.perBill.ai,
        eletricV: this.perBill.eletricV,
      };
      fetch("http://localhost:8080/bill/updateBill", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(electricObj),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("更新完用電量的", data);
          this.setFinalBill(data.billList[0]);
          console.log("pinia裡的finalBill", this.finalBill);
        });
    },
    findCutDate() {  // 篩出對應帳單的契約 => 先抓到全部租約，再一層一層篩
      let empty = {};
      fetch("http://localhost:8080/contract/contratSearch", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(empty),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.cutDateBill = data.contractList.filter(
            (item) =>
              item.ownerName === this.loginObj.ownerName &&
              item.tenantIdentity === this.perBill.tenantIdentity &&
              item.address === this.perBill.address
          );
          console.log("篩出此筆帳單的租約", this.cutDateBill);
          this.setBillToContract(this.cutDateBill);
        });
    },
    sortByPaymentDate() { // 依繳費期限由近到遠排序
      this.newnewBillSearch.sort((a, b) => {
        return new Date(a.paymentDate) - new Date(b.paymentDate);
      });
    },
    electricIsRequired() {  // 用電量欄位防呆
      if (this.perBill.eletricV === "") {
        Swal.fire({
          title: "請填寫本期用電量",
          icon: "warning",
        });
      }else{
        this.$router.push('/billFinalDetail')
      }
    },
  },
  mounted() {
    this.setPage(11);
    this.search();
  },
};
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
  <div class="bigArea">
    <!-- <div class="bar"></div> -->
    <div class="topArea">
      <span class="billTitle">當期帳單</span>
      <!-- <div class="generate">生成帳單</div> -->
    </div>
    <div class="middleArea">
      <span style="font-size: 1.2em; margin-left: 51px"
        >請選擇欲結算的帳單</span
      >
      <div class="tableTitle">繳費期限尚未截止之帳單</div>
      <table class="lastMonth">
        <thead>
          <tr>
            <td scope="col" class="thead">編號</td>
            <td scope="col" class="thead">承租人</td>
            <td scope="col" class="thead">地址</td>
            <td scope="col" class="thead">計費期間</td>
            <td scope="col" class="thead">繳費期限</td>
            <td scope="col" class="thead">更新用電量</td>
            <td scope="col" class="thead">是否已更新</td>
          </tr>
        </thead>
        <tbody>
          <tr class="content" v-for="(item, index) in this.newnewBillSearch">
            <td>{{ index + 1 }}</td>
            <td>{{ item.tenantName }}</td>
            <td>{{ item.address }}</td>
            <td>{{ item.periodStart }}~{{ item.periodEnd }}</td>
            <td>{{ item.paymentDate }}</td>
            <td>
              <button   
                type="button"
                class="updateBtn"
                style="border: none;background-color: transparent;"
                
                @click="
                  this.showElectric();
                  this.bringToEdit(index);
                "
              >
              <i class="fa-solid fa-pen" :disabled="this.newnewBillSearch[index].eletricV" ></i>
              </button>
            </td>
            <td v-if="!this.newnewBillSearch[index].eletricV"><i class="fa-solid fa-circle-exclamation" style="color:red;"></i></td>
            <td v-else><i class="fa-solid fa-circle-check" style="color: green;"></i></td>
          </tr>
        </tbody>
      </table>
      <electricModal v-if="this.elecModal" @alertModal="this.showElectric()">
        <template v-slot:header>
          <div class="headerArea">
            <p class="slotTitle">更新帳單資料</p>
          </div>
        </template>
        <template v-slot:content>
          <div class="contentArea">
            <div class="information">
              <p>承租人姓名：{{ this.perBill.tenantName }}</p>
              <p>承租人身分證字號：{{ this.perBill.tenantIdentity }}</p>
              <p>租賃物件地址：<br />{{ this.perBill.address }}</p>
              <p>
                計費期間：{{ this.perBill.periodStart }}~{{
                  this.perBill.periodEnd
                }}
              </p>
              <p>繳費期限：{{ this.perBill.paymentDate }}</p>
            </div>
            <div class="line"></div>
            <div class="update">
              <label for="electric">&emsp;請輸入用電量</label><br />
              <input
                type="text"
                id="electric"
                style="margin-bottom: 23px"
                class="input-box"
                required
                :valid
                v-model="this.perBill.eletricV"
              />&nbsp;度<br />
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div class="footerArea">
            <button
                type="submit"
                class="submit"
                @click="
                  this.updateElectricV();
                  this.findCutDate();
                  this.electricIsRequired();
                "
              >
                提交
              </button>
          </div>
        </template>
      </electricModal>
    </div>
  </div>
  <!-- electricModal 是跳出的視窗 -->
</template>

<style scoped lang="scss">
.bigArea {
  width: 122dvw;
  height: 94dvh;
  background-color: #faf0e9;
    margin-top: 30px;
  .billTitle {
    font-size: 2.3em;
    font-weight: 500;
    letter-spacing: 5px;
  }
  .topArea {
    display: flex;
    width: 93%;
    height: 11%;
    margin-top: 10px;
    position: relative;
    margin-left: 30px;
    .generate {
      border: none;
      background-color: #f54545;
      color: white;
      width: 10%;
      height: 60%;
      border-radius: 5px;
      font-size: 1.2em;
      padding-top: 5px;
      padding-left: 9px;
      position: absolute;
      top: 30%;
      right: 5%;
      &:hover {
        cursor: pointer;
        background-color: #ef9a95;
      }
    }
  }
  .middleArea {
    width: 100%;
    height: 50%;
    margin-top: 10px;
    .tableTitle {
      margin: 2% auto;
      margin-bottom: 0;
      height: 35px;
      width: 80%;
      background-color: #ffc89a;
      box-shadow: 0px 1px 0px 0px #909090;
      font-size: 1.4em;
      padding-left: 15px;
      font-weight: 500;
    }
    .lastMonth {
      margin: 0 auto;
      margin-top: 1px;
      width: 80%;
      height: 50%;
      text-align: center;
      .thead {
        background-color: #e3e3e3b0;
        height: 33px;
      }
      td {
        background-color: rgb(255 253 253 / 47%);
        height: 33px;
        box-shadow: 0px 1px 0px 0px gray;
        padding: 8px;
      }
    }
  
    .tableName{
      text-decoration: none;
      color: rgb(146, 75, 16);
      background-color: transparent;
      &:hover{
        color: rgb(215, 176, 130);
      }
    }
  
  }
 
}
.updateBtn{
   &:hover{
    cursor: pointer;
        color: #a4663f;
      }
}
.updateBtn[disabled]{
      cursor: not-allowed;
      color: #ccc;
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
  display: flex;
  font-size: 0.5em;
  margin: 0 auto;
  padding-left: 18px;
  padding-top: 10px;
  height: 72%;
  .information {
    width: 50%;
    margin-left: 23px;
    margin-top: 39px;
  }
  .line {
    width: 3px;
    margin-left: -34px;
    margin-right: 29px;
    border-left: 1px solid black;
    margin-top: 20px;
  }
  .update {
    margin-top: 100px;
  }
  input {
    margin-top: 10px;
    margin-bottom: 13px;
  }
  .input-box {
    font-size: 20px;
    border: none;
    border-bottom: 2px solid #ccc;
    color: #0f0f0f;
    width: 110px;
    background-color: transparent;
    transition: border-color 0.3s ease-in-out;
    margin-left: 34px;
  }

  .input-box:focus {
    border-color: #ff9d60;
    outline: none;
    transform: scaleX(1);
  }
  .input-box:valid {
    border-bottom: 2px solid green;
  }

  label {
    text-decoration: solid;
  }
}
.footerArea {
  position: absolute;
  bottom: 0%;
  width: 100%;
  height: 50px;
  .submit {
    border: none;
    background-color: #f75757;
    color: white;
    width: 50px;
    height: 40px;
    border-radius: 5px;
    font-size: 0.5em;
    position: absolute;
    bottom: 25px;
    right: 47px;
    &:hover {
      background-color: #f29f9f;
    }
  }
}
</style>