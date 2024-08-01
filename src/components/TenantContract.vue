<script>
import { RouterLink } from "vue-router";
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import contractModal from "./contractModal.vue";
import jsPDF from 'jspdf'; // 導入 jsPDF 庫
import 'jspdf-autotable';
import { fontBase64 } from '@/assets/fonts/noto-sans-cjk.js'; // 根據實際路徑調整，fontBase64這個要去新增一個資料夾，資料夾裡面放轉檔的64位元資料以及google font下載下來的ttf檔案
export default {
  data() {
    return {
      contractList: [],
      billList: [],
      contractModal: false,
    };
  },
  props: ["showNextPage"],
  components: {
    RouterLink,
    contractModal,
  },
  computed: {
    ...mapState(dataStore, ["tenantData", "tenantContract"]),
  },
  methods: {
    ...mapActions(dataStore, ["setTenantContract"]),
    test() {
      console.log("租約頁面上的tenantData", this.tenantData);
      this.contractList = this.tenantData.contractList;
      this.billList = this.tenantData.billList;
    },
    bringToDetail(index) {
      // 偵測到選的帳單並存到pinia
      this.setTenantContract(this.contractList[index]);
      console.log("選的契約", this.tenantContract);
      index = "";
    },
    showContract() {
      // 繳費方式彈跳視窗的開關
      this.contractModal = !this.contractModal;
    },
    //將日期顯示為特定格式
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    goToPre() {
      this.$emit("next", "B");
    },
    generatePDF() {
      const doc = new jsPDF();
      const parkingText = this.tenantContract.parking ? '有' : '無';

      if (!fontBase64) {
    console.error("fontBase64 is not defined");
    return;
  }
      // 添加字型
      doc.addFileToVFS('NotoSerifTC-VariableFont_wght.ttf', fontBase64);
      doc.addFont('NotoSerifTC-VariableFont_wght.ttf', 'NotoSerifTC', 'normal');
      doc.addFont('NotoSerifTC-VariableFont_wght.ttf', 'NotoSerifTC', 'bold');
      doc.setFont('NotoSerifTC-VariableFont_wght.ttf');

      // 添加標題
      doc.setFontSize(26);
      doc.setFont('NotoSerifTC','bold');
      doc.text('租賃契約書', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

      // doc.setFontSize(12);
      // doc.text(`契約期間 :  ${this.contractList.periodStart} ~ ${this.contractList.periodEnd}`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('NotoSerifTC','normal');
      doc.text(`立契約書人，承租人${this.tenantContract.tenantName}，出租人${this.tenantContract.ownerName}茲為住宅租賃事宜，雙方同意本契約條款如下：`,10,30)
      // 添加資料
      doc.setFontSize(12);
      doc.setFont('NotoSerifTC','bold');
      doc.text(`一、租賃標的`, 10, 40);

      doc.setFontSize(10);
      doc.setFont('NotoSerifTC','normal');
      doc.text(`（一）地址：${this.tenantContract.address}，樓層：${this.tenantContract.floor}，房號：${this.tenantContract.roomId}`, 20, 50);
      doc.text(`（二）持分面積：${this.tenantContract.acreage}`, 20, 55);
      doc.text(`（二）車位：${parkingText}`, 20, 60);

      doc.setFontSize(12);
      doc.setFont('NotoSerifTC','bold');
      doc.text(`二、租賃期間`, 10, 70);

      doc.setFontSize(10);
      doc.setFont('NotoSerifTC','normal');
      doc.text(`租賃期間自${this.tenantContract.startDate}起至${this.tenantContract.endDate}止。`, 20, 80);
      
      doc.setFontSize(12);
      doc.setFont('NotoSerifTC','bold');
      doc.text(`三、租金約定及支付`, 10, 90);

      doc.setFontSize(10);
      doc.setFont('NotoSerifTC','normal');
      doc.text(`承租人每月租金為新臺幣(下同)${this.tenantContract.rentP}元整，並於計費期間後十天內支付，不得藉任何理由拖延或拒絕；\n出租人於租賃期間亦不得藉任何理由要求調漲租金。 `, 20, 100);

      doc.setFontSize(12);
      doc.setFont('NotoSerifTC','bold');
      doc.text(`四、押金約定及返還`, 10, 120);

      doc.setFontSize(10);
      doc.setFont('NotoSerifTC','normal');
      doc.text(`押金由租賃雙方約定為金額${this.tenantContract.deposit}元整。承租人應於簽訂本契約之同時給付出租人。 `, 20, 130);

      doc.setFontSize(12);
      doc.setFont('NotoSerifTC','bold');
      doc.text(`五、租賃期間相關費用之約定`, 10, 140);

      doc.setFontSize(10);
      doc.setFont('NotoSerifTC','normal');
      doc.text(`租賃期間，使用租賃住宅所生之相關費用，依下列約定辦理：`, 20, 150);
      doc.text(`（一）管理費：每月${this.tenantContract.manageP}元整。`, 20, 155);
      doc.text(`（二）水費：每月${this.tenantContract.waterP}元整。`, 20, 160);
      doc.text(`（二）電費：每度${this.tenantContract.eletricP}元，每月抄表，依每月用電量計算。`, 20, 165);

      doc.setFontSize(12);
      doc.setFont('NotoSerifTC','bold');
      doc.text(`六、提前終止租約 `, 10, 170);

      doc.setFontSize(10);
      doc.setFont('NotoSerifTC','normal');
      doc.text(`如有提前終止租約情事，依下列約定辦理：`, 20, 180);
      doc.text(`（一）本契約於期限屆滿前，除不可避免之情形得提前終止租約外，租賃雙方不得任意終止租約。 `, 20, 185);
      doc.text(`（二）違約金：${this.tenantContract.cutP}元整。`, 20, 190);
     
      doc.setFontSize(12);
      doc.setFont('NotoSerifTC','bold');
      doc.text(`立契約書人 `, 10, 195);

      doc.setFontSize(10);
      doc.setFont('NotoSerifTC','normal');
      doc.text(`出租人 `, 10, 205);
      doc.text(`姓名：${this.tenantContract.ownerName} `, 10, 210);
      doc.text(`統一編號（身分證字號）：${this.tenantContract.ownerIdentity} `, 10, 215);
      doc.text(`戶籍地址(營業登記地址)： ${this.tenantContract.ownerHomeAddress} `, 10, 220);
      doc.text(`通訊地址： ${this.tenantContract.ownerContactAddress} `, 10, 225);
     
      doc.text(`承租人 `, 10, 235);
      doc.text(`姓名：${this.tenantContract.tenantName} `, 10, 240);
      doc.text(`統一編號（身分證字號）：${this.tenantContract.tenantIdentity} `, 10, 245);
      doc.text(`戶籍地址(營業登記地址)： ${this.tenantContract.tenantHomeAddress} `, 10, 250);
      doc.text(`通訊地址： ${this.tenantContract.tenantContactAddress} `, 10, 255);
      doc.text(`連絡電話： ${this.tenantContract.tenantPhone} `, 10, 260);
     
      doc.setFontSize(12);
      doc.setFont('NotoSerifTC','bold');
      doc.text(`立約日期： ${this.tenantContract.signDate}`, 10, 270);

      // 下載 PDF
      doc.save('租賃契約書.pdf');
    }
  },
  created() {
    this.test();
  },
};
</script>

<template>
  <!-- <div class="middleArea"> -->
  <div class="contractArea" v-if="!showNextPage">
    <span class="title">您的所有租約</span>
    <div class="line"></div>
  <div class="allContract">
  <div class="cardArea" v-for="(item, index) in this.contractList" :key="index">
    <div class="card">
      <div class="card-header">
        出租人：{{ item.ownerName }}
      </div>
      <div class="card-body">
        <h5 class="card-title">租賃物件地址</h5>
        <p class="card-text">{{ item.address }}</p>
        <h5 class="card-text">契約期間</h5>
        <p class="card-text">{{ item.startDate }} &nbsp;至&nbsp;{{ item.endDate }}</p>
        <p class="card-text">租金：{{ item.rentP }}</p>
        <div class="" style="display: flex;justify-content: space-between;
    width: 100%;background-color: transparent;">
        <button
          class="btn btn-primary"
          @click="
            this.bringToDetail(index);
            this.showContract();
            // $emit('goToNextPage', true);
          ">
          查看詳情
        </button>
        <button
          class="btn btn-primary"
          @click="
            this.bringToDetail(index);
            this.goToPre();
          ">
          查看帳單
        </button>
      </div>
      </div>
    </div>
  </div>
</div>
  
  </div>
  <div class="contractDetail" v-else>
  </div>


  <contractModal v-if="this.contractModal" @alertModal="this.showContract()">
    <template v-slot:header >
      <div class="headerArea" style="position: fixed;">
        <span style="font-size: 0.8em; margin-left: 50px">租賃契約書</span>
      </div>
    </template>
    <template v-slot:content>
      <div class="contentArea" id="style-3">
      <div class="roomInfo">
        <span>地址：{{this.tenantContract.address}}</span><br>
        <span>樓層：{{this.tenantContract.floor}}</span> &ensp;&ensp;
        <span>房號：{{this.tenantContract.roomId}}</span><br>
        <span>租金/月：{{this.tenantContract.rentP}}&nbsp;元</span>&ensp;&ensp;
        <span>押金：{{ this.tenantContract.deposit }}&nbsp;元</span><br>
        <span>水費/月：{{this.tenantContract.waterP}}&nbsp;元</span> &ensp;&ensp;
        <span>管理費/月：{{this.tenantContract.manageP}}&nbsp;元</span> &ensp;&ensp;
        <span>電費/月：{{this.tenantContract.eletricP}}&nbsp;元&nbsp;/&nbsp;度</span><br>
        <span>面積：{{ this.tenantContract.acreage }}&nbsp;坪</span>&ensp;&ensp;
        <span v-if="this.tenantContract.parking" >車位 : 有</span>
        <span v-else>車位 : 無</span><br>
        <span>設備：{{ this.tenantContract.equip }}</span><br>
        <span>屋況：{{this.tenantContract.rCondition}}</span><br>
        <span v-if="this.tenantContract.rOther" >物件備註 : {{ this.tenantContract.rOther }}</span>
        <span v-else>物件備註 : 無</span><br>
      </div>
      <div class="line1"></div>
      <div class="contractDetail">
        <span style="font-weight: 600;font-size: 25px;">出租人</span><br>
        <span>姓名：{{ this.tenantContract.ownerName }}</span><br>
        <span>身分證字號：{{ this.tenantContract.ownerIdentity }}</span><br>
        <span>戶籍地址：{{ this.tenantContract.ownerHomeAddress }}</span><br>
        <span>通訊地址：{{ this.tenantContract.ownerContactAddress }}</span><br>
        <span>連絡電話：{{ this.tenantContract.ownerPhone }}</span><br>
        <div class="line1"></div>
        <span style="font-weight: 600;font-size: 25px;">承租人</span><br>
        <span>姓名：{{ this.tenantContract.tenantName }}</span><br>
        <span>身分證字號：{{ this.tenantContract.tenantIdentity }}</span><br>
        <span>戶籍地址(營業登記地址)：{{ this.tenantContract.tenantHomeAddress }}</span><br>
        <span>通訊地址：{{ this.tenantContract.tenantContactAddress }}</span><br>
        <span>email：{{ this.tenantContract.tenantEmail }}</span><br>
        <!-- <span>連絡電話：{{ this.tenantContract.tenantPhone }}</span><br> -->
        <div class="line1"></div>
        <span style="font-weight: 600;font-size: 25px;">契約中止</span><br>
        <span>中止原因：{{ this.tenantContract.cutReason }}</span><br>
        <span>違約金：{{ this.tenantContract.cutP }}</span><br>
        <span>中止日期：{{ this.tenantContract.cutDate }}</span><br>
        <span>其他備註(或個別磋商條款)：{{ this.tenantContract.cOther }}</span><br>
        <span>立約日期：{{ formatDate(this.tenantContract.signDate) }}</span><br>
      </div>
    </div>
  </template>
  <template v-slot:footer>
    <div class="footerArea">
        <button class="copy" @click="this.generatePDF()">列印</button>
      </div>
    </template>
  </contractModal>
</template>

<style scoped lang="scss">

span {
  background-color: transparent;
}
.box {
  width: 30%;
  height: 20%;
  border-radius: 16px;
  background-color: bisque;
  // margin-top: 51px;
}
.title {
  background-color: transparent;
  font-size: 2em;
  position: absolute;
  top: 20%;
  left: 10%;
}
.contractArea {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  margin-top: 257px;
  width: 100%;
  justify-content: space-around;
  margin-left: -31%;
}
.card-body {
  background-color: #ffebda;
  position: relative;
  height: 95px;
}
.detail {
  border: none;
  width: 85px;
  height: 34px;
  background: burlywood;
  left: 10;
  margin-right: 7px;
  position: absolute;
  right: 10px;
  bottom: 10px;
  &:hover {
    background: rgb(230, 210, 184);
  }
}
.line {
  width: 90%;
  border-top: 1px solid black;
  position: absolute;
  top: 190px;
  left: 73px;
}
.headerArea {
  width: 60%;
  height: 50px;
  background-color: #ffb67b;
}
.contentArea{
  height: 365px;
  // padding-top: 40px;
  overflow: auto;
  margin-right: 10px;
  margin-top: 67px;
}
.roomInfo {
  width: 90%;
  font-size: 20px;
  margin-left: 49px;
  // margin-top: 23px;
  letter-spacing: 1px;
  span {
    margin-bottom: -28px;
  }
}
.contractDetail{
  width: 90%;
  height: 80%;
font-size: 20px;
margin-left: 49px;
  margin-top: 13px;
  span{
    background-color: transparent;
  }
  .line1{
    margin-bottom: 10px;
    width: 95%;
    margin-left: 5px;
  }
}
.copy{
  width: 61px;
  height: 34px;
  margin-left: 500px;
  border: none;
  border-radius: 10px;
  background-color: #ffb67b;
  color: white;
  font-size: 19px;
  position: absolute;
    bottom: 20px;
    right: 77px;
  &:hover{
    background-color: #ffc89a;
  }
}
//捲軸底色
#style-3::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f9ddc6;
  border-radius: 20px;
}
//捲軸寬度
#style-3::-webkit-scrollbar {
  width: 8px;
  background-color: transparent;
}
//捲軸本體顏色
#style-3::-webkit-scrollbar-thumb {
  background-color: #ff9b5cc2;
  border-radius: 20px;
}
.line1 {
  width: 90%;
  border-bottom: 1px solid black;
  margin-top: 9px;
  margin-left: 43px;
}
.allContract {
  display: flex;
  flex-wrap: wrap; 
  justify-content: center;
  gap: 75px; // 卡片間距
  padding: 20px;
  margin-top: -50px;
}

.cardArea {
  flex: 1 1 calc(33.333% - 40px); /* 每个卡片占据父容器的 1/3 减去间距 */
  max-width: 300px;
  box-sizing: border-box;
}
.footerArea{
  height: 55px;
}
.card {
  width: 118%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  height: 205%;
  h5{
    background-color: transparent;
  }
  p{
    background-color: transparent;
  }
}

.card-header {
  background-color: #ffc89a;
    color: #842029;
    padding: 10px;
    text-align: center;
    font-weight: 600;
    font-size: 1.2em;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start
}

.card-title {
  margin-bottom: 10px;
  font-size: 1.25rem;
  text-align: center; 
}

.card-text {
  margin-bottom: 10px;
  text-align: center; 
}

.btn-primary {
  margin-top: 10px;
  background: #ff8b2bd6;
  border: none;
  &:hover{
    background-color: #fdb880d6;
  }
}

</style>