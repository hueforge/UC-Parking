const { createApp } = Vue

createApp({
    data() {
        return {
            parkingData: undefined
        }
    },
    beforeMount() {
        this.getParkingData
    },
    mounted() {
        fetch('https://cso.uc.edu:3000/occupancy')
            .then(res => res.json())
            .then(data => this.jobs = data)
            .catch(err => console.log(err.message))
    },
    computed: {
    },
    methods: {
        async getParkingData() {
            
        }
    },
}).mount('#app')