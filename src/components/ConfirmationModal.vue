    
<script>
export default {
    props: {
    visible: {
        type: Boolean,
        required: true
    },
    message: {
        type: String,
        required: true
    }
    },
    methods: {
    confirm() {
        this.$emit('confirm');
    },
    cancel() {
        this.$emit('cancel');
    }
    }
}
</script>

<template>
    <div v-if="visible" class="modal">
        <div class="modal-content">
            <p>{{ message }}</p>
            <button @click="confirm">確定</button>
            <button @click="cancel">取消</button>
        </div>
        </div>
</template>

    
<style scoped>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
    }
    
    button {
        margin: 5px;
    }
</style>
  