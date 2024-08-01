<script>
export default {
    name: 'searchInput',
};
</script>

<template>

<input placeholder="Searth the internet..." type="text" name="text" class="input">
</template>

<style scoped lang="scss">
.InputContainer {
    width: 600px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    // background: linear-gradient(to bottom, #FF9D60, rgb(255, 231, 231));
    border-radius: 30px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 2px 2px 2px rgba(163, 162, 162, 0.075);
    display: inline-block;
    vertical-align: middle; /* Optional: Align vertically */
    // flex: 1; /* 彈性增長，使 input 容器占據剩餘空間 */
}

.input {
    width: 600px;
    height: 40px;
    // caret-color: rgb(255, 81, 0);
    // background-color: rgb(255, 255, 255);
    border-radius: 30px;
    padding-left: 15px;
    letter-spacing: 0.8px;
    color: rgb(19, 19, 19);
    font-size: 22px;
}

</style>