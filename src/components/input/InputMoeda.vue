<template>
  <q-input
    ref="inputRef"
    outlined
    dense
    stack-label
    :model-value="formattedValue"
    @update:model-value="handleInput"
    :error-message="errorMessage"
    :error="!!errorMessage"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { useCurrencyInput } from "vue-currency-input";
import { useField } from "vee-validate";
import { useAttrs, computed } from "vue";

interface Props {
  modelValue?: number | null;
  options?: {
    currency: string;
    [key: string]: any;
  };
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({
    currency: "BRL",
    locale: "pt-BR",
    hideGroupingSeparator: false,
    autoDecimalMode: true,
    valueRange: { min: 0 },
    allowNegative: false
  }),
  obrigatorio: false
});

const emit = defineEmits(["update:modelValue"]);
const attrs = useAttrs();

const { inputRef, formattedValue, numberValue } = useCurrencyInput(props.options);

const validateMinValue = () => {
  return true;
};

const { errorMessage } = useField("amount", validateMinValue);

const handleInput = (newValue: string) => {
  formattedValue.value = newValue;
  emit("update:modelValue", numberValue.value);
};

defineExpose({
  inputRef,
  numberValue
});
</script>
