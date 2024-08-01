<script>
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import Swal from 'sweetalert2';
import Login from "@/components/Login.vue";
import { Loader } from "@googlemaps/js-api-loader"
export default {
    data() {
        return {
            obj: {//搜尋用
                address: "",
                roomId: "",
            },
            ownerAccount: "",// 給searchEmptyRoom()空值，回傳所有資料
            contractList: [],//儲存契約列表
            addressList: [],//放篩選完狀態的地址
            allList: [],//儲存房間列表(固定搜尋全部)
            roomList: [],//儲存篩選完的房間列表(要顯示的空房)
            loggedIn:false,
        }
    },
    components:{
        Login
    },
    computed: {
        ...mapState(dataStore, ['page', 'loginObj', 'roomObj', 'contractListObj','registerObj'])
    },
    methods: {
        ...mapActions(dataStore, ['setPage', 'setRoomObj', 'setLoginObj', 'setContractListObj','setRegisterObj']),
        searchEmptyRoom() { //搜尋空房間
            fetch("http://localhost:8080/room/allInformation", {//
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(this.ownerAccount)
            })
                .then(res => res.json())
                .then(data => {
                    console.log("所有資料", data)
                    console.log("所有契約資料", data.contractList)
                    this.contractList = data.contractList;
                    this.setContractListObj(this.contractList);
                    this.registerList = data.registerList;
                    this.setRegisterObj(this.registerList);
                    console.log('所有房東資料',this.registerObj)
                    this.allList = data.roomList;
                    this.addInAddressList2()
                    let newRoomList = [];
                    for (let i = 0; i < this.allList.length; i++) {
                        let foundMatch = false;
                        for (let j = 0; j < this.addressList.length; j++) {
                            if (this.allList[i].address === this.addressList[j].address) {
                                foundMatch = true;
                                break; // 一旦找到匹配的地址就跳出內層迴圈
                            }
                        }
                        if (!foundMatch) {
                            newRoomList.push(this.allList[i]);
                        }
                    }
                    console.log("未出租的房間列表",newRoomList)
                    this.roomList = newRoomList;
                })
        },
        addInAddressList2() {// searchContractList()中 用來判斷租約狀態
            let today = new Date();
            let month = today.getMonth() + 1;
            let day = today.getDate();
            // 確保日期格式符合 2024-06-05，否則會變成 2024-6-5
            month = month < 10 ? "0" + month : month;
            day = day < 10 ? "0" + day : day;
            let todayStr = today.getFullYear() + "-" + month + "-" + day;
            console.log("今天日期",todayStr);
            this.addressList = this.contractList.filter(item => (todayStr < item.startDate && todayStr >= item.signDate) || (todayStr >= item.startDate && todayStr <= item.endDate));
            console.log("契約列表撈出 出租中的地址", this.addressList);
        },

        search() { //搜尋房間
            console.log("input輸入的地址和房號", this.obj);
            fetch("http://localhost:8080/room/roomSearch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(this.obj)
            })
                .then(res => res.json())
                .then(data => {
                    console.log("搜尋結果(包含其他人)", data)
                    this.allList = data.roomList;
                    this.addInAddressList2()
                    let newRoomList = [];
                    for (let i = 0; i < this.allList.length; i++) {
                        let foundMatch = false;
                        for (let j = 0; j < this.addressList.length; j++) {
                            if (this.allList[i].address === this.addressList[j].address) {
                                foundMatch = true;
                                break; // 一旦找到匹配的地址就跳出內層迴圈
                            }
                        }
                        if (!foundMatch) {
                            newRoomList.push(this.allList[i]);
                        }
                    }
                    console.log(newRoomList)
                    this.roomList = newRoomList;
                })
        },
        browse(index) { //跳轉到Detail前，先抓取點選的該筆資料暫存到pinia
            this.setRoomObj(this.roomList[index]);
            console.log("pinia的setRoomObj", this.roomObj);
        },
        logout() {
            fetch("http://localhost:8080/rent/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Logout failed");
                    }
                    sessionStorage.removeItem("當前帳號"); // 清除当前账号信息
                    this.loggedIn = false; // 重置登录状态
                    console.log("Logout successful");
                })
                .catch(error => {
                    console.error("Logout request failed:", error);
                });
        },

    },
    created() {
        this.searchEmptyRoom()
        this.logout();//瀏覽空房頁面自動登出
    },
    mounted() {
        this.setPage(20);
    },
}
</script>

<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <div class="bigArea">
        <h4>所有空房</h4>
        <div class="search" id="searchId">
            <label>縣市、地區、街道&nbsp;&nbsp;:&nbsp;&nbsp;</label>
            <input type="text" class="searchInput1" title="依地址模糊搜尋" v-model="this.obj.address">
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button class="searchButton bt" @click="search()">搜尋</button>
        </div>
        <div class="area">
            <RouterLink class="RL" v-for="(item, index) in roomList" :key="index" to="/EmptyRoomDetail"
                @click="this.browse(index)">
                <div class="card" style="background-color: rgb(250, 240, 233);">
                    <div class="photo" v-if="item.photo"> <!-- 圖片 -->
                        <img :src="'data:image/jpeg;base64,' + item.photo" alt="Image">
                    </div>
                    <div class="address">
                        <h4>{{ item.address }}</h4>
                    </div> <!-- 地址 -->
                    <div class="acreage">
                        <h4 v-if="item.parking">坪數 : {{ item.acreage }}坪&emsp;&emsp;車位 : 有</h4>
                        <h4 v-else>坪數 : {{ item.acreage }}坪&emsp;&emsp;車位 : 無</h4>
                    </div>
                    <div class="rentP" style="position: absolute; right: 1%; bottom: 1%; color: red;">
                        <h4>{{ item.rentP }}元/月</h4>
                    </div><!-- 租金 -->
                </div>
            </RouterLink>
        </div>
        <a href="#top"><i class="fa-regular fa-circle-up"></i></a>
    </div>
</template>

<style scoped lang="scss">

.bigArea {
    width: 76%;
    height: auto;
    padding: 1.5%;
    margin: 2%;
    margin-left: -145px;
    position: relative;
}

.area {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    float: left;
}



.RL {
    margin: 16px;
    text-decoration: none;
    color: black;
    border-radius: 15px; //四個角的弧度
    .card {
        width: 335px;
        height: 390px;
        border: solid 2px rgb(255, 123, 0);
        border-radius: 15px; //四個角的弧度
        overflow: hidden;

        img {
            width: 100%;
            height: 220px;
        }
    }
}

.RL:active {
    transform: scale(0.97);
}
.RL:hover{
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.fa-circle-up {
    position: absolute;
    font-size: 30px;
    right: 8px;
    bottom: 15px;
}
</style>