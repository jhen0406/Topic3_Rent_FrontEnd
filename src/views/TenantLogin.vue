<script>
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
export default {
  data() {
    return {
      owner_account: "",
      owner_pwd: "",
      tenant_phone: "",
      tenant_identity: "",
    };
  },
  computed: {
    ...mapState(dataStore, ["page", "loginObj","tenantData"]),
  },
  methods: {
    ...mapActions(dataStore, ["setPage", "setLoginObj","setTenantData"]),
    login() {
    let loginObj1 = {
        owner_account: this.owner_account,
        owner_pwd: this.owner_pwd,
    };

    fetch("http://localhost:8080/rent/login", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        credentials: 'include',
        body: JSON.stringify(loginObj1),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        this.setLoginObj(data);
        console.log("pinia裡的", this.loginObj);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
},
    saveTenant(){
      let tenantObj ={
        tenantPhone: this.tenant_phone,
        tenantIdentity:this.tenant_identity
      };
      fetch("http://localhost:8080/bill/tenantList", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(tenantObj),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        console.log(data.billList[0].address);
        this.setTenantData(data);
        console.log('pinia裡的房客資訊',this.tenantData)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
        
    }
  },
  mounted() {
    this.setPage(1);
  },
};
</script>

<template>
  <div class="middleArea">
    <label for="account">帳號</label>
    <input type="text" id="account" v-model="this.owner_account" />
    <label for="pwd">密碼</label>
    <input type="text" id="pwd" v-model="this.owner_pwd" />
    <button type="submit" @click="login()">確認</button>
    <h1>房客輸入以下資訊</h1>
    <label for="tenantPhone">房客電話</label>
    <input type="text" id="tenantPhone" v-model="tenant_phone" />
    <label for="tenantIdentity">房客身分證</label>
    <input type="text" id="tenantIdentity" v-model="tenant_identity" />
    <button type="submit" @click="saveTenant()">確認</button>
  </div>
</template>

<style scoped lang="scss">
.middleArea{
  margin-left: 20%;
}
</style>
