<!-- 房東註冊頁面(只有房東需要註冊) -->
<script>
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
export default {
    data(){
        return {
            owner_account:"",
            owner_pwd:"",
            owner_identity:"",
            owner_name:"",
            owner_email:"",
            owner_phone:"",
            account_bank:"",
            registerList:[],//存放註冊資訊
        }
    },
    computed: {
        ...mapState(dataStore, ['page','registerObj'])
    },
    methods: {
        ...mapActions(dataStore,['setPage','setRegisterObj']),
        
        register(){
            let registerObj1 = {
                ownerAccount: this.owner_account,
                ownerPwd: this.owner_pwd,
                ownerEmail: this.owner_email,
                ownerPhone: this.owner_phone,
                ownerIdentity: this.owner_identity,
                ownerName: this.owner_name,
                accountBank: this.account_bank
            };
            console.log('Sending data:', registerObj1); // 印出來看有沒有吃到輸入資料
            // url
            fetch("http://localhost:8080/rent/account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerObj1),
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                this.setRegisterObj(data);
                console.log('pinia裡的', this.registerObj);
            })
            .catch(error => {
                console.error('fetch有問題:', error);
            });
        }

    },
    mounted(){
    
    }
}
</script>

<template>
<div class="inputdiv">
    <p>帳號:<input type="text" v-model="owner_account"></p>
    <p>密碼:<input type="password" v-model="owner_pwd"></p>
    <p>真實姓名:<input type="text" v-model="owner_name"></p>
    <p>銀行帳戶:<input type="text" v-model="account_bank"></p>
    <p>身分證字號:<input type="text" v-model="owner_identity"></p>
    <p>手機號:<input type="text" v-model="owner_phone"></p>
    <p>電子郵件:<input type="email" v-model="owner_email"></p>
    <button type="submit" @click="register()">確認</button>
</div>
</template>

<style scoped lang="scss">
*{margin-top: 5%;
margin-left: 30%

}
</style>