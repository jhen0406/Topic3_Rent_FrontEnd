<script>
import dataStore from "@/stores/dataStore";
import { mapState } from "pinia";
import { RouterLink } from 'vue-router';
import send_btn from '../components/send_btn.vue';
import ConfirmationModal from '../components/ConfirmationModal.vue'; // 引入模態框組件
import Swal from 'sweetalert2'; // 引入 SweetAlert2

export default {
    data() {
        return {

            sign_date: "",
            cut_reason: "",
            cut_date: "",
            ai: "",
            isSending: false, // 追蹤送出狀態
            showModal: false // 控制模態框顯示狀態

        }
    },

    computed: {
        // 綁定 Pinia 狀態
        // 'oneContractObj' 在 pinia 檔裡的 state
        ...mapState(dataStore, ['oneContractObj', 'roomObj', 'loginObj'])
    },
    components: {
        RouterLink,
        send_btn,
        ConfirmationModal
    },
    created() {
        console.log(this.roomObj);

    },
    mounted() {

    },
    methods: {
        //將日期顯示為特定格式
        formatDate(dateString) {
            const date = new Date(dateString);
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        },
        // 將契約中止資料送至資料庫
        sendCutContractToDB(){
            this.isSending = true; // 禁用按鈕
            let cutObj = {
                ai: this.oneContractObj.ai,
                address: this.oneContractObj.address,
                cutReason: this.cut_reason,
                cutDate: this.cut_date,
            };
            fetch("http://localhost:8080/contract/updateContract", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(cutObj)
            })
            .then(res => res.json())
            .then(data => {
                // 成功更新後跳出成功警示窗並自動跳轉頁面
                if(data.code === 200){
                    Swal.fire({
                        title: "更新契約成功!",
                        text: "可到契約查看詳情查看契約",
                        icon: "success"
                    })
                    .then(() => {
                        this.$router.push('/ContractList'); // 修改為要跳轉的頁面
                    });
                } else {
                    // 更新失敗跳出失敗警示窗
                    Swal.fire({
                        title: "更新契約失敗",
                        text: "請查看日期有無在合約內或漏填",
                        icon: "error"
                    });
                }
                console.log(data);
            })
            .catch(error => {
                // 處理請求失敗的情況
                Swal.fire({
                    title: "更新契約失敗",
                    text: "請查看日期有無在契約期間內",
                    icon: "error"
                });
                console.error("Error:", error);
            })
            .finally(() => {
                this.isSending = false; // 根據需求決定是否要重新啟用按鈕
            });
        },
        // 顯示確認彈跳窗
        confirmAndSend() {
            Swal.fire({
                title: "是否確定送出？",
                text: "若送出後將不能重新編輯!請再次確認!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "是，確定送出",
                cancelButtonText:"否，再考慮一下"
            }).then((result) => {
                if (result.isConfirmed) {
                    this.sendCutContractToDB();
                    this.isSending = true; // 禁用按鈕
                }
            });
        }
    }
}


</script>

<template>
    <div class="bigArea">
        <!-- <h1>與{{oneContractObj.tenantName}}的租賃契約書</h1> -->

        <br>
        <h1>租賃契約書</h1>
        <div class="roomInfo">
            <h2>租賃物件資訊</h2>
            <br>
            <div class="rent_time">
                <label for="start_time">租賃期間 自：{{ oneContractObj.startDate }}</label>

                <label for="end_time">到：{{ oneContractObj.endDate }}</label>

            </div>
            <br>
            租賃物件地址: {{ oneContractObj.address }}
            <br>
            <div style="background-color: white;" v-if="oneContractObj.parking">車位 : 有</div>
            <div v-else  style="background-color: white;">車位 : 無</div>
            樓層: {{ oneContractObj.floor }}
            <br>
            房號: {{ oneContractObj.roomId }}
            <br>
            租金/月: {{ oneContractObj.rentP }}
            <br>
            押金: {{ oneContractObj.deposit }}
            <br>
            管理費/月: {{ oneContractObj.manageP }}
            <br>
            電費/度: {{ oneContractObj.eletricP }}
            <br>
            水費/月: {{ oneContractObj.waterP }}
            <br>
            面積: {{ oneContractObj.acreage }}
            <br>
            <!-- 設備:{{ oneContractObj.equip }} -->
            <!-- <br> -->
            物件備註:{{ oneContractObj.rCondition }}
            <div class="input-wrapper">

            </div>
        </div>
        <br>
        <h2>立契約書人</h2>
        <div class="info">
            <br>
            <h4>出租人姓名:{{ loginObj.ownerName }}</h4>
            <br>
            身分證字號: {{ loginObj.ownerIdentity }}
            <br>
            戶籍地址: {{ oneContractObj.ownerHomeAddress }}
            <br>
            通訊地址: {{ oneContractObj.ownerContactAddress }}
            <br>
            email: {{ loginObj.ownerEmail }}
            <br>
            連絡電話: {{ loginObj.ownerPhone }}
            <br>
            <br>
            <h4>承租人姓名:{{ oneContractObj.tenantName }}</h4>
            <br>
            身分證字號: {{ oneContractObj.tenantIdentity }}
            <br>
            戶籍地址(營業登記地址): {{ oneContractObj.tenantHomeAddress }}
            <br>
            通訊地址: {{ oneContractObj.tenantContactAddress }}
            <br>
            email: {{ oneContractObj.tenantEmail }}
            <br>
            連絡電話: {{ oneContractObj.tenantPhone }}
        </div>
        <br>
        <h3>契約中止</h3>
        <div class="cut">
            <br>
            中止原因: <textarea type="text" v-model="cut_reason" class="input-box"></textarea>
            <br>
            違約金: {{ oneContractObj.cutP }}
            <br>
            中止日期: <input type="date" id="end" style="font-size: 22px;" min="1970-01-01" max="2050-12-31"
                v-model="cut_date" />
        </div>
        <br>
        <h3 class="other">其他備註(或個別磋商條款)</h3>
        <br>
        <textarea disabled style="resize: none; width: 360px;">{{oneContractObj.cOther}}</textarea>
        <br>
        <br>
        <h3 class="signdate">立約日期：{{ formatDate(oneContractObj.signDate) }}</h3>

        契約編號:{{ oneContractObj.ai }}


        <div class="btn">
            <button class="space-between":disabled="isSending" @click="confirmAndSend">送出</button>
        </div>
        <ConfirmationModal :visible="showModal" message="您確定要送出嗎？" @confirm="onConfirm" @cancel="onCancel" />

    </div>
</template>




<style scoped lang="scss">
* {
    margin-right: 0%;
}
button {
        position: absolute;
        right: 18%;
        top:234%;
       // bottom: 0%;
        color: #090909;
        width: 10%;
        padding: 0.5em ;
        font-size: 18px;
        border-radius: 0.5em;
        background: #e8e8e8;
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

.bigArea {

    margin-top: 3%;
    padding: 3%;
    margin-bottom: 3%;
    margin-left: 10%;
    width: 55%;
    background-color: white;
    border: 1px solid rgba(12, 12, 12, 0.096);
    box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;

    .roomInfo {
        background-color: white;
    }

    .info {
        background-color: white;
    }

    .cut {
        background-color: white;
    }
}




.rent_time {
    background-color: white;

    label {
        background-color: white;
    }
}

h3 {
    background-color: white;
    background-color: white;
    background-color: rgb(247, 203, 150);
    width: 25%;

    padding: 2%;
    // text-align: center;
    box-shadow: rgba(0, 0, 0, 0.15) 2.95px 2.95px 3.6px;

}

.other {

    width: 50%;
}

.signdate {
    width: 43%;
    background-color: white;
    box-shadow: none;
}


h4 {
    background-color: white;

}

h2 {
    background-color: white;
    background-color: rgb(247, 203, 150);
    width: 30%;
    padding: 1%;
    text-align: center;
    box-shadow: rgba(0, 0, 0, 0.15) 2.95px 2.95px 3.6px;

}

.roomInfo {
    margin-top: 10%;
}

h1 {
    background-color: white;
    // width: 30%;
    // padding: 2%;
    border-style: inset;
    text-align: center;
    // position: absolute;
    border-radius: 0%;
    top: 2%;
    left: 39%;
    margin: auto;
    // background-color: rgb(158, 112, 57);
    color: rgb(0, 0, 0);
}
</style>
