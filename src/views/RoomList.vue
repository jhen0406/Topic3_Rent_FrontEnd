<script>
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import Swal from 'sweetalert2'
export default {
    data() {
        return {
            obj: {//搜尋用
                address: "",
                roomId: "",
            },
            roomList: [],//儲存篩選完的房間列表
            deleteCheckbox: [],//刪除用
            contractList: [],//儲存契約列表
            statusFilter: "",// 新增狀態過濾器
            addressList: [],//放篩選完狀態的地址
            allList: [],//儲存房間列表(固定搜尋全部)
        }
    },
    computed: {
        ...mapState(dataStore, ['page', 'loginObj',])
    },
    methods: {
        ...mapActions(dataStore, ['setPage', 'setRoomObj', 'setLoginObj']),
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
                    // 篩選出當前account的問卷
                    this.roomList = data.roomList.filter(item => item.account === this.loginObj.ownerAccount);
                    console.log("篩選出當前登入者的所有房間", this.roomList)
                    this.allList = data.roomList.filter(item => item.account === this.loginObj.ownerAccount);
                })
        },

        getRoomInfo(index) { //第三層:篩選取得特定房東的特定房間資訊
            console.log("選特定房東的特定房間資訊", this.roomList[index]);//印出來供看console
            this.setRoomObj(this.roomList[index]);


        },


        deleteSelectedRoom() { //從DB中刪除勾選的房間
            let deleteObj = {
                addressList: this.deleteCheckbox,
            };
            console.log("所有勾選的房間", deleteObj)

            if (this.deleteCheckbox.length > 0) {
                this.roomList = this.roomList.filter(
                    (item) => !this.deleteCheckbox.includes(item.id)
                )

                fetch("http://localhost:8080/room/deleteRoom", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: 'include',
                    body: JSON.stringify(deleteObj)
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log("刪除後的新資料", data)
                        if (data.code === 200) {
                            Swal.fire({
                                icon: "success",
                                title: "刪除成功!!",
                                didClose: () => {
                                    this.$router.push('/roomList');
                                    this.search();//重新搜尋 顯示出最新的資料
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "發生錯誤",
                            });
                        }

                    })
            };
            this.deleteCheckbox = [];//刪完要清空這個欲刪除的陣列
        },

        browse(index) { //跳轉到Detail和Edit前，先抓取點選的該筆資料暫存到pinia
            this.setRoomObj(this.roomList[index]);
            console.log("pinia的setRoomObj", this.roomObj)
        },

        searchContractList() { //從契約列表抓出出租中的地址
            let empty = {};
            fetch("http://localhost:8080/contract/contratSearch", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(empty)
            })
                .then(res => res.json())//將回應轉換為 JSON
                .then(data => {
                    console.log("所有契約(不分房東):", data);// 第一層:顯示所有契約(沒有包含特定房東)

                    // 第二層:篩選出當前身份證字號的契約問卷，即顯示特定房東的所有房間資訊
                    this.contractList = data.contractList.filter(item => item.ownerIdentity === this.loginObj.ownerIdentity);
                    console.log("只有當前房東的(篩選特定房東):", this.contractList);
                    this.addInAddressList();

                    let newRoomList = [];
                    for (let i = 0; i < this.allList.length; i++) {
                        for (let j = 0; j < this.addressList.length; j++) {
                            if (this.allList[i].address === this.addressList[j].address) {
                                newRoomList.push(this.allList[i]);
                            }
                            continue; // 一旦找到匹配的地址就跳出內層迴圈
                        }
                    }
                    console.log(newRoomList)
                    this.roomList = newRoomList;
                    // 計算總頁數
                    // this.calculateTotalPages(this.contractList.length)
                })
                .catch(error => {
                    console.error("Error fetching data:", error); //處理錯誤
                });
        },
        addInAddressList() {// searchContractList()中 用來判斷租約狀態
            let today = new Date();
            let month = today.getMonth() + 1;
            let day = today.getDate();
            // 確保日期格式符合 2024-06-05，否則會變成 2024-6-5
            month = month < 10 ? "0" + month : month;
            day = day < 10 ? "0" + day : day;

            let todayStr = today.getFullYear() + "-" + month + "-" + day;
            console.log(todayStr);
            this.addressList = this.contractList.filter(item => (todayStr < item.startDate && todayStr >= item.signDate) || (todayStr >= item.startDate && todayStr <= item.endDate));
            console.log("契約列表撈出 狀態出租中", this.addressList);
        },

        searchContractList2() { //從契約列表抓出空房的地址
            let empty = {};
            fetch("http://localhost:8080/contract/contratSearch", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(empty)
            })
                .then(res => res.json())//將回應轉換為 JSON
                .then(data => {
                    console.log("所有契約(不分房東):", data);// 第一層:顯示所有契約(沒有包含特定房東)

                    // 第二層:篩選出當前身份證字號的契約問卷，即顯示特定房東的所有房間資訊
                    this.contractList = data.contractList.filter(item => item.ownerIdentity === this.loginObj.ownerIdentity);
                    console.log("只有當前房東的(篩選特定房東):", this.contractList);
                    this.addInAddressList2();
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
                    // 計算總頁數
                    // this.calculateTotalPages(this.contractList.length)
                })
                .catch(error => {
                    console.error("Error fetching data:", error); //處理錯誤
                });
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
            this.addressList = this.contractList.filter(item => (todayStr < item.startDate && todayStr >= item.signDate) || (todayStr >= item.startDate && todayStr <= item.endDate));
            console.log("契約列表撈出 狀態出租中", this.addressList);
        },

        // calculateTotalPages(totalItems) { // 計算總頁數
        //     const pageSize = 10; // 假設每頁顯示 10 筆資料
        //     const totalPages = Math.ceil(totalItems / pageSize);
        //     console.log("Total Pages:", totalPages); // 打印總頁數以供參考
        // },

    },

    created() {
        this.search()
    },
    mounted() {
        this.setPage(2)
    },
    beforeUpdate() {

    }
}
</script>

<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <div class="bigArea">

        <div class="search" id="searchId">
            <label>地址&nbsp;&nbsp;:&nbsp;&nbsp;</label>
            <input type="text" class="searchInput1" title="依地址模糊搜尋" v-model="this.obj.address">
            &nbsp;&nbsp;&nbsp;&nbsp;
            <label>房號&nbsp;&nbsp;:&nbsp;&nbsp;</label>
            <input type="text" class="searchInput2" title="依房號模糊搜尋" v-model="this.obj.roomId">
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button class="searchButton bt" @click="search()">搜尋</button>

        </div>
        <div class="aAndD">
            <button class="deleteButton bt" @click="deleteSelectedRoom()">不開放</button>
            <RouterLink to="/addRoom" class="rLStyle">
                <button class="addButton bt">新增房間</button>
            </RouterLink>
            <button class="emptyButton bt" @click="searchContractList2()">僅顯示空房</button>
            <button class="rentingButton bt" @click="searchContractList()">出租中物件</button>
        </div>

        <table class="roomList">
            <tr>
                <th style="width: 4%;"></th>
                <th style="width: 6%;">項次</th>
                <th style="width: 17%;">圖片</th>
                <th style="width: 36%;">地址</th>
                <th style="width: 7%;">樓層</th>
                <th style="width: 7%;">房號</th>
                <th style="width: 12%;">租金</th>
                <th style="width: 13%;">管理</th>
            </tr>

            <tr v-for="(item, index) in this.roomList" :key="index">
                <td style="width: 4%;"><input type="checkbox" v-model="deleteCheckbox" :value="item.address"></td>
                <td style="width: 6%;">{{ index + 1 }}</td>
                <td style="width: 17%; padding: 4px;;">
                    <!-- 使用 img 标签显示图片，src 属性绑定 base64 编码的图片数据，格式为 data:image/jpeg;base64, + item.photo -->
                    <div v-if="item.photo">
                        <img :src="'data:image/jpeg;base64,' + item.photo" alt="Image">
                    </div>
                </td>
                <td style="width: 36%; text-align: left; padding-left: 1%;">
                    <RouterLink to="/roomDetail" @click="this.browse(index)"> {{ item.address }} </RouterLink>
                </td>

                <td style="width: 7%;">{{ item.floor }}</td>
                <td style="width: 7%;">{{ item.roomId }}</td>
                <td style="width: 12%;">{{ item.rentP }}</td>
                <td style="width: 13%;">
                    <RouterLink to="/editRoom" class="edit" @click="this.browse(index)">編輯</RouterLink> <br>
                    <br>
                    <RouterLink to="/contractAdd" class="contractAdd" @click="getRoomInfo(index)">新增契約</RouterLink>

                </td>
            </tr>
        </table>
        <a href="#searchId"><i class="fa-regular fa-circle-up"></i></a>
    </div>
</template>

<style scoped lang="scss">
.bigArea {
    width: 80%;
    padding: 1%;
    margin: 3%;
    position: relative;
}

.search {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    width: 100%;
    margin: 15px 0;
}

.searchInput1 {
    width: 40%;
    border-radius: 5px; //四個角的弧度
}

.searchInput2 {
    width: 20%;
    border-radius: 5px; //四個角的弧度
}

.searchButton {
    width: 65px;
    height: 30px;
    background-color: rgb(255 141 61);
    color: white;
    border-radius: 5px; //四個角的弧度
    border: none;
    cursor: pointer;
}

.aAndD {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    margin: 1% 0;

    .deleteButton {
        width: 65px;
        height: 30px;
        background-color: rgb(255, 123, 53);
        color: white;
        border-radius: 5px; //四個角的弧度
        border: none;
        cursor: pointer;
    }

    .addButton {
        width: 85px;
        height: 30px;
        background-color: rgb(255 141 61);
        color: white;
        border-radius: 5px; //四個角的弧度
        border: none;
        cursor: pointer;
        margin-left: 30px;

        .rLStyle {
            text-decoration: none;
        }
    }

    .emptyButton {
        width: 100px;
        height: 30px;
        background-color: rgb(255 141 61);
        color: white;
        border-radius: 5px; //四個角的弧度
        border: none;
        cursor: pointer;
        margin-left: 775px;
    }

    .rentingButton {
        width: 100px;
        height: 30px;
        background-color: rgb(255 141 61);
        color: white;
        border-radius: 5px; //四個角的弧度
        border: none;
        cursor: pointer;
        margin-left: 15px;
    }
}

.bt:active {
    transform: scale(0.95);
}

.roomList {
    width: 100%;
    margin: auto;
    border-collapse: collapse; //table合併邊框

    th {
        font-size: 20px;
        background: rgb(254, 175, 126);
        border: solid 1px rgb(209, 209, 209);
        color: rgb(0, 0, 0);
        text-align: center;
    }

    td {
        height: 140px;
        font-size: 20px;
        text-align: center;
        border: solid 1px rgb(209, 209, 209);
        padding: 4px 0;
    }
}

.fa-circle-up {
    position: absolute;
    font-size: 30px;
    right: -22px;
    bottom: 15px;
}

img {
    width: 200px;
    height: 150px;
}
</style>