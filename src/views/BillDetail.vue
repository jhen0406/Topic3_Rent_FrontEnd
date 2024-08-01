<script>
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import jsPDF from 'jspdf'; // 導入 jsPDF 庫
import 'jspdf-autotable';
import { fontBase64 } from '@/assets/fonts/noto-sans-cjk.js'; // 根據實際路徑調整，fontBase64這個要去新增一個資料夾，資料夾裡面放轉檔的64位元資料以及google font下載下來的ttf檔案
import JsBarcode from 'jsbarcode';//條碼的產生
export default {
  data() {
    return {
      cutDateBill:{},
    };
  },
  computed: {
    ...mapState(dataStore, ["billObj","loginObj"]),
  },
  methods: {
    ...mapActions(dataStore, [""]),
    findCutDate(){  // 篩出對應帳單的契約 => 先抓到全部租約，再一層一層篩
      this.findRoomData();
      let empty = {};
      fetch("http://localhost:8080/contract/contratSearch", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(empty),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.cutDateBill = data.contractList.filter(
            (item) => (item.ownerName === this.loginObj.ownerName) && (item.tenantIdentity === this.billObj.tenantIdentity) && (item.address === this.billObj.address)
          );
          console.log("篩出此筆帳單的租約",this.cutDateBill);
          // this.setBillToContract(this.cutDateBill);
        });
    },
    findRoomData(){
      let empty = {};
      fetch("http://localhost:8080/contract/contratSearch", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(empty),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('全部房東的房間',data);

    })
  },
  generatePDF() {
      const doc = new jsPDF();

      // 添加字型
      doc.addFileToVFS('NotoSerifTC-VariableFont_wght.ttf', fontBase64);
      doc.addFont('NotoSerifTC-VariableFont_wght.ttf', 'NotoSerifTC', 'normal');
      doc.setFont('NotoSerifTC');

      // 添加標題
      doc.setFontSize(26);
      doc.text('繳費帳單', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

      doc.setFontSize(10);
      doc.text(`計費期間 :  ${this.billObj.periodStart} ~ ${this.billObj.periodEnd}`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

      // 添加資料
      doc.setFontSize(12);
      doc.text(`租賃房間地址: ${this.billObj.address}`, 10, 40);
      doc.text(`承租人姓名: ${this.billObj.tenantName}`, 10, 50);

      // 添加表格
      const columns = ["項目", "費用計算", "金額"];
      const rows = [
        ["租金", "依租賃契約規定辦理", `${this.billObj.rentP}`],
        ["管理費", "依租賃契約規定辦理", `${this.billObj.manageOneP}`],
        ["水費", "依租賃契約規定辦理", `${this.billObj.waterOneP}`],
        ["電費", `每度電費 : ${this.billObj.eletricP} 元/度\n用電量 : ${this.billObj.eletricV}\n總電費為 (用電量 x 每度電電費) : ${this.billObj.eletricOneP}`, `${this.billObj.eletricOneP}`],
        ["違約金", "依租賃契約規定辦理", `${this.billObj.cutP}`],
        ["應繳金額", "", `${this.billObj.totalOneP}`]
      ];

      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 70,
        theme: 'grid',
        headStyles: { font: 'NotoSerifTC' },
        bodyStyles: { font: 'NotoSerifTC' },
      });

       // 繳費帳號
      doc.text(`繳費帳號: ${this.loginObj.accountBank}`, 10, doc.autoTable.previous.finalY + 20);

      // 使用銀行帳號生成條碼
      const barcodeData = this.loginObj.accountBank;

      // 創建條碼
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, barcodeData, { format: "CODE128" });
      const barcodeImage = canvas.toDataURL("image/png");

      // 添加條碼
      doc.addImage(barcodeImage, 'PNG', 10, doc.autoTable.previous.finalY + 30, 100, 30);

      // 下載 PDF
      doc.save('繳費帳單.pdf');
    },
  mounted() {
    console.log('此筆帳單',this.billObj);
    
  },
  Created(){
    this.findCutDate();
  }
}
};
</script>

<template>
  <div class="bigArea">
    <div class="title">
      <span class="billTitle">帳單明細</span>
      <span class="period" style="left: 32%;">計費期間：{{ this.billObj.periodStart}} ~ {{ this.billObj.periodEnd }}</span>
      <span class="period" style="left: 66%;">繳費截止日：{{ this.billObj.paymentDate }}</span>
    </div>
      <div class="tenantArea">
       <span class="personal" style="top: 10%;left: 5%;font-weight: 500;">承租人資訊</span>
       <span class="personal" style="top: 35%;left: 7%;">姓名：{{ this.billObj.tenantName }}</span>
       <!-- <span class="personal" style="top: 35%;left: 28%;">電話：{{ this.billObj. }}</span> -->
       <span class="personal" style="top: 35%;right: 31%;">身分證字號：{{ this.billObj.tenantIdentity }}</span>
       <span class="personal" style="bottom: 18%;left: 7%;">租賃物件地址：{{ this.billObj.address }}</span>
    </div>
    <div class="detailArea">
      <table class="detail">
        <thead>
          <tr style="border: none;">
          <th scope="col" class="thead" style="width: 17%;">項目</th>
          <th scope="col" class="thead">費用計算</th>
          <th scope="col" class="thead">金額</th>
        </tr>
        </thead>
        <tbody>
          <tr class="content">
            <td scope="row">租金</td>
            <td style="text-align: justify;padding-left: 76px;">依租賃契約規定辦理</td>
            <td>{{this.billObj.rentP}}</td>
          </tr>
          <tr class="content">
            <td scope="row">管理費</td>
            <td style="text-align: justify;padding-left: 76px;">依租賃契約規定辦理</td>
            <td>{{this.billObj.manageOneP}}</td>
          </tr>
          <tr class="content">
            <td scope="row">水費</td>
            <td style="text-align: justify;padding-left: 76px;">依租賃契約規定辦理</td>
            <td>{{ this.billObj.waterOneP }}</td>
          </tr>
          <tr class="content" style="border-bottom: 2px solid black;padding-left: 76px;">
            <td scope="row">電費</td>
            <td style="text-align: justify;padding-left: 76px;">每度電費：{{this.billObj.eletricP}} 元/度 <br>
                用電量：{{this.billObj.eletricV}} 度 <br>
                總電費 = 每度電費 x 用電量 <br>
                &emsp;&emsp;&emsp;&nbsp;= {{ this.billObj.eletricP }} x {{this.billObj.eletricV}} <br>
                &emsp;&emsp;&emsp;&nbsp;= {{ this.billObj.eletricOneP }}</td>
            <td>{{ this.billObj.eletricOneP }}</td>
          </tr>
          <tr class="content"style="border-bottom: 2px solid black;">
              <td scope="row" >違約金</td>
              <td style="text-align: justify;padding-left: 76px;">依租賃契約規定辦理</td>
              <td v-if="this.cutDateBill.cutDate">{{ this.billObj.cutP }}</td>
              <td v-else>無</td>
            </tr>
          <tr class="content" >
            <td>應繳總金額</td>
            <td></td>
            <td>{{this.billObj.totalOneP}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <button class="back"><RouterLink to="/lookupbill" style="text-decoration: none;background-color: transparent;color: white;">返回列表</RouterLink></button>
    <button class="copy" @click="generatePDF()">列印帳單</button>
  </div>
</template>

<style scoped lang="scss">
.bigArea {
  width: 80%;
  height: 100%;
  margin-bottom: 53px;
  position: relative;
  // margin-left: 23%;
  margin-top: 1%;
  .back{
    position: absolute;
    bottom: -3%;
    right: 25%;
    border: none;
    background-color: #f0974f;
    width: 8%;
    height: 5%;
    border-radius: 5px;
    &:hover{
      cursor: pointer;
      background-color: #F0C49F;
    }
  }
  .copy{
    position: absolute;
    bottom: -3%;
    right: 13%;
    border: none;
    background-color: #f54545;
    color: white;
    width: 8%;
    height: 5%;
    border-radius: 5px;
    &:hover{
      cursor: pointer;
      background-color: #ef9a95;
    }
  }
}
.title {
  width: 95%;
  height: 64px;
  margin: 3% 0;
  display: flex;
  position: relative;
  margin-bottom: 1%;
  .billTitle {
    font-size: 2.3em;
    font-weight: 500;
    letter-spacing: 5px;
  }
  .period{
    position: absolute;
    top: 50%;
    background-color: transparent;
    letter-spacing: 1px;
  }
  
  .searchItem {
    margin: 16px auto;
    border: 2px solid  ;
    border-radius: 23px;
    height: 40px;
  }
 
}
.tenantArea {
    display: flex;
    width: 91%;
    height: 139px;
    background-color: #e5e3e39c;
    border-radius: 33px;
    position: relative;
  .personal{
    background-color: transparent;
    position: absolute;
  }
  }
  .detailArea{
    margin-left: -4%;
  }
  table{
    caption-side: bottom;
    border-collapse: collapse;
    width: 88%;
    height: 67dvh;
    margin: 5% 4%;
    border-bottom: 2px solid black;
  }
  tr{
    height: 40px;
    font-size: 1.2em;
    border-bottom: 1px solid black;
  }
  td{
    padding: 15px;
  }
  .thead{
    background-color:#FFC89A;
    font-weight: 500;
    text-align: center;
    width: 25%;
  }
  tbody{
    text-align: center;
  }
</style>
