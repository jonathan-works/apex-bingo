<template>
    <!-- <q-markup-table separator="vertical" flat bordered>
        <thead>
            <tr>
                <th colspan="5">
                    <div class="row no-wrap items-center">
                        <q-img
                            style="width: 70px"
                            :ratio="1"
                            class="rounded-borders"
                            src="https://cdn.quasar.dev/img/donuts.png"
                        />
                        <div class="text-h4 q-ml-md text-black">Treats</div>
                    </div>
                </th>
            </tr>
            <tr>
                <th class="text-left">Dessert (100g serving)</th>
                <th class="text-right">Calories</th>
                <th class="text-right">Fat (g)</th>
                <th class="text-right">Carbs (g)</th>
                <th class="text-right">Protein (g)</th>
                <th class="text-right">Sodium (mg)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-left">Frozen Yogurt</td>
                <td class="text-right">159</td>
                <td class="text-right">6</td>
                <td class="text-right">24</td>
                <td class="text-right">4</td>
                <td class="text-right">87</td>
            </tr>
            <tr>
                <td class="text-left">Ice cream sandwich</td>
                <td class="text-right">237</td>
                <td class="text-right">9</td>
                <td class="text-right">37</td>
                <td class="text-right">4.3</td>
                <td class="text-right">129</td>
            </tr>
            <tr>
                <td class="text-left">Eclair</td>
                <td class="text-right">262</td>
                <td class="text-right">16</td>
                <td class="text-right">23</td>
                <td class="text-right">6</td>
                <td class="text-right">337</td>
            </tr>
            <tr>
                <td class="text-left">Cupcake</td>
                <td class="text-right">305</td>
                <td class="text-right">3.7</td>
                <td class="text-right">67</td>
                <td class="text-right">4.3</td>
                <td class="text-right">413</td>
            </tr>
            <tr>
                <td class="text-left">Gingerbread</td>
                <td class="text-right">356</td>
                <td class="text-right">16</td>
                <td class="text-right">49</td>
                <td class="text-right">3.9</td>
                <td class="text-right">327</td>
            </tr>
        </tbody>
    </q-markup-table> -->
    {{ gestaoCartelaStore.gestaoCarteira }}
    <q-table
      flat bordered
      title="Gestão de Cartelas"
      :rows="rows"
      :columns="columns"
      row-key="name"
      separator="vertical"
    />
</template>

<script setup lang="ts">
import { useGestaoCartelaStore } from 'src/stores/gestao-cartela.store';
import { ref } from 'vue'

const gestaoCartelaStore = useGestaoCartelaStore();
gestaoCartelaStore.getGestaoCarteiraPaginado();

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
]
const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  }
]

</script>