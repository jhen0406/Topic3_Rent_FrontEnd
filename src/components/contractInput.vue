<script>
export default {
    name: 'contractInput',
    props: {
        modelValue: String
    },
    methods: {
        updateValue(event) {
            this.$emit('update:modelValue', event.target.value);
        }
    }
};
</script>

<template>
<div class="input-wrapper">
    <input class="input-box" type="text" :value="modelValue" @input="updateValue" placeholder="Enter your text">
    <span class="underline"></span>
</div>
</template>

<style scoped lang="scss">
.input-wrapper {
    position: relative;
    width: 600px;
    margin: auto;
}

.input-box {
    font-size: 20px;
    padding: 10px 0;
    border: none;
    border-bottom: 2px solid #ccc;
    color: #0f0f0f;
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
