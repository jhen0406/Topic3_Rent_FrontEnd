<script>
import { RouterLink } from "vue-router";
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
export default {
  data() {
    return {
      newBillSearch: [],
      newnewBillSearch: [],
      billFilters: {
        address: "",
        tenantName: "",
        periodStart: "",
        periodEnd: "",
      },
      currentPage: 1,
      itemsPerPage: 10,
      inputname: {
        isFocused: false,
        hasContent: false,
        inputValue: "",
      },
      inputaddress: {
        isFocused: false,
        hasContent: false,
        inputValue: "",
      },
      state: []
    };
  },
  components: {
    RouterLink,
  },
  computed: {
    ...mapState(dataStore, ["page", "loginObj", "monthBill", "billObj"]),
    totalpages() {  // 計算搜尋結果總頁數
      return Math.ceil(this.newnewBillSearch.length / this.itemsPerPage);
    },
    calData() {  // 資料分頁
      console.log("開始要算分頁的資料", this.newnewBillSearch);
      // 起始索引位置 : 當前頁數1，共 10筆，因此當頁資料起始位置為0，第一頁的資料為0-10筆
      const startPage = (this.currentPage - 1) * this.itemsPerPage;
      const endPage = startPage + this.itemsPerPage;
      // slice : 從 newBillSearch 中提取從 startPage 到 endPage 的數據，但不包含 endPage
      return this.newnewBillSearch.slice(startPage, endPage);
    },
    calPages() { // 動態生成頁碼
      let pages = []; // 將全部頁碼變成一個陣列
      const total = this.totalpages;
      // 從 1 遍歷到總頁數，生成對應的頁碼
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    },

  },
  methods: {
    ...mapActions(dataStore, ["setPage", "setBillObj", "setMonthBill"]),
    search() {  // 帳單列表搜索
      let searchObj = {
        address: this.billFilters.address,
        tenantName: this.billFilters.tenantName,
        periodStart: this.billFilters.periodStart,
        periodEnd: this.billFilters.periodEnd,
      };
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
        credentials: 'include',
        body: JSON.stringify(searchObj),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("全部房東的", data);
          //   this.newBillSearch = data
          this.newBillSearch = data.billList.filter(
            (item) => (item.ownerName === this.loginObj.ownerName)
          );
          console.log("只有現在房東的", this.newBillSearch);
          this.newnewBillSearch = this.newBillSearch.filter(
            (item) => item.paymentDate < todayStr
          );
          console.log("已截止", this.newnewBillSearch);
          this.cacheNewnewBillSearch = this.newnewBillSearch;
        });
    },
    bringToDetail(index) { // 偵測到選的帳單並存到pinia
      this.setBillObj(this.newnewBillSearch[index]);
      console.log('選的帳單',this.newBillSearch[index]);
      index = "";
    },
    generateBill() { // 帳單生成
      // 讓當天日期變成post欄位stardate的值
      let today = new Date();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      // 確保日期格式符合 2024-06-05，否則會變成 2024-6-5
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;

      let todayStr = today.getFullYear() + "-" + month + "-" + day;
      // console.log(todayStr);
      let generateBillObj = {
        // startdate: "2099-12-31", //測試用
        startdate: todayStr,
        ownerAccount: this.loginObj.ownerAccount,
      };
      fetch("http://localhost:8080/bill/BillsForContract", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        credentials: 'include',
        body: JSON.stringify(generateBillObj),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.setMonthBill(data.billList);
          console.log("pinia裡的當期帳單", this.monthBill);
        });
    },
    nextPage() { // 分頁功能：下一頁
      // 如果當前頁數比總頁數小，當前頁數 + 1 (翻到下一頁)
      if (this.currentPage < this.totalpages) {
        this.currentPage++;
      }
    },
    prevPage() { // 分頁功能：上一頁
      // 如果當前頁數不是1，當前頁數 - 1 (翻到前一頁)
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    changePage(page) { // 分頁功能：跳轉到指定頁
      this.currentPage = page;
    },
    handleFocus(input) { // 偵測輸入框被選到
      this[`input${input}`].isFocused = true;
    },
    handleBlur(input) { // 偵測輸入框沒被選到
      this[`input${input}`].isFocused = false;
    },
    checkContentAdd(input) { // 偵測地址輸入框有無填東西(地址搜尋框)
      this[`input${input}`].hasContent = this.billFilters.address.length > 0;
    },
    checkContentName(input) { // 偵測地址輸入框有無填東西(承租人搜尋框)
      this[`input${input}`].hasContent = this.billFilters.tenantName.length > 0;
    },
    tenantStatus(start, end) {  // 區分承租中和契約結束的狀態
      let now = new Date();
      start = new Date(start)
      end = new Date(end)
      end.setDate(end.getDate() + 1);
      end.setHours(0, 0, 0, 0);
      if (now > end) {
        return "契約已結束"
      } else if (now >= start && now <= end) {
        return "承租中"
      }
    },
    filterTenanting() {  // 篩出承租中的所有帳單
      this.newnewBillSearch = this.cacheNewnewBillSearch.filter(item => this.tenantStatus(item.startDate, item.endDate) === "承租中");
    },
    filterEnded() { // 篩出契約結束的所有帳單
      this.newnewBillSearch = this.cacheNewnewBillSearch.filter(item => this.tenantStatus(item.startDate, item.endDate) === "契約已結束");
    },
    filterAll() {  // 篩出全部帳單
      this.newnewBillSearch = this.cacheNewnewBillSearch;
    }
  },
  created() { },
  mounted() {
    this.setPage(11);
    this.search();
  },
};
</script>

<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
  <div class="bigArea">
    <!-- <span class="billTitle">帳單列表</span> -->
    <div class="searchArea">
      <span class="searchTitle">搜尋</span>
      <label for="tenantName" class="subTitleColor" style="top: 1px; left: 167px"
        :class="{ active: inputname.isFocused || inputname.hasContent }">依承租人
      </label>
      <!-- <span name="tenantName" class="subTitle" style="top: 1px;left: 167px;">依承租人</span> -->
      <input class="searchInput" id="tenantName" type="text" v-model="this.billFilters.tenantName"
        :class="{ active: inputname.isFocused || inputname.hasContent }" @focus="handleFocus('name')"
        @blur="handleBlur('name')" @input="checkContentName('name')" /><br />

      <label for="address" class="subTitleColor" style="top: 1px; left: 395px"
        :class="{ active: inputaddress.isFocused || inputaddress.hasContent }">依地址</label>
      <!-- <span class="subTitle" name="address" style="top: 1px;left: 395px;">依地址</span> -->
      <input class="searchInput" type="text" id="address"
        :class="{ active: inputaddress.isFocused || inputaddress.hasContent }" @focus="handleFocus('address')"
        @blur="handleBlur('address')" @input="checkContentAdd('address')" v-model="this.billFilters.address"
        style="position: absolute; top: 33px; left: 339px; width: 350px" />

      <button class="searchBtn" @click="this.search()">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 30px; background-color: transparent"></i>
      </button>
      <br />
      <label for="start" class="start">計費起日&emsp;<input type="date" id="start"
          v-model="this.billFilters.periodStart" /></label>
      <span style="position: absolute; top: 95px; left: 374px">到</span>
      <label for="end" class="end">計費迄日&emsp;<input type="date" id="start"
          v-model="this.billFilters.periodEnd" /></label>
      <br />
      <span class="searchTitle" style="position: absolute; bottom: 16%">承租狀態</span>
      <button class="typeBtn" @click="filterAll()" style="position: absolute; bottom: 6%; left: 16%">
        全部
      </button>
      <button class="typeBtn" @click="filterTenanting()" style="position: absolute; bottom: 6%; left: 39%">
        承租中
      </button>
      <button class="typeBtn" @click="filterEnded()" style="position: absolute; bottom: 6%; left: 62%">
        契約已結束
      </button>
      <RouterLink to="/generatebill" style="
            background-color: transparent;
            text-decoration: none;
            color: white;
          ">
      <button class="generate" style="position: absolute; bottom: 15%; right: -8%; width: 14%;"
        @click="this.generateBill(new Date())">
        當期帳單
      </button></RouterLink>
    </div>
    <div class="listArea">
      <table class="contract">
        <thead>
          <th scope="col" class="thead">編號</th>
          <th scope="col" class="thead">承租人</th>
          <th scope="col" class="thead">地址</th>
          <th scope="col" class="thead">房號</th>
          <th scope="col" class="thead">承租狀態</th>
          <th scope="col" class="thead">計費起日</th>
          <th scope="col" class="thead">計費迄日</th>
        </thead>
        <tbody>
          <tr class="content" v-for="(item, index) in this.calData">
            <td>{{ index + 1 }}</td>
            <td>
              <RouterLink to="/BillDetail" class="tenantName" @click="this.bringToDetail(index)">{{ item.tenantName }}
              </RouterLink>
            </td>
            <td>{{ item.address }}</td>
            <td>{{ item.roomId }}</td>
            <td>{{ this.tenantStatus(item.startDate, item.endDate) }}</td>
            <td>{{ item.periodStart }}</td>
            <td>{{ item.periodEnd }}</td>
          </tr>
        </tbody>
      </table>
      <div class="changePage">
        <!-- 上一頁和下一頁按鈕： :disabled 表示在當前頁數 === 特定位置時禁用(不能按) -->
        <button class="prevpage page" @click="prevPage" :disabled="currentPage === 1">
          < </button>
            <button v-for="page in calPages" :key="page" class="otherPages page" @click="this.changePage(page)"
              :class="{ active: currentPage === page }">
              {{ page }}
            </button>
            <button class="nextpage page" @click="nextPage" :disabled="currentPage === totalpages">
              >
            </button>
            <!-- <div class="totalPage">總頁數: {{totalpages}}</div> -->
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bigArea {
  width: 100%;
  height: 100%;
  margin-left: 21%;
  margin-top: 22px;

  .billTitle {
    font-size: 2.3em;
    font-weight: 500;
    letter-spacing: 5px;
  }
}

.searchArea {
  width: 90%;
  height: 32dvh;
  margin: 2% 0%;
  border-radius: 24px;
  padding: 2%;
  padding-bottom: 0;
  padding-left: 5%;
  background: transparent;
  margin-bottom: 0%;
  position: relative;
  margin-left: -16%;

  .fa-solid {
    &:hover {
      color: #dabe9e;
    }
  }

  .start {
    position: absolute;
    top: 42%;
    left: 9.5%;
  }

  .end {
    position: absolute;
    top: 42%;
    right: 22%;
  }

  .searchTitle {
    font-size: 1.7em;
    background-color: transparent;
  }

  // .subTitleColor{
  //   position: absolute;
  //   color: #c4c4c4;
  //   &:focus{
  //     color: #000000;
  //   }
  // }
  .subTitleColor {
    position: absolute;
    color: #c4c4c4;
  }

  .subTitleColor.active {
    color: #000000;
  }

  .subTitle {
    position: absolute;
    background-color: transparent;
  }

  .searchInput {
    margin-bottom: 26px;
    margin-left: 54px;
    margin-right: 30px;
    padding-left: 10px;
    width: 200px;
    border: 1.5px solid #c4c4c4;
    border-radius: 10px;
    height: 32px;
    outline: none;
    // &:focus{
    //   border-color: black;
    // }
  }

  .searchInput.active {
    border-color: black;
  }

  .typeBtn {
    margin-bottom: 26px;
    margin-left: 54px;
    width: 15%;
    height: 14%;
    color: rgb(255 99 1);
    border: 0px;
    background-color: #f9ddc6;
    border-radius: 20px;

    &:hover {
      background-color: #f0c49f;
    }
  }

  .searchBtn {
    border: 0px;
    background-color: transparent;
    position: absolute;
    top: 67px;
    right: 33px;
  }

  .generate {
    border: none;
    background-color: #f54545;
    color: white;
    width: 10%;
    height: 18%;
    border-radius: 5px;
    font-size: 1.2em;
    position: absolute;

    // top: 30%;
    // right: 5%;
    &:hover {
      cursor: pointer;
      background-color: #ef9a95;
    }
  }
}

.listArea {
  width: 110%;
  height: 100dvh;
margin-left: -20%;
  .contract {
    width: 100%;
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
  }

  .content {
    text-align: center;
    height: 50px;
  }
  //   tr{
  //     display: block;
  //     float: left;
  //   }
  td {
    background-color: #f9ddc6;
    padding: 5px;
  }
  //   th{
  //     display: block;
  //   }
  tr:nth-of-type(odd) td {
    background-color: #ebebeb9e;
  }

  .changePage {
    width: 73%;
    margin: 15px auto;
    display: flex;
    justify-content: space-evenly;
    padding: 7px 0;
  }

  button.page {
    border: none;
    border-radius: 50px;
    width: 30px;
    height: 30px;
    font-weight: 700;
    color: #5d411c;
  }

  .nextpage,
  .prevpage {
    background: #fec799;

    &:hover {
      background-color: #f9ddc6;
    }
  }

  .otherPages {
    background-color: #f9ddc6;

    &:hover {
      background: #fec799;
    }
  }

  button:disabled {
    cursor: not-allowed;
    color: #a2a1a1;
    background-color: #e1e1e1d3;

    &:hover {
      cursor: not-allowed;
      color: #a2a1a1;
      background-color: #e1e1e1d3;
    }
  }
}
</style>