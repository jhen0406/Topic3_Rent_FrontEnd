<script>
export default {
    name: 'contractInput',
};
</script>

<template>

<div class="input-wrapper">
    <input class="input-box" type="textarea" placeholder="2022">
    <span class="underline"></span>
</div>




</template>

    <style scoped lang="scss">
    .input-wrapper {
    position: relative;
    width: 200px;
    margin: auto;
    }

    .input-box {
    font-size: 22px;
    font-weight: 500;
    padding: 10px 0;
    border: none;
    border-bottom: 2px solid #ccc;
    color: #d41313;
    width: 100%;
    background-color: transparent;
    transition: border-color 0.3s ease-in-out;
    }

    .underline {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #FF9D60;
    transform: scaleX(0);
    transition: transform 0.3s ease-in-out;
    }

    .input-box:focus {
    border-color: #FF9D60;
    outline: none;
    }

    .input-box:focus + .underline {
    transform: scaleX(1);
    }


</style>