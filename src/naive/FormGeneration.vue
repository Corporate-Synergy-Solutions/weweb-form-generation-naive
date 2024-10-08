<template>
    <n-form v-if="schema" ref="formRef" :model="formValue" :rules="rules">
        <n-alert v-if="invalid" title="Error Text" type="error" :style="{ marginBottom: '20px' }">
            Form is invalid
        </n-alert>
        <n-form-item v-for="item in components" :label="item.label" :path="item.path" :key="item.path">
            <component
                :is="item.name"
                v-model:value="formValue[item.path]"
                v-bind="{
                    options: item.options || undefined,
                    type: item.type || undefined,
                }"
            >
                <template v-if="item.children">
                    <component
                        v-for="children in item.children"
                        :key="children.name"
                        :is="children.name"
                        v-bind="{
                            value: children.value || undefined,
                            label: children.label || undefined,
                        }"
                    >
                        {{ children.label || '' }}
                    </component>
                </template>
            </component>
        </n-form-item>
        <n-form-item>
            <n-button @click="onSubmit"> Submit </n-button>
        </n-form-item>
    </n-form>
    <p v-else>Insert your JSON schema</p>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';

const props = defineProps({
    schema: {
        type: [Object, String],
        default: '',
    },
});

const emit = defineEmits(['submitted']);

const formRef = ref(null);
const formValue = ref({});
const rules = ref({});
const components = ref([]);
const invalid = ref(false);

function onSubmit(e) {
    e.preventDefault();
    formRef.value?.validate(errors => {
        if (!errors) {
            invalid.value = false;
        } else {
            invalid.value = true;
            emit('submitted', formValue.value);
        }
    });
}

function validateEmail(rule, value) {
    return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
}

function parseJson(str) {
    let obj = {};
    try {
        obj = JSON.parse(str);
    } catch (e) {
        return {};
    }
    return obj;
}

onBeforeMount(() => {
    if (!props.schema) return;
    const arrComp = [];
    let r = {};
    let formVal = {};
    const typeRules = {
        date: 'number',
        switch: 'boolean',
        checkbox: 'array',
    };
    const schema = typeof props.schema === 'string' ? parseJson(props.schema) : props.schema;
    for (const [key, value] of Object.entries(schema)) {
        // value
        formVal[key] = value.type === 'switch' ? false : null;
        // rules
        if (value.required) {
            r[key] = [
                {
                    type: value.type ? typeRules[value.type] : undefined,
                    required: true,
                    message: 'This field is required',
                    trigger: ['input', 'blur', 'change', 'focus'],
                },
            ];
        }
        // comp
        if (value.type) {
            if (value.type === 'email') {
                arrComp.push({ name: 'n-input', type: 'email', label: schema[key].label, path: key });
                r[key] = [
                    ...(Array.isArray(r[key]) ? r[key] : []),
                    { validator: validateEmail, message: 'Email is not valid', trigger: 'input' },
                ];
            } else if (value.type === 'select') {
                const options = value.options.map(e => {
                    return {
                        value: e,
                        label: e,
                    };
                });
                arrComp.push({ name: 'n-select', label: schema[key].label, options, path: key });
            } else if (value.type === 'textarea') {
                arrComp.push({ name: 'n-input', type: 'textarea', label: schema[key].label, path: key });
            } else if (value.type === 'date') {
                arrComp.push({
                    name: 'n-date-picker',
                    type: 'date',
                    label: schema[key].label,
                    path: key,
                });
            } else if (value.type === 'switch') {
                arrComp.push({
                    name: 'n-switch',
                    label: schema[key].label,
                    path: key,
                });
            } else if (value.type === 'radio') {
                const options = value.options.map(e => {
                    return {
                        value: e,
                        label: e,
                        name: 'n-radio',
                    };
                });
                arrComp.push({
                    name: 'n-radio-group',
                    label: schema[key].label,
                    path: key,
                    children: options,
                });
            } else if (value.type === 'checkbox') {
                const options = value.options.map(e => {
                    return {
                        value: e,
                        label: e,
                        name: 'n-checkbox',
                    };
                });
                arrComp.push({
                    name: 'n-checkbox-group',
                    label: schema[key].label,
                    path: key,
                    children: options,
                });
            }
        } else {
            arrComp.push({ name: 'n-input', type: 'text', label: schema[key].label, path: key });
        }
    }

    formValue.value = formVal;
    components.value = arrComp;
    rules.value = r;
});
</script>
