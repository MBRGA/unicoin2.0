<template>
  <div id="PlotDiv"></div>
</template>

<script setup lang="ts">
import { onMounted, defineProps } from "vue";
import Plotly from "plotly.js";

const data = defineProps<{
  pieValues: number[];
  pieLabels: string[];
  pieHole: number;
  pieColors: string[];
}>();

onMounted(() => {
  const plotlyData: Plotly.Data = {
    type: "pie",
    values: data.pieValues,
    labels: data.pieLabels,
    hole: data.pieHole,
    sort: false,
    marker: {
      colors: data.pieColors,
    },
  };

  Plotly.newPlot("PlotDiv", [plotlyData]);
});
</script>
