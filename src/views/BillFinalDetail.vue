<script>
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios"; // 用於加載模板文件
import jsPDF from 'jspdf'; // 導入 jsPDF 庫
import 'jspdf-autotable';
import { fontBase64 } from '@/assets/fonts/noto-sans-cjk.js'; // 根據實際路徑調整，fontBase64這個要去新增一個資料夾，資料夾裡面放轉檔的64位元資料以及google font下載下來的ttf檔案
import JsBarcode from 'jsbarcode';//條碼的產生

export default {
  data() {
    return {
      ownerName: "",
      tenantName: "",
    };
  },
  computed: {
    ...mapState(dataStore, ["finalBill", "billToContract", "loginObj",]),
  },
  methods: {
    ...mapActions(dataStore, ["setBillToContract"]),
    sendEmail() { // 寄信功能
      var templateParams = {
        tenantName: this.finalBill.tenantName,
        tenantAddress:this.finalBill.address,
        rentP:this.finalBill.rentP,
        manageP:this.finalBill.manageOneP,
        waterP:this.finalBill.waterOneP,
        electricP:this.finalBill.eletricP,
        electricV:this.finalBill.eletricV,
        electricOneP:this.finalBill.eletricOneP,
        cutP:this.finalBill.cutP,
        totalOneP:this.finalBill.totalOneP,
        bankAccount:this.loginObj.accountBank,
        periodStart: this.finalBill.periodStart,
        periodEnd: this.finalBill.periodEnd,
        paymentDate: this.finalBill.paymentDate,
        ownerName: this.finalBill.ownerName,
        tenantEmail: this.billToContract[0].tenantEmail,
        // tenantEmail: "lighters0406@gmail.com",
        ownerEmail: this.loginObj.ownerEmail,
      };
      emailjs.send("service_azp4v8s", "template_h9952ii", templateParams).then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
          Swal.fire({
          title: "寄信成功",
          icon: "success",
        });
        },
        function (error) {
          console.log("FAILED...", error);
          Swal.fire({
          title: "好像發生了一點錯誤...",
          icon: "error",
        });
        }
      );
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
      doc.text(`計費期間 :  ${this.finalBill.periodStart} ~ ${this.finalBill.periodEnd}`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

      // 添加資料
      doc.setFontSize(12);
      doc.text(`承租房間地址: ${this.finalBill.address}`, 10, 40);
      doc.text(`租客姓名: ${this.finalBill.tenantName}`, 10, 50);
      doc.text(`租客電話: ${this.billToContract[0].tenantPhone}`, 10, 60);

      // 添加表格
      const columns = ["項目", "費用計算", "金額"];
      const rows = [
        ["租金", "依租賃契約規定辦理", `${this.finalBill.rentP}`],
        ["管理費", "依租賃契約規定辦理", `${this.finalBill.manageOneP}`],
        ["水費", "依租賃契約規定辦理", `${this.finalBill.waterOneP}`],
        ["電費", `每度電費 : ${this.finalBill.eletricP} 元/度\n用電量 : ${this.finalBill.eletricV}\n總電費為 (用電量 x 每度電電費) : ${this.finalBill.eletricOneP}`, `${this.finalBill.eletricOneP}`],
        ["違約金", "依租賃契約規定辦理", `${this.finalBill.cutP}`],
        ["應繳金額", "", `${this.finalBill.totalOneP}`]
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
    }
  },
  mounted() {
    emailjs.init("l4QPcOaCIqMDx_T_L");
    console.log("選的契約",this.billToContract);
    console.log("perBill",this.per)
  },
};
</script>

<template>
  <div class="bigArea">
    <div class="title">
      <span class="billTitle">帳單明細</span>
      <span class="period" style="left: 32%"
        >計費期間：{{ this.finalBill.periodStart }} ~
        {{ this.finalBill.periodEnd }}</span
      >
      <span class="period" style="left: 66%"
        >繳費截止日：{{ this.finalBill.paymentDate }}</span
      >
    </div>
    <div class="tenantArea">
      <span class="personal" style="top: 10%; left: 5%; font-weight: 500"
        >承租人資訊</span
      >
      <span class="personal" style="top: 35%; left: 7%"
        >姓名：{{ this.finalBill.tenantName }}</span
      >
      <!-- <span class="personal" style="top: 35%;left: 28%;">電話：{{ this.billObj. }}</span> -->
      <span class="personal" style="top: 35%; right: 31%"
        >身分證字號：{{ this.finalBill.tenantIdentity }}</span
      >
      <span class="personal" style="bottom: 18%; left: 7%"
        >租賃物件地址：{{ this.finalBill.address }}</span
      >
    </div>
    <div class="detailArea">
      <table class="detail">
        <thead>
          <tr style="border: none">
            <th scope="col" class="thead" style="width: 17%">項目</th>
            <th scope="col" class="thead">費用計算</th>
            <th scope="col" class="thead">金額</th>
          </tr>
        </thead>
        <tbody>
          <tr class="content">
            <td scope="row">租金</td>
            <td style="text-align: justify; padding-left: 76px">
              依租賃契約規定辦理
            </td>
            <td>{{ this.finalBill.rentP }}</td>
          </tr>
          <tr class="content">
            <td scope="row">管理費</td>
            <td style="text-align: justify; padding-left: 76px">
              依租賃契約規定辦理
            </td>
            <td>{{ this.finalBill.manageOneP }}</td>
          </tr>
          <tr class="content">
            <td scope="row">水費</td>
            <td style="text-align: justify; padding-left: 76px">
              依租賃契約規定辦理
            </td>
            <td>{{ this.finalBill.waterOneP }}</td>
          </tr>
          <tr class="content" style="padding-left: 76px">
            <td scope="row">電費</td>
            <td style="text-align: justify; padding-left: 76px">
              每度電費：{{ this.finalBill.eletricP }} 元/度 <br />
              用電量：{{ this.finalBill.eletricV }} 度 <br />
              總電費 = 每度電費 x 用電量 <br />
              &emsp;&emsp;&emsp;&nbsp;= {{ this.finalBill.eletricP }} x
              {{ this.finalBill.eletricV }} <br />
              &emsp;&emsp;&emsp;&nbsp;= {{ this.finalBill.eletricOneP }}
            </td>
            <td>{{ this.finalBill.eletricOneP }}</td>
          </tr>
          <tr class="content" style="border-bottom: 2px solid black">
            <td scope="row">違約金</td>
            <td style="text-align: justify; padding-left: 76px">
              依租賃契約規定辦理
            </td>
            <td v-if="this.finalBill.cutP === 0">無</td>
            <td v-else style="text-align: justify;padding-left: 95px;">
              {{ this.finalBill.cutP }} <br>違約日期：{{
                this.billToContract[0].cutDate
              }}<br>違約理由：{{ this.billToContract[0].cutReason }}
            </td>
          </tr>
          <tr class="content">
            <td>應繳總金額</td>
            <td></td>
            <td>{{ this.finalBill.totalOneP }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <button class="back">
      <RouterLink
        to="/generatebill"
        style="
          text-decoration: none;
          background-color: transparent;
          color: white;
        "
        >返回列表</RouterLink
      >
    </button>
    <button class="email inform" style="right: 13%" @click="sendEmail()">
      寄信通知
    </button>
    <button
      class="copy inform"
      style="right: 25%"
      @click="generatePDF()"
      title="點此即下載繳費單"
    >
      列印帳單
    </button>
  </div>
</template>

<style scoped lang="scss">
.bigArea {
  width: 80%;
  height: 100%;
  margin-bottom: 53px;
  position: relative;
  // margin-left: 339px;
  margin-top: 1%;
  .back {
    position: absolute;
    bottom: -3%;
    right: 37%;
    border: none;
    background-color: #f0974f;
    width: 8%;
    height: 5%;
    border-radius: 5px;
    &:hover {
      cursor: pointer;
      background-color: #f0c49f;
    }
    &:active {
      background-color: #f0974f;
    }
  }
  .inform {
    position: absolute;
    bottom: -3%;
    border: none;
    color: white;
    width: 8%;
    height: 5%;
    border-radius: 5px;
    &:hover {
      cursor: pointer;
    }
  }
  .email {
    background-color: #f54545;
    &:hover {
      background-color: #ef9a95;
    }
    &:active {
      background-color: #f54545;
    }
  }
  .copy {
    background-color: #8da8d3;
    &:hover {
      background-color: #bfc9d9;
    }
    &:active {
      background-color: #8da8d3;
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
  .period {
    position: absolute;
    top: 50%;
    background-color: transparent;
    letter-spacing: 1px;
  }

  .searchItem {
    margin: 16px auto;
    border: 2px solid;
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
  .personal {
    background-color: transparent;
    position: absolute;
  }
}
.detailArea {
  margin-left: -4%;
}
table {
  caption-side: bottom;
  border-collapse: collapse;
  width: 88%;
  height: 67dvh;
  margin: 5% 4%;
  border-bottom: 2px solid black;
}
tr {
  height: 40px;
  font-size: 1.2em;
  border-bottom: 1px solid black;
}
td {
  padding: 15px;
}
.thead {
  background-color: #ffc89a;
  font-weight: 500;
  text-align: center;
  width: 25%;
}
tbody {
  text-align: center;
}
</style>