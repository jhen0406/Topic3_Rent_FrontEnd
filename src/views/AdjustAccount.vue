<script>
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import Swal from 'sweetalert2'

export default {
    data() {
        return {
            new_name: "", // 用於存儲新姓名
            new_pwd: "", // 用於存儲新密碼
            old_pwd: "", // 用於存儲舊密碼
            new_phone: "", // 用於存儲新電話
            new_email: "", // 用於存儲新郵箱
            new_bank: "", // 用於存儲新銀行信息
            owner_account: "", // 用於存儲帳戶名
            // 用於控制顯示的狀態
            showName: true,   // 初始顯示更改姓名
            showPwd: false,
            showPhone: false,
            showEmail: false,
            showBank: false,
            loggedIn: false, // 增加登入狀態的判斷
            // showUpdateButton: false // 新增一個變數來控制更新按鈕的顯示
        };
    },
    computed: {
        ...mapState(dataStore, ['loginObj'])
    },
    methods: {
        ...mapActions(dataStore, ['setLoginObj']),

        updateAccountToDB() {
            // 構建更新資料的對象
            const updatedInfo = {
                owner_account: this.loginObj.ownerAccount,
                owner_name: this.new_name || this.loginObj.ownerName,
                owner_phone: this.new_phone || this.loginObj.ownerPhone,
                owner_email: this.new_email || this.loginObj.ownerEmail,
                account_bank: this.new_bank || this.loginObj.account_bank,
            };

            // 檢查是否有至少一個字段被更新
            if (!this.new_name && !this.new_phone && !this.new_email && !this.new_bank) {
                Swal.fire({
                    icon: "error",
                    title: "更新失敗",
                    text: "至少需要更新一個字段"
                });
                return;
            }

            // 發送更新請求
            fetch("http://localhost:8080/rent/updateregister", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(updatedInfo)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.code === 200) {
                        Swal.fire({
                            title: "更新成功!",
                            text: "您的資料已成功更新",
                            icon: "success"
                        });
                        // 更新本地的 loginObj
                        this.setLoginObj(data.updatedUser);
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "更新失敗",
                            text: data.message || "發生錯誤，請稍後再試"
                        });
                    }
                })
                .catch(error => {
                    console.error("更新請求發生錯誤", error);
                    Swal.fire({
                        icon: "error",
                        title: "更新失敗",
                        text: "系統發生錯誤，請稍後再試"
                    });
                });
        },

        // 新增更新密碼的方法
        updatePassword() {
            if (!this.new_pwd) {
                Swal.fire({
                    icon: "error",
                    title: "更新失敗",
                    text: "密碼不能為空"
                });
                return;
            }

            const updatedPassword = {
                owner_account: this.loginObj.ownerAccount,
                ownerOldPwd: this.old_pwd || this.loginObj.ownerOldPwd,
                ownerNewPwd: this.new_pwd,

            };

            // 發送更新密碼請求
            fetch("http://localhost:8080/rent/updatePwd", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(updatedPassword)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.code === 200) {
                        Swal.fire({
                            title: "密碼更新成功!",
                            text: "您的密碼已成功更新，請重新登入!",
                            icon: "success",
                        }).then(() => {
                            // 按下確認按鈕後觸發登出
                            this.setLoginObj(data.updatedUser);
                            window.location.href = '/emptyRoomList';
                            
                        });
                        // 更新本地的 loginObj
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "更新失敗",
                            text: "發生錯誤，請稍後再試"
                        });
                    }
                })
                .catch(error => {
                    console.error("更新密碼請求發生錯誤", error);
                    Swal.fire({
                        icon: "error",
                        title: "更新失敗",
                        text: "系統發生錯誤，請稍後再試"
                    });
                });
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
                    console.log("Logout successful");
                    
                    this.loggedIn = false; // 重置登录状态
                })
                .catch(error => {
                    console.error("Logout request failed:", error);
                });
        },

        // 控制顯示狀態的方法S
        toggleShow(field) {
            this.showName = field === 'name';
            this.showPwd = field === 'pwd';
            this.showPhone = field === 'phone';
            this.showEmail = field === 'email';
            this.showBank = field === 'bank';
            this.showUpdateButton = true; // 顯示更新按鈕
        }
    },
    mounted(){
        this.loggedIn = sessionStorage.getItem("當前帳號") ? true : false;
    }
}
</script>

<template>
    <!-- 選擇修改欄位按鈕 -->
    <div class="btnarea">
        <div class="circle">
            <img src="../assets/房子.png.png" class="house" alt="">
            <div class="string">&nbsp&nbsp選擇修改資訊&nbsp&nbsp</div>
        </div>
        <div class="choosetypebtn">
            <button class="name" @click="toggleShow('name')">姓名</button>
            <button class="pwd" @click="toggleShow('pwd')">密碼</button>
            <button class="email" @click="toggleShow('email')">郵件地址</button>
            <button class="phone" @click="toggleShow('phone')">手機</button>
            <button class="bank" @click="toggleShow('bank')">銀行帳戶</button>
        </div>
    </div>

    <!-- 修改欄位資訊 -->
    <div class="accountInfo">

        <!-- <h5>當前帳號:{{ loginObj.ownerAccount }}</h5> -->

        <div v-if="showName" class="name">
            <h3>當前姓名: </h3>
            <p>{{ loginObj.ownerName }}</p>
            <h4>更新姓名:</h4>
            <input v-model="new_name" type="text" placeholder="輸入新的姓名" />
        </div>

        <div v-if="showPwd" class="pwd">


            <h4>輸入舊密碼: </h4>
            <input v-model="old_pwd" type="text" placeholder="輸入新的密碼" />
            <h4>輸入新密碼:</h4>
            <input v-model="new_pwd" type="text" placeholder="輸入新的密碼" />
        </div>

        <div v-if="showPhone" class="phone">
            <h3>當前手機: </h3>
            <p>{{ loginObj.ownerPhone }}</p>
            <h4>更新手機:</h4>
            <input v-model="new_phone" type="text" placeholder="輸入新的手機號碼" />
        </div>

        <div v-if="showEmail" class="email">
            <h3>當前Email郵件地址: </h3>
            <p>{{ loginObj.ownerEmail }}</p>
            <h4>更新Email郵件地址:</h4>
            <input v-model="new_email" type="email" placeholder="輸入新的郵件地址" />
        </div>

        <div v-if="showBank" class="bank">
            <h3>現行銀行帳戶:</h3>
            <p>{{ loginObj.accountBank }}</p>
            <h4>更新銀行帳戶:</h4>
            <input v-model="new_bank" type="text" placeholder="(分行碼)+10碼帳號，如:(102)1111111111" />
        </div>

        <button v-if="!showPwd" @click="updateAccountToDB">更新資料</button>
        <!-- 新增更新密碼按鈕 -->
        <button v-if="showPwd" @click="updatePassword();logout()">更新密碼</button>
    </div>
</template>

<style scoped lang="scss">
* {
    margin-left: 10%;
    margin-top: 10%;
}

.circle {
    width: 25rem;
    height: 25rem;
    // background-color: rgb(207, 178, 140);
    // border-radius: 50%;
    position: absolute;
    left: 15%;


}

.house {
    position: relative;
    width: 25rem;
    height: 25rem;
    top: -60%;
    left: -10%
}

.string {
    font-size: 2rem;
    width: 20rem;
    height: auto;
    padding: 3%;
    font-weight: 600;
    color: #8a5416;
    margin: auto;
    position: relative;
    background-color: #e0c192;
    border-radius: 50%;
    top: -170%;

    text-align: center;
    justify-content: center;
    align-items: center;
    z-index: 50;

}

//切換欄位按鈕
.choosetypebtn {
    position: relative;
    top: 54%;
    width: 15dvw;
    display: flex;
    color: #110f0f;
    font-size: 18px;
    margin-top: 5%;
    left: -67%;

    :active {
        font-size: 20px;
        font-weight: 600;
    }

    .name {
        margin-bottom: 26px;
        margin-left: 54px;
        width: 100px;
        height: 30px;
        border: 0px;
        background-color: #f9ddc6;
        border-radius: 20px;
    }

    .pwd {
        margin-bottom: 26px;
        margin-left: 54px;
        width: 100px;
        height: 30px;

        border: 0px;
        background-color: #fcc395;
        border-radius: 20px;

        &:hover {
            background-color: #f0c49f;
        }
    }

    .email {
        margin-bottom: 26px;
        margin-left: 54px;
        width: 100px;
        height: 30px;
        border: 0px;
        background-color: #f9ddc6;
        border-radius: 20px;
    }

    .phone {
        margin-bottom: 26px;
        margin-left: 54px;
        width: 100px;
        height: 30px;
        border: 0px;
        background-color: #fcc395;
        border-radius: 20px;

        &:hover {
            background-color: #f0c49f;
        }
    }

    .bank {
        margin-bottom: 26px;
        margin-left: 54px;
        width: 100px;
        height: 30px;
        border: 0px;
        background-color: #f9ddc6;
        border-radius: 20px;
    }
}



input {
    width: 200px;
}

//切換欄位按鈕
.statusButtons {
    width: 80dvw;
    display: flexbox;
    color: #110f0f;
    font-size: 18px;
    margin-top: 5%;

    :active {
        font-size: 20px;
        font-weight: 600;
    }

    .renting {
        margin-bottom: 26px;
        margin-left: 54px;
        width: 12%;
        height: 30px;
        border: 0px;
        background-color: #f9ddc6;
        border-radius: 20px;

        &:hover {
            background-color: #f0c49f;
        }
    }

    .empty {
        margin-bottom: 26px;
        margin-left: 54px;
        width: 12%;
        height: 30px;

        border: 0px;
        background-color: #fcc395;
        border-radius: 20px;

        &:hover {
            background-color: #f0c49f;
        }
    }

    .goingtostart {
        margin-bottom: 26px;
        margin-left: 54px;
        width: 12%;
        height: 30px;

        border: 0px;
        background-color: #f9ddc6;
        border-radius: 20px;

        &:hover {
            background-color: #f0c49f;
        }
    }

    .ended {
        margin-bottom: 26px;
        margin-left: 54px;
        width: 12%;
        height: 30px;

        border: 0px;
        background-color: #fcc395;
        border-radius: 20px;

        &:hover {
            background-color: #f0c49f;
        }
    }

    .all {
        margin-bottom: 26px;
        margin-left: 54px;
        width: 12%;
        height: 30px;

        border: 0px;
        background-color: #ebcbcb;
        border-radius: 20px;

        &:hover {
            background-color: #f0c49f;
        }
    }
}

h3 {
    // background-color: #dab891;
    // width: 15rem;
    // padding: 1%;
}

p {
    font-size: 24px;
    font-weight: 400;
    margin-top: 0%;
    color: #8d795c
}

//更新的輸入框
input {
    margin-top: 0%;

    padding: 1%;
    font-size: 20px;
    padding: 8px 6px;
    border: none;
    border-bottom: 2px solid #ccc;
    color: #0f0f0f;
    width: 50%;
    background-color: transparent;
    transition: border-color 0.3s ease-in-out;


    .underline {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 50%;
        height: 2px;
        background-color: #FF9D60;
        transform: scaleX(0);
        transition: transform 0.3s ease-in-out;
    }

    :focus {
        border-color: #FF9D60;
        outline: none;
    }

    :focus+.underline {
        transform: scaleX(1);
    }
}

//送出更新按鈕
.accountInfo {
    width: 50%;
    position: absolute;
    left: 40%;

    button {
        color: #090909;
        width: 15%;
        padding: 0.5em;
        font-size: 18px;
        border-radius: 0.5em;
        background: #e8e8e8;
        position: relative;
        left: 40%;
        cursor: pointer;
        border: 1px solid #e8e8e8;
        transition: all 0.3s;
        box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;
    }

    button:active {
        color: #666;
        font-weight: 500;
        box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;

    }
}
</style>
