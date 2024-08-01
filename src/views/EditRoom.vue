<script>
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import Swal from 'sweetalert2'
export default {
    data() {
        return {
            imageFile: null,
            imageUrl: null,
        }
    },
    computed: {
        ...mapState(dataStore, ['page', 'loginObj', 'roomObj'])
    },
    methods: {
        ...mapActions(dataStore, ['setPage']),

        update() {//更新房間資訊並跳回房間列表
            let newDate={
                address:this.roomObj.address,
                rentP: this.roomObj.rentP,
                deposit: this.roomObj.deposit,
                cutP: this.roomObj.cutP,
                eletricP: this.roomObj.eletricP,
                waterP: this.roomObj.waterP,
                manageP: this.roomObj.manageP,
                acreage: this.roomObj.acreage,
                parking: this.roomObj.parking,
                equip: this.roomObj.equip,
                rOther: this.roomObj.rOther,
            }
            fetch("http://localhost:8080/room/updateRoom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(newDate)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    console.log("更新完的結果", this.roomObj)
                    if (data.code === 200) {
                        Swal.fire({
                            icon: "success",
                            title: "更新成功!!",
                            didClose: () => {
                                this.$router.push('/roomList');
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "輸入內容有誤",
                        });
                    }
                })
        },


    },
    mounted() {
        this.setPage(2)
    }
}
</script>

<template>
    <div class="bigArea">
        <h1>房間詳細資訊</h1>
        <h4>地址 : {{ this.roomObj.address }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            樓層 :{{ this.roomObj.floor }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            房號 : {{ this.roomObj.roomId }}
        </h4>
        <h4>租金 : <input class="rentP inp" type="text" v-model="this.roomObj.rentP"> 元/月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            押金 : <input class="deposit inp" type="text" v-model="this.roomObj.deposit"> 元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            違約金 : <input class="cutP inp" type="text" v-model="this.roomObj.cutP"> 元
        </h4>
        <h4>電費 : <input class="eletricP inp" type="text" v-model="this.roomObj.eletricP"> 元/度&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            水費 : <input class="waterP inp" type="text" v-model="this.roomObj.waterP"> 元/月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            管理費 : <input class="manageP inp" type="text" v-model="this.roomObj.manageP"> 元/月</h4>
        <h4>坪數 : <input class="acreage inp" type="text" v-model="this.roomObj.acreage"> 坪</h4>
        <h4>車位 : <input class="parking inp" type="checkbox" v-model="this.roomObj.parking"></h4>
        <div class="equipDiv">
            <h4 style="margin-bottom: -15px;">物件備註&nbsp;:</h4><br>
            <textarea class="equip inp" style="resize: none; width: 80%; height: 100px;" v-model="this.roomObj.equip"></textarea>
        </div>
        <div class="rOtherDiv">
            <h4 style="margin-top: -15px;">特色描述&nbsp;:</h4><br>
            <textarea class="rOther inp" style="resize: none; width: 80%; height: 100px;" v-model="this.roomObj.rOther"></textarea>
        </div>
        
        <div id="app">
            <form id="imageUploadForm" @submit.prevent="uploadImage">
                <input type="file" id="imageFile" name="imageFile" @change="previewImage" accept="image/*">
                <button type="submit">上傳圖片</button>
            </form>
            <div v-if="imageUrl">
                <h3>預覽圖片:</h3>
                <img :src="imageUrl" alt="Image Preview">
            </div>
        </div>

        <button class="save" @click="update()">儲存更新</button>
    </div>
</template>

<style scoped lang="scss">
.bigArea {
    width: 80%;
    margin: 3% auto;
}

h4{
    margin: 2%;
}

.equip{
    margin: 2%;
    margin-top: 0;
}

.rOther{
    margin: 2%;
    margin-top: -38px;

}

.inp {
    padding-left: 5px;
    width: 16%;
}

.parking{
    width: 2%;
}

#imageUploadForm{
    margin: 2%;
}

.save{
    margin: 2%;
}

</style>