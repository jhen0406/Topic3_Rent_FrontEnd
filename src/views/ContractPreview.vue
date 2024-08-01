

<script>
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
    export default {
        data(){
            return
        },
    computed: {
        ...mapState(dataStore, ['page'])
    },
    mounted() {
        this.setPage(7);
    },
        props: {
        start_date: String,
        end_date: String,
        address: String,
        floor: String,
        r_id: String,
        // 其他租賃物件資訊
        owner_name: String,
        owner_identity: String,
        owner_home_address: String,
        owner_contact_address: String,
        owner_phone: String,
        tenant_name: String,
        tenant_identity: String,
        tenant_home_address: String,
        tenant_contact_address: String,
        tenant_email: String,
        tenant_phone: String,
        cut_reason: String,
        cut_p: String,
        cut_date: String,
        c_other: String,
        sign_date: String
        }
    };
</script>
<template>
    <div>
        <h1>契約書預覽</h1>
        <div>
            <h2>租賃物件資訊</h2>
            <p>租賃期間：{{ start_date }} 至 {{ end_date }}</p>
            <p>租賃物件地址：{{ address }}</p>
            <p>樓層：{{ floor }}</p>
            <p>房號：{{ r_id }}</p>
            <!-- 其他租賃物件資訊 -->
        </div>
    
        <div>
            <h2>立契約書人</h2>
            <p>出租人姓名：{{ owner_name }}</p>
            <p>身分證字號：{{ owner_identity }}</p>
            <p>戶籍地址(營業登記地址)：{{ owner_home_address }}</p>
            <p>通訊地址：{{ owner_contact_address }}</p>
            <p>連絡電話：{{ owner_phone }}</p>
            <p>承租人姓名：{{ tenant_name }}</p>
            <p>身分證字號：{{ tenant_identity }}</p>
            <p>戶籍地址(營業登記地址)：{{ tenant_home_address }}</p>
            <p>通訊地址：{{ tenant_contact_address }}</p>
            <p>Email：{{ tenant_email }}</p>
            <p>連絡電話：{{ tenant_phone }}</p>
        </div>
    
        <div>
            <h2>契約中止</h2>
            <p>中止原因：{{ cut_reason }}</p>
            <p>違約金：{{ cut_p }}</p>
            <p>中止日期：{{ cut_date }}</p>
        </div>
    
        <div>
            <h2>其他備註(或個別磋商條款)</h2>
            <p>{{ c_other }}</p>
        </div>
    
        <div>
            <h2>立約日期</h2>
            <p>{{ sign_date }}</p>
        </div>
    </div>
</template>


<style scoped>
  /* 可選的樣式設置 */
</style>
