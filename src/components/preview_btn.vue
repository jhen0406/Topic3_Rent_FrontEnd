<script>
export default {
    name: 'preview_btn',
};
</script>

<template>

<button>預覽</button>




</template>

<style scoped lang="scss">
    
button {
        color: #090909;
        padding: 0.4em 1.3em;
        font-size: 20px;
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

</style>