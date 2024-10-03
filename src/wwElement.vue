<template>
    <FormGenerator
        :key="updateComponent"
        :schema="content.schema"
        @submitted="
            e =>
                $emit('trigger-event', {
                    name: 'event:submitted',
                    event: e,
                })
        "
    />
</template>

<script setup>
import './style.css';
import { ref, watch, getCurrentInstance } from 'vue';
import FormGenerator from './naive/FormGeneration.vue';
import {
    NForm,
    NFormItem,
    NInput,
    NButton,
    NSelect,
    NDatePicker,
    NAlert,
    NSwitch,
    NRadio,
    NRadioGroup,
    NCheckbox,
    NCheckboxGroup,
} from 'naive-ui';

const app = getCurrentInstance().appContext.app;
app.component('n-form', NForm);
app.component('n-form-item', NFormItem);
app.component('n-input', NInput);
app.component('n-button', NButton);
app.component('n-select', NSelect);
app.component('n-date-picker', NDatePicker);
app.component('n-alert', NAlert);
app.component('n-switch', NSwitch);
app.component('n-radio', NRadio);
app.component('n-radio-group', NRadioGroup);
app.component('n-checkbox', NCheckbox);
app.component('n-checkbox-group', NCheckboxGroup);

const props = defineProps({
    content: { type: Object, required: true },
});

const schema = {
    name: { label: 'Name', required: true },
    email: { type: 'email', label: 'Email', required: true },
    message: { type: 'textarea', label: 'Message' },
    date: { type: 'date', label: 'Date', required: true },
    switch: { type: 'switch', label: 'Switch' },
    country: {
        type: 'select',
        label: 'Country',
        required: true,
        options: ['USA', 'Canada', 'UK', 'Germany'],
    },
    gender: {
        type: 'radio',
        label: 'Gender',
        required: true,
        options: ['Male', 'Female'],
    },
    toppings: {
        type: 'checkbox',
        label: 'Toppings',
        required: true,
        options: ['Cheese', 'Sausage', 'Lettuce'],
    },
};

const updateComponent = ref(1);
watch(
    () => props.content,
    () => (updateComponent.value += 1),
    { deep: true }
);
</script>
