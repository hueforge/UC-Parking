const { createApp } = Vue

createApp({
    data() {
        return {
            parkingData: []
        }
    },
    beforeMount() {
        this.getParkingData()
    },
    mounted() {
        
    },
    computed: {
        parkingApp() {
            const parkingApp = this.parkingData
            parkingApp.map(el => {
                el.Occupancy.map(occ => {if (occ.OccupancyType === "Transient") { el.Occupancy = occ }});
                if (parseInt(el.Occupancy.Available) < 0) {el.Occupancy.Available = "0"}
            })
            this.sortByAvailable(parkingApp)
            return parkingApp
        }
    },
    methods: {
        getParkingData() {
            $.ajax({
                url: 'https://cso.uc.edu:3000/occupancy',
                type: "GET",
                dataType: 'jsonp',
                success: data => {this.parkingData = data}
            })
        },
        sortByAvailable(parkingApp) {
            return parkingApp.sort((elx, ely) => {
                const elxAvailable = parseInt(elx.Occupancy.Available)
                const elyAvailable = parseInt(ely.Occupancy.Available)
                if ( elxAvailable < elyAvailable) {return 1}
                if (elxAvailable > elyAvailable) {return -1}
                return 0
            })
        }
    },
}).mount('#app')