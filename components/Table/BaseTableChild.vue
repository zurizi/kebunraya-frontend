// BaseTable.vue
<template>
  <div class="overflow-x-auto">
    <table class="min-w-full overflow-hidden text-sm bg-white border rounded-lg border-slate-200">
      <!-- Table Header -->
      <thead class="bg-slate-300">
        <!-- First Level Headers -->
        <tr>
          <th
            v-if="showRowNumbers"
            :rowspan="getMaxDepth()"
            class="px-4 py-2 font-medium text-left align-top border-b border-r border-slate-200 text-slate-600"
          >
            No
          </th>
          <template v-for="(header, index) in headers" :key="index">
            <th
              v-if="!header.children"
              :rowspan="getMaxDepth()"
              class="px-4 py-2 font-medium text-left align-top border-b border-r border-slate-200 text-slate-600"
            >
              {{ header.title }}
            </th>
            <th
              v-else
              :colspan="getColSpan(header)"
              class="px-4 py-2 font-medium text-center border-b border-r border-slate-200 text-slate-600"
            >
              {{ header.title }}
            </th>
          </template>
          <th
            v-if="showButtonAction"
            :rowspan="getMaxDepth()"
            class="px-4 py-2 font-medium text-left align-top border-b border-slate-200 text-slate-600"
          >
            Aksi
          </th>
        </tr>

        <!-- Second Level Headers -->
        <tr v-if="hasSecondLevel()">
          <template v-for="(header, index) in headers" :key="`second-${index}`">
            <template v-if="header.children">
              <template v-for="(child, childIndex) in header.children" :key="`child-${childIndex}`">
                <th
                  v-if="!child.children"
                  :rowspan="getMaxDepth() - 1"
                  class="px-4 py-2 font-medium text-center align-top border-b border-r border-slate-200 text-slate-600"
                >
                  {{ typeof child === 'string' ? child : child.title }}
                </th>
                <th
                  v-else
                  :colspan="child.children.length"
                  class="px-4 py-2 font-medium text-center border-b border-r border-slate-200 text-slate-600"
                >
                  {{ child.title }}
                </th>
              </template>
            </template>
          </template>
        </tr>

        <!-- Third Level Headers -->
        <tr v-if="hasThirdLevel()">
          <template v-for="(header, index) in headers" :key="`third-${index}`">
            <template v-if="header.children">
              <template v-for="(child, childIndex) in header.children" :key="`child-${childIndex}`">
                <template v-if="child.children">
                  <th
                    v-for="(grandchild, grandchildIndex) in child.children"
                    :key="`grandchild-${grandchildIndex}`"
                    class="px-4 py-2 font-medium text-center border-b border-r border-slate-200 text-slate-600"
                  >
                    {{ grandchild }}
                  </th>
                </template>
              </template>
            </template>
          </template>
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody>
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          class="transition-colors even:bg-slate-100 odd:bg-white hover:bg-slate-50"
        >
          <td
            v-if="showRowNumbers"
            class="px-4 py-0 border-b border-r border-slate-200 text-slate-700"
          >
            {{ rowIndex + 1 }}
          </td>
          <td
            v-for="(value, colIndex) in row"
            :key="colIndex"
            class="px-4 py-0 border-b border-r border-slate-200 text-slate-700"
          >
            <template v-if="$slots[`cell-${colIndex}`]">
              <slot :name="`cell-${colIndex}`" :item="value" :index="colIndex"></slot>
            </template>
            <template v-else>
              {{ formatValue(value, colIndex) }}
            </template>
          </td>
          <td 
            v-if="showButtonAction" 
            class="px-4 py-0 border-b border-slate-200 text-slate-700"
          >
            <div class="relative" :ref="setDropdownContainer(rowIndex)">
              <button
                @click="toggleDropdown(rowIndex)"
                class="flex items-center gap-2 px-3 py-1 text-xs bg-blue-500 border rounded-md text-slate-500 border-slate-500 hover:bg-blue-600"
              >
                Aksi
                <IconsDown class="w-3 h-3" />
              </button>
              <div
                v-if="openDropdown === rowIndex"
                class="fixed right-0 mt-2 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-[999]"
                ref="dropdown"
              >
                <button
                  v-for="(action, actionIndex) in actions"
                  :key="actionIndex"
                  @click="handleAction(action, row, rowIndex)"
                  class="w-full px-4 py-0 text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2 text-[10px]"
                >
                  <img :src="`/icons/${action.icon}.svg`" alt="" class="w-2 h-2">
                  {{ action.label }}
                </button>
              </div>
            </div>
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td 
            :colspan="getTotalColumns()" 
            class="p-4 text-base font-medium text-center text-red-600 bg-red-50"
          >
            {{ loading ? 'Memuat data...' : 'Tidak ada data yang ditemukan' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  actions: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false
  },
  showRowNumbers: {
    type: Boolean,
    default: false
  },
  showButtonAction: {
    type: Boolean,
    default: false
  }
});

const openDropdown = ref(null);
const dropdownContainers = ref([]);
const dropdown = ref(null);

// Helper Functions for Nested Headers
const getMaxDepth = () => {
  let maxDepth = 1;
  for (const header of props.headers) {
    if (header.children) {
      let depth = 2;
      for (const child of header.children) {
        if (typeof child === 'object' && child.children) {
          depth = 3;
        }
      }
      maxDepth = Math.max(maxDepth, depth);
    }
  }
  return maxDepth;
};

const hasSecondLevel = () => {
  return props.headers.some(header => header.children);
};

const hasThirdLevel = () => {
  return props.headers.some(header => 
    header.children?.some(child => 
      typeof child === 'object' && child.children
    )
  );
};

const getColSpan = (header) => {
  if (!header.children) return 1;
  
  let span = 0;
  for (const child of header.children) {
    if (typeof child === 'object' && child.children) {
      span += child.children.length;
    } else {
      span += 1;
    }
  }
  return span;
};

const getTotalColumns = () => {
  let total = props.showRowNumbers ? 1 : 0;
  total += props.showButtonAction ? 1 : 0;
  
  for (const header of props.headers) {
    if (!header.children) {
      total += 1;
    } else {
      total += getColSpan(header);
    }
  }
  
  return total;
};

// Value Formatting
const formatValue = (value, colIndex) => {
  // Format percentages
  if (typeof value === 'number' && isPercentageColumn(colIndex)) {
    return `${value.toFixed(2)}%`;
  }
  // Format numbers with thousands separator
  if (typeof value === 'number' && !isPercentageColumn(colIndex)) {
    return value.toLocaleString();
  }
  return value;
};

const isPercentageColumn = (colIndex) => {
  // Determine if this column should show percentages based on your headers structure
  // You'll need to implement this based on your specific needs
  return false;
};

// Dropdown Functionality
const setDropdownContainer = (index) => (el) => {
  dropdownContainers.value[index] = el;
};

const toggleDropdown = (index) => {
  openDropdown.value = openDropdown.value === index ? null : index;
};

const handleAction = (action, row, rowIndex) => {
  if (typeof action.onClick === "function") {
    action.onClick(row, rowIndex);
  }
  openDropdown.value = null;
};

const handleClickOutside = (event) => {
  if (openDropdown.value !== null) {
    const container = dropdownContainers.value[openDropdown.value];
    if (container && !container.contains(event.target)) {
      openDropdown.value = null;
    }
  }
};

// Lifecycle Hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.table-fixed {
  table-layout: fixed;
}

th {
  white-space: nowrap;
}

td {
  white-space: nowrap;
}
</style>