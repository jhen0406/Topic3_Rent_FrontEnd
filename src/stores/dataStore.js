import { defineStore } from "pinia";

export default defineStore("dataStore", {
  state: () => ({
    // 存放全域變數的地方
    page: 1, // 讀取當頁頁碼
    loginObj: {}, // 存放房東登入資訊
    roomObj: {},
    oneContractObj: {}, //存放單一筆房間契約的資訊
    cutContractObj: {},
    registerObj: {}, //存放註冊資訊
    billObj: {}, // 存放歷史帳單的單筆帳單(之後要顯示明細)
    monthBill: {}, // 存放當期帳單
    perBill: {}, // 存放單期帳單的單筆帳單(之後要輸入用電量)
    finalBill: {}, // 存放輸入完用電量的帳單
    billToContract: {}, // 找出該帳單的契約
    tenantData: {}, // 房客登入(房客的電話和身分證字號)
    contractListObj: {},
    tenantContract: {}, // 房客的契約
    tenantBill:{},
  }),
  getters: {
    // 返回變數或數據
    getPage: (state) => state.page,
    getLoginObj: (state) => state.loginObj,
    getRoomObj: (state) => state.roomObj,
    getCutContractObj: (state) => state.cutContractObj,
    getoneContractObj: (state) => state.oneContractObj,
    getRegisterObj: (state) => state.registerObj,
    getPerRegisterObj: (state) => state.perRegisterObj,
    getBillObj: (state) => state.billObj,
    getMonthBill: (state) => state.monthBill,
    getPerBill: (state) => state.perBill,
    getFinalBill: (state) => state.finalBill,
    getBillToContract: (state) => state.billToContract,
    getTenantData: (state) => state.tenantData,
    getcontractListObj: (state) => state.contractListObj,
    getTenantContract: (state) => state.tenantContract,
    getTenantBill: (state) => state.tenantBill,
  },

  actions: {
    // 處理數據
    setPage(params) {
      this.page = params;
    },
    setLoginObj(obj) {
      this.loginObj = obj;
    },
    setRoomObj(obj) {
      this.roomObj = obj;
    },
    setOneContractObj(obj) {
      this.oneContractObj = obj;
    },
    setCutContractObj(obj) {
      this.cutContractObj = obj;
    },
    setRegisterObj(obj) {
      this.registerObj = obj;
    },

    setBillObj(obj) {
      this.billObj = obj;
    },
    setMonthBill(obj) {
      this.monthBill = obj;
    },
    setPerBill(obj) {
      this.perBill = obj;
    },
    setFinalBill(obj) {
      this.finalBill = obj;
    },
    setBillToContract(obj) {
      this.billToContract = obj;
    },
    setTenantData(obj) {
      this.tenantData = obj;
    },
    setContractListObj(obj) {
      this.contractListObj = obj;
    },
    setTenantContract(obj) {
      this.tenantContract = obj;
    },
    setTenantBill(obj){
      this.tenantBill = obj;
    }
  },
});
