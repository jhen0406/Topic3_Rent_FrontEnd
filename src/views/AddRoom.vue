<script>
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import { RouterLink } from "vue-router";
import Swal from 'sweetalert2'
export default {
    data() {
        return {
            cities: {},//縣市選單
            areas: [],
            selectedCity: '',
            selectedArea: '',
            //================
            address: "",
            account: "",//從登入完的pinia抓
            floor: "",
            rId: "",
            rentP: "",
            deposit: "",
            cutP: "",
            eletricP: "",
            waterP: "",
            manageP: "",
            acreage: "",
            parking: false,
            equip: "",
            rOther: "",
            photo: "",
            //==================
            imageFile: null,//上傳圖片的東西
            imageUrl: null,
            //==================
        }
    },
    computed: {
        ...mapState(dataStore, ['page', 'loginObj']),
        fullAddress() {//把地址的三個v-model合再一起
            const cityName = this.cities[this.selectedCity] ? this.cities[this.selectedCity].CityName : '';
            const areaName = this.areas[this.selectedArea] ? this.areas[this.selectedArea].AreaName : '';
            return `${cityName}${areaName}${this.streetName}`;
        },
        
    },
    methods: {
        ...mapActions(dataStore, ['setPage']),

        handleFileUpload(event) {//處理文件上傳事件並將文件保存到 photo 屬性中 
            this.photo = event.target.files[0];
        },

        addRoomToDB() {//新增房間資訊到DB
            this.address = this.fullAddress;//
            let formData = new FormData();
            formData.append('photo', this.photo);
            formData.append('address', this.address);
            formData.append('account', this.loginObj.ownerAccount); // pinia暫存的房東帳號
            formData.append('floor', this.floor);
            formData.append('rId', this.rId);
            formData.append('rentP', this.rentP);
            formData.append('deposit', this.deposit);
            formData.append('cutP', this.cutP);
            formData.append('eletricP', this.eletricP);
            formData.append('waterP', this.waterP);
            formData.append('manageP', this.manageP);
            formData.append('acreage', this.acreage);
            formData.append('parking', this.parking);
            formData.append('equip', this.equip);
            formData.append('rOther', this.rOther);
            fetch("http://localhost:8080/room/creatRoom", {
                method: "POST",
                credentials: 'include',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.code === 200) {
                        Swal.fire({
                            icon: "success",
                            title: "新增成功!!",
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
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: "error",
                        title: "上傳失敗",
                    });
                });
        },

        fetchCities() {//縣市地區資料fetch
            fetch('https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json')
                .then(response => response.json())
                .then(data => {
                    this.cities = data;
                    console.log(data);
                })
                .catch(error => {
                    alert("Failed to load city data.");
                });
        },
        fetchAreas() {//過濾出選取縣市的行政區List
            if (this.selectedCity !== '' && this.cities[this.selectedCity]) {
                this.areas = this.cities[this.selectedCity].AreaList;
            } else {
                this.areas = [];
            }
        },


    },
    mounted() {
        this.setPage(2);
        console.log(this.loginObj);
        this.fetchCities();
    }
}
</script>

<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <div class="bigArea">
        <div class="title">
            <h1>新增房間資訊</h1>
        </div>
        <div class="create-room">
            <form @submit.prevent="addRoomToDB">
                <div class="addressD">
                    <label for="address">地址&nbsp;:&nbsp;</label>
                    <select v-model="selectedCity" @change="fetchAreas">
                        <option value="">縣市</option>
                        <option v-for="(city, key) in cities" :key="key" :value="key">{{ city.CityName }}</option>
                    </select>&nbsp;
                    <select v-model="selectedArea">
                        <option value="">行政區</option>
                        <option v-for="(area, key) in areas " :key="key" :value="key">{{ area.AreaName }}</option>
                    </select>&nbsp;
                    <input type="text" id="streetName" class="inp" v-model="streetName" placeholder="街道地址">
                </div>
                <div class="floorD">
                    <label for="floor">樓層&nbsp;:&nbsp;</label>
                    <input type="text" id="floor" class="inp" v-model="floor">
                </div>
                <div class="rIdD">
                    <label for="rId">房號&nbsp;:&nbsp;</label>
                    <input type="text" id="rId" class="inp" v-model="rId">
                </div>
                <div class="rentPD">
                    <label for="rentP">租金&nbsp;:&nbsp;</label>
                    <input type="text" id="rentP" class="inp" v-model="rentP" >&nbsp;元/月
                </div>
                <div class="depositD">
                    <label for="deposit">押金&nbsp;:&nbsp;</label>
                    <input type="text" id="deposit" class="inp" v-model="deposit" >&nbsp;元
                </div>
                <div class="cutPD">
                    <label for="cutP">違約金&nbsp;:&nbsp;</label>
                    <input type="text" id="cutP" class="inp" v-model="cutP" >
                </div>
                <div class="eletricPD">
                    <label for="eletricP">電費&nbsp;:&nbsp;</label>
                    <input type="text" id="eletricP" class="inp" v-model="eletricP" >&nbsp;元/度
                </div>
                <div class="waterPD">
                    <label for="waterP">水費&nbsp;:&nbsp;</label>
                    <input type="text" id="waterP" class="inp" v-model="waterP" >&nbsp;元/月
                </div>
                <div class="managePD">
                    <label for="manageP">管理費&nbsp;:&nbsp;</label>
                    <input type="text" id="manageP" class="inp" v-model="manageP" >&nbsp;元/月
                </div>
                <div class="acreageD">
                    <label for="acreage">坪數&nbsp;:&nbsp;</label>
                    <input type="text" id="acreage" class="inp" v-model="acreage" >&nbsp;坪
                </div>
                <div class="parkingD">
                    <label for="parking">車位&nbsp;:&nbsp;</label>
                    <input type="checkbox" id="parking" class="inp" v-model="parking">
                </div>
                <div class="equipD">
                    <label for="equip">物件備註&nbsp;:&nbsp;</label><br>
                    <textarea class="equip inp" id="equip" style="resize: none; width: 80%; height: 100px;"
                        v-model="equip"></textarea>
                </div>
                <div class="rOtherD">
                    <label for="rOther">屋況&nbsp;:&nbsp;</label><br>
                    <textarea class="rOther inp" id="rOther" style="resize: none; width: 80%; height: 100px;"
                        v-model="rOther"></textarea>
                </div>
                <div class="photoD">
                    <label for="">圖片&nbsp;:&nbsp;</label>
                    <input type="file" id="photo" @change="handleFileUpload">
                </div>
                <button type="submit" class="addBtn">確定新增</button>
            </form>
        </div>



    </div>
</template>

<style scoped lang="scss">
.bigArea {
    width: 80%;
    padding: 1%;
    margin-left: -6%;
    margin-top: 2%;
}

.create-room{
    width: 100%;
    height: 80dvh;
    padding: 2%;
    position: relative;
}

.addressD{
    position: absolute;
    top: 15px;
    left: 30px;
    width: 100%;
}

.floorD{
    position: absolute;
    top: 15px;
    left: 490px;
    width: 25%;
}

.rIdD{
    position: absolute;
    top: 15px;
    left: 780px;
    width: 25%;
}

.rentPD{
    position: absolute;
    top: 60px;
    left: 30px;
    width: 30%;
}

.depositD{
    position: absolute;
    top: 60px;
    left: 395px;
    width: 25%;
}

.cutPD{
    position: absolute;
    top: 60px;
    left: 725px;
    width: 25%;
}

.eletricPD{
    position: absolute;
    top: 105px;
    left: 30px;
    width: 30%;
}

.waterPD{
    position: absolute;
    top: 105px;
    left: 395px;
    width: 30%;
}

.managePD{
    position: absolute;
    top: 105px;
    left: 725px;
    width: 30%;
}

.acreageD{
    position: absolute;
    top: 150px;
    left: 30px;
    width: 25%;
}

.parkingD{
    position: absolute;
    top: 150px;
    left: 395px;
    width: 25%;
}

.equipD{
    position: absolute;
    top: 195px;
    left: 30px;
    width: 80%;
}

.rOtherD{
    position: absolute;
    top: 335px;
    left: 30px;
    width: 80%;
}

.photoD{
    position: absolute;
    top: 475px;
    left: 30px;
    width: 25%;
}

.addBtn{
    position: absolute;
    top: 505px;
    right: 12%;
    width: 10%;
    height: 35px;
    font-size: large;
    background-color: rgb(255 141 61);
    color: white;
    border-radius: 5px; //四個角的弧度
    border: solid 2px rgba(247, 145, 86, 0.712);
    cursor: pointer;
}

.addBtn:active {
    transform: scale(0.95);
}

label{
    font-size: large;
}

.inp {
    padding: 3px;
    background-color: white;
    border-radius: 5px; //四個角的弧度
    border: solid 2px rgba(247, 145, 86, 0.712);
}

select{
    background-color: white;
    border-radius: 5px; //四個角的弧度
    font-size: large;
    border: solid 2px rgba(247, 145, 86, 0.712);
}

.roomDetailDiv {
    width: 80%;
    height: 60%;
    display: flex;
}

</style>