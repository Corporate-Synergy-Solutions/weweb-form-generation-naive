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
import { ref, watch } from 'vue';
import FormGenerator from './naive/FormGeneration.vue';

const props = defineProps({
    content: { type: Object, required: true },
});

const schema = {
    name: { label: 'Name', required: true },
    email: { type: 'email', label: 'Email', required: true },
    message: { type: 'textarea', label: 'Message' },
    date: { type: 'date', label: 'Date', required: true },
    country: { type: 'select', label: 'Country', required: true, options: ['USA', 'Canada', 'UK', 'Germany'] },
};

const updateComponent = ref(1);
watch(
    () => props.content,
    () => (updateComponent.value += 1),
    { deep: true }
);
</script>
