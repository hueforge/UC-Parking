const { createApp } = Vue

createApp({
    data() {
        return {
            requestID: 0,
            garageLocations: {
                uptownWest: [2042,2043,2044,2045,2046,2047,2048,2049,2051,2060,2061],
                uptownEast: [2050,2052]
            },
            parkingData: []
        }
    },
    beforeMount() {
        this.getParkingData()
    },
    computed: {
        parkingApp() {
            const parkingApp = this.parkingData
            parkingApp.map(el => {
                el.Occupancy.map(occ => {if (occ.OccupancyType === "Transient") { el.Occupancy = occ }});
                if (el.FacilityID === '2061') { el.Description = 'University Park Apartments Garage'}
                
            })
            this.sortByAvailable(parkingApp)
            return parkingApp
        }
    },
    methods: {
        jsonp(url,timeout = 7500) {
            const head = document.querySelector('head')
            this.requestID += 1

            return new Promise((resolve, reject) => {
                let script = document.createElement('script')
                const callbackName = `jsonpCallback${this.requestID}`

                script.src = encodeURI(`${url}?callback=${callbackName}`)
                script.async = true

                const timeoutId = window.setTimeout(() => { cleanUp()
                return reject(new Error('Timeout'))
                }, timeout)

                window[callbackName] = data => { cleanUp()
                return resolve(data)
                }

                script.addEventListener('error', error => { cleanUp()
                return reject(error)
                })

                function cleanUp() {
                    window[callbackName] = undefined
                    head.removeChild(script)
                    window.clearTimeout(timeoutId)
                    script = null
                }

                head.appendChild(script);
            })
        },
        getParkingData() {
            this.jsonp('https://cso.uc.edu:3000/occupancy')
                .then(data => {this.parkingData = data})
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