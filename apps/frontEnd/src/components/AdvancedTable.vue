<script>
export default {
  name: 'AdvancedTable',
  props: {
    headers: {
      type: Array,
      required: true,
      // Exemple d'élément : { key: 'nom', label: 'Nom', searchable: true }
    },
    data: {
      type: Array,
      required: true,
    },
    actions: {
      type: Array,
      default: () => [],
      // Exemple d'élément : { label: 'Éditer', method: (row) => { ... } }
    },
  },
  data() {
    const sortOrders = {}
    this.headers.forEach((header) => {
      sortOrders[header.key] = 1
    })
    return {
      sortKey: '',
      sortOrders,
      filters: this.headers.reduce((acc, header) => {
        acc[header.key] = ''
        return acc
      }, {}),
    }
  },
  computed: {
    filteredData() {
      return this.data
        .filter((row) => {
          return this.headers.every((header) => {
            const filter = this.filters[header.key].toLowerCase()
            return (
              !filter
              || row[header.key].toString().toLowerCase().includes(filter)
            )
          })
        })
        .sort((a, b) => {
          if (!this.sortKey)
            return 0
          const order = this.sortOrders[this.sortKey]
          const result
            = a[this.sortKey] > b[this.sortKey]
              ? 1
              : a[this.sortKey] < b[this.sortKey]
                ? -1
                : 0
          return result * order
        })
    },
  },
  methods: {
    sortColumn(key) {
      if (this.sortKey === key) {
        this.sortOrders[key] = -this.sortOrders[key]
      }
      else {
        this.sortKey = key
        this.sortOrders[key] = 1
      }
    },
  },
}
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">
            <button @click="sortColumn(header.key)">
              {{ header.label }}
              <span v-if="sortKey === header.key">
                {{ sortOrders[header.key] === 1 ? '▲' : '▼' }}
              </span>
            </button>
            <input
              v-if="header.searchable"
              v-model="filters[header.key]"
              type="text"
              placeholder="Rechercher"
            >
          </th>
          <th v-if="actions.length">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in filteredData" :key="rowIndex">
          <td v-for="(header, colIndex) in headers" :key="colIndex">
            {{ row[header.key] }}
          </td>
          <td v-if="actions.length">
            <button
              v-for="(action, actionIndex) in actions"
              :key="actionIndex"
              @click="action.method(row)"
            >
              {{ action.label }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.5rem;
  border: 1px solid #ccc;
  text-align: left;
}

th button {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: black;
}

th input {
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.25rem;
  box-sizing: border-box;
}

td button {
  margin-right: 0.5rem;
}
</style>
