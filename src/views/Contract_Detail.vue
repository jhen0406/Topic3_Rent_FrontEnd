<script>
import dataStore from "@/stores/dataStore";
import { mapState } from "pinia";
import { RouterLink } from "vue-router";

import jsPDF from "jspdf"; // 導入 jsPDF 庫
import "jspdf-autotable";
import { fontBase64 } from "@/assets/fonts/noto-sans-cjk.js"; // 根據實際路徑調整，fontBase64這個要去新增一個資料夾，資料夾裡面放轉檔的64位元資料以及google font下載下來的ttf檔案

export default {
    data() {
        return {
            
            
        }
    },

    computed: {
        // 綁定 Pinia 狀態
        // 'oneContractObj' 在 pinia 檔裡的 state
        ...mapState(dataStore, ['oneContractObj','roomObj','loginObj'])
    },
    components: {
        RouterLink,
       
    },
    created(){
        console.log(this.roomObj);
 
    },
    mounted(){
    
    },
    methods:{
        //將日期顯示為特定格式
        formatDate(dateString) {
            const date = new Date(dateString);
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        },
        generatePDF() {
            const doc = new jsPDF();
            const parkingText = this.oneContractObj.parking ? "有" : "無";
            const formattedDate = this.formatDate(this.oneContractObj.signDate);

            if (!fontBase64) {
                console.error("fontBase64 is not defined");
                return;
            }
            // 添加字型
            doc.addFileToVFS("NotoSerifTC-VariableFont_wght.ttf", fontBase64);
            doc.addFont("NotoSerifTC-VariableFont_wght.ttf", "NotoSerifTC", "normal");
            doc.addFont("NotoSerifTC-VariableFont_wght.ttf", "NotoSerifTC", "bold");
            doc.setFont("NotoSerifTC-VariableFont_wght.ttf");

            // 添加標題
            doc.setFontSize(26);
            doc.setFont("NotoSerifTC", "bold");
            doc.text("租賃契約書", doc.internal.pageSize.getWidth() / 2, 20, {
                align: "center",
            });

            // doc.setFontSize(12);
            // doc.text(`契約期間 :  ${this.contractList.periodStart} ~ ${this.contractList.periodEnd}`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
            doc.setFontSize(10);
            doc.setFont("NotoSerifTC", "normal");
            doc.text(
                `立契約書人，承租人${this.oneContractObj.tenantName}，出租人${this.loginObj.ownerName}茲為住宅租賃事宜，雙方同意本契約條款如下：`,
                10,
                30
            );
            // 添加資料
            doc.setFontSize(12);
            doc.setFont("NotoSerifTC", "bold");
            doc.text(`一、租賃標的`, 10, 40);

            doc.setFontSize(10);
            doc.setFont("NotoSerifTC", "normal");
            doc.text(
                `（一）地址：${this.oneContractObj.address}，樓層：${this.oneContractObj.floor}，房號：${this.oneContractObj.roomId}`,
                20,
                45
            );
            doc.text(`（二）持分面積：${this.oneContractObj.acreage}`, 20, 50);
            doc.text(`（二）車位：${parkingText}`, 20, 55);

            doc.setFontSize(12);
            doc.setFont("NotoSerifTC", "bold");
            doc.text(`二、租賃期間`, 10, 65);

            doc.setFontSize(10);
            doc.setFont("NotoSerifTC", "normal");
            doc.text(
                `租賃期間自${this.oneContractObj.startDate}起至${this.oneContractObj.endDate}止。`,
                20,
                70
            );

            doc.setFontSize(12);
            doc.setFont("NotoSerifTC", "bold");
            doc.text(`三、租金約定及支付`, 10, 80);

            doc.setFontSize(10);
            doc.setFont("NotoSerifTC", "normal");
            doc.text(
                `承租人每月租金為新臺幣(下同)${this.oneContractObj.rentP}元整，並於計費期間後十天內支付，不得藉任何理由拖延或拒絕；\n出租人於租賃期間亦不得藉任何理由要求調漲租金。 `,
                20,
                85
            );

            doc.setFontSize(12);
            doc.setFont("NotoSerifTC", "bold");
            doc.text(`四、押金約定及返還`, 10, 100);

            doc.setFontSize(10);
            doc.setFont("NotoSerifTC", "normal");
            doc.text(
                `押金由租賃雙方約定為金額${this.oneContractObj.deposit}元整。承租人應於簽訂本契約之同時給付出租人。 `,
                20,
                105
            );

            doc.setFontSize(12);
            doc.setFont("NotoSerifTC", "bold");
            doc.text(`五、租賃期間相關費用之約定`, 10, 115);

            doc.setFontSize(10);
            doc.setFont("NotoSerifTC", "normal");
            doc.text(
                `租賃期間，使用租賃住宅所生之相關費用，依下列約定辦理：`,
                20,
                120
            );
            doc.text(
                `（一）管理費：每月${this.oneContractObj.manageP}元整。`,
                20,
                125
            );
            doc.text(`（二）水費：每月${this.oneContractObj.waterP}元整。`, 20, 130);
            doc.text(
                `（二）電費：每度${this.oneContractObj.eletricP}元，每月抄表，依每月用電量計算。`,
                20,
                135
            );

            doc.setFontSize(12);
            doc.setFont("NotoSerifTC", "bold");
            doc.text(`六、提前終止租約 `, 10, 145);

            doc.setFontSize(10);
            doc.setFont("NotoSerifTC", "normal");
            doc.text(`如有提前終止租約情事，依下列約定辦理：`, 20, 150);
            doc.text(
                `（一）本契約於期限屆滿前，除不可避免之情形得提前終止租約外，租賃雙方不得任意終止租約。 `,
                20,
                155
            );
            doc.text(`（二）違約金：${this.oneContractObj.cutP}元整。`, 20, 160);

            doc.setFontSize(12);
            doc.setFont("NotoSerifTC", "bold");
            doc.text(`立契約書人 `, 10, 170);

            doc.setFontSize(10);
            doc.setFont("NotoSerifTC", "normal");
            doc.text(`出租人 `, 10, 180);
            doc.text(`姓名：${this.oneContractObj.ownerName} `, 10, 185);
            doc.text(
                `統一編號（身分證字號）：${this.oneContractObj.ownerIdentity} `,
                10,
                190
            );
            doc.text(
                `戶籍地址(營業登記地址)： ${this.oneContractObj.ownerHomeAddress} `,
                10,
                195
            );
            doc.text(`通訊地址： ${this.oneContractObj.ownerContactAddress} `, 10, 200);
            doc.text(`連絡電話： ${this.loginObj.ownerPhone} `, 10, 205);

            doc.text(`承租人 `, 10, 215);
            doc.text(`姓名：${this.oneContractObj.tenantName} `, 10, 220);
            doc.text(
                `統一編號（身分證字號）：${this.oneContractObj.tenantIdentity} `,
                10,
                225
            );
            doc.text(
                `戶籍地址(營業登記地址)： ${this.oneContractObj.tenantHomeAddress} `,
                10,
                230
            );
            doc.text(
                `通訊地址： ${this.oneContractObj.tenantContactAddress} `,
                10,
                235
            );
            doc.text(`連絡電話： ${this.oneContractObj.tenantPhone} `, 10, 240);

            doc.setFontSize(12);
            doc.setFont("NotoSerifTC", "bold");
            doc.text(`立約日期： ${formattedDate}`, 10, 250);

            // 下載 PDF
            doc.save("租賃契約書.pdf");
        },

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
            租賃物件地址: {{oneContractObj.address}}
            <br>
            樓層: {{ oneContractObj.floor }}
            <br>
            房號: {{ oneContractObj.roomId }}
            <br>
            租金/月: {{ oneContractObj.rentP}}
            <br>
            <div style="background-color: white;" v-if="oneContractObj.parking">車位 : 有</div>
            <div v-else  style="background-color: white;">車位 : 無</div>
            <br>
            押金: {{ oneContractObj.deposit }}
            <br>
            管理費/月: {{oneContractObj.manageP}}
            <br>
            電費/度: {{oneContractObj.eletricP}}
            <br>
            水費/月: {{ oneContractObj.waterP}}
            <br>
            面積: {{oneContractObj.acreage}}
            <br>
            設備:{{ roomObj[0].equip }}
            <br>
            物件備註:{{ oneContractObj.rCondition }}
            <div class="input-wrapper">
        
            </div>
        </div>
        <br>
        <h2>立契約書人</h2>
        <div class="info">
            <br>
            <h4>出租人姓名:{{loginObj.ownerName}}</h4> 
            <br>
            身分證字號: {{loginObj.ownerIdentity}}
            <br>
            戶籍地址: {{  oneContractObj.ownerHomeAddress}}
            <br>
            通訊地址: {{  oneContractObj.ownerContactAddress}}
            <br>
            email: {{ loginObj.ownerEmail }}
            <br>
            連絡電話: {{ loginObj.ownerPhone}}
            <br>
            <br>
            <h4>承租人姓名:{{ oneContractObj.tenantName }}</h4> 
            <br>
            身分證字號: {{ oneContractObj.tenantIdentity}}
            <br>
            戶籍地址(營業登記地址): {{ oneContractObj.tenantHomeAddress}}
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
            中止原因: {{oneContractObj.cutReason}}
            <br>
            違約金:  {{ oneContractObj.cutP }}
            <br>
            中止日期: {{ oneContractObj.cutDate }}
        </div>
        <br>
        <h3 class="other">其他備註(或個別磋商條款)</h3>
        <br>
            <textarea disabled style="resize: none; width: 360px;">{{oneContractObj.cOther}}</textarea>
        <br>
        <br>
        <h3 class="signdate">立約日期：{{ formatDate(oneContractObj.signDate) }}</h3>

        契約編號:{{oneContractObj.ai}}
    
        <button @click="this.generatePDF() "class="btn" >列印</button>
    </div>
</template>




<style scoped lang="scss">

.bigArea{

    margin-top: 3%;
    padding: 3%;
    margin-bottom: 3%;
    margin-left: 7%;
    width: 55%;
    background-color: white;
    border: 1px solid rgba(12, 12, 12, 0.096);
    box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
    .roomInfo{
        background-color: white;
    }
    .info{
        background-color: white;
    }
    .cut{
        background-color: white;
    }
}




.rent_time{
    background-color: white;
    label{
        background-color: white;
    }
}
h3{
    background-color: white;
    background-color: white;
    background-color: rgb(247, 203, 150);
    width: 23%;

    padding: 2%;
    // text-align: center;
    box-shadow: rgba(0, 0, 0, 0.15) 2.95px 2.95px 3.6px;

}
.other{
        
width: 55%;
    }
.signdate{
    width: 70%;
    background-color: white;
    box-shadow: none;
}


h4{
    background-color: white;
    
}
h2{
    background-color: white;
    background-color: rgb(247, 203, 150);
    width: 35%;
    padding: 1%;
    text-align: center;
    box-shadow: rgba(0, 0, 0, 0.15) 2.95px 2.95px 3.6px;

}
.roomInfo{
        margin-top: 10%;
    }
h1{
    background-color: white;
    // width: 30%;
    // padding: 2%;
    border-style:inset;
    text-align: center;
    // position: absolute;
    border-radius: 0%;
    top:2%;
    left: 39%;
    margin: auto;
    // background-color: rgb(158, 112, 57);
    color: rgb(0, 0, 0);
}
.btn{
    
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

btn:active {
    color: #666;
    font-weight: 500;
    box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;
    }
</style>