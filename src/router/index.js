import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect:'/emptyRoomList',
      component: () => import('../views/Home.vue'),
      meta: { noHeader: true } 
    },

    {//預設空房頁面
      path: '/emptyRoomList',
      name: 'emptyRoomList',
      component: () => import('../views/EmptyRoomList.vue'),
      meta: { noHeader: true } 
    },

    {//空房的詳細資訊
      path: '/EmptyRoomDetail',
      name: 'EmptyRoomDetail',
      component: () => import('../views/EmptyRoomDetail.vue'),
      meta: { noHeader: true } 
    },
    
    {//房客登入
      path: '/tenantLogin',
      name: 'tenantLogin',
      component: () => import('../views/TenantLogin.vue')
    },
    
    {//房間列表
      path: '/roomList',
      name: 'roomList',
      component: () => import('../views/RoomList.vue')
    },
    {// 產生當期帳單
      path: '/generatebill',
      name: 'generatebill',
      component: () => import('../views/BillGenerate.vue')
    },
    {// 帳單明細
      path: '/BillDetail',
      name: 'BillDetail',
      component: () => import('../views/BillDetail.vue')
    },
    {
      path: '/Overview',
      name: 'Overview',
      component: () => import('../views/Overview.vue')
    },
    //租約列表管理
    {
      path: '/ContractList',
      name: 'ContractList',
      component: () => import('../views/ContractList.vue')
    },
    //新增租約
    {
      path: '/contractAdd',
      name: 'contractAdd',
      component: () => import('../views/ContractAdd.vue')
    },
    {//房間列表
      path: '/roomList',
      name: 'roomList',
      component: () => import('../views/RoomList.vue')
    },
    {//新增房間
      path: '/addRoom',
      name: 'addRoom',
      component: () => import('../views/AddRoom.vue')
    },
    {//單一房間詳細資訊
      path: '/roomDetail',
      name: 'roomDetail',
      component: () => import('../views/RoomDetail.vue')
    },
    {//編輯單一房間資訊
      path: '/editRoom',
      name: 'editRoom',
      component: () => import('../views/EditRoom.vue')
    },
    {//查看契約詳情
      path: '/Contract_Detail',
      name: 'Contract_Detail',
      component: () => import('../views/Contract_Detail.vue'),
      props: true // 允許通過路由傳參

    },
    // {//註冊
    //   path: '/Register',
    //   name: 'Register',
    //   component: () => import('../views/Register.vue'),
    //   props: true // 允許通過路由傳參

    // },
    {
      path: '/Cutcontract_Edit',
      name: 'Cutcontract_Edit',
      component: () => import('../views/CutcontractEdit.vue'),
      props: true // 允許通過路由傳參

    },
    {//帳單列表
      path: '/lookupbill',
      name: 'lookupbill',
      component: () => import('../views/BillList.vue')
    },
    // {
    //   path: '/ ContractPreview',
    //   name: 'ContractPreview',
    //   component: () => import('../views/ContractPreview.vue')
    // },
    //查看契約詳情
    {
      path: '/Contract_Detail',
      name: 'Contract_Detail',
      component: () => import('../views/Contract_Detail.vue'),
      props: true // 允許通過路由傳參
    },
    {//當期帳單計算(輸入用電量的頁面)
      path: '/billFinalDetail',
      name: 'billFinalDetail',
      component: () => import('../views/BillFinalDetail.vue')
    },
    {
      path: '/Register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      props: true // 允許通過路由傳參

    },
    //契約中止編輯
    {
      path: '/CutcontractEdit',
      name: 'CutcontractEdit',
      component: () => import('../views/CutcontractEdit.vue'),
      props: true // 允許通過路由傳參

    },//修改帳戶資訊
    {
      path: '/AdjustAccount',
      name: 'AdjustAccount',
      component: () => import('../views/AdjustAccount.vue'),
      props: true // 允許通過路由傳參
    },
    {
      path: '/TenantBillFirst',
      name: 'TenantBillFirst',
      component: () => import('../views/TenantBillFirst.vue'),
      meta: { noHeader: true },

    },
  ]

})


export default router
