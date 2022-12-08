const { createApp } = Vue

createApp({
    data() {
        return {
            requestStatus: 0,
            requestID: 0,
            parkingData: [],
            garageInfo: [
                {
                    name: 'uptown west',
                    garages: [
                        {
                            id: 2042,
                            name: 'University Ave Garage',
                            available: undefined
                        },
                        {
                            id: 2043,
                            name: 'Corry Garage',
                            available: undefined
                        },
                        {
                            id: 2044,
                            name: 'Varsity Village Garage',
                            available: undefined
                        },
                        {
                            id: 2045,
                            name: 'CCM Garage',
                            available: undefined
                        },
                        {
                            id: 2046,
                            name: 'Calhoun Garage',
                            available: undefined
                        },
                        {
                            id: 2047,
                            name: 'Campus Green Garage',
                            available: undefined
                        },
                        {
                            id: 2048,
                            name: 'Woodside Garage',
                            available: undefined
                        },
                        {
                            id: 2049,
                            name: 'Clifton Court Garage',
                            available: undefined
                        },
                        {
                            id: 2051,
                            name: 'Stratford Garage',
                            available: undefined
                        },
                        {
                            id: 2060,
                            name: 'University Ave Garage Level 1',
                            available: undefined
                        },
                        {
                            id: 2061,
                            name: 'University Park Apartments Garage',
                            available: undefined
                        }
                    ]
                },
                {
                    name: 'uptown east',
                    garages: [
                        {
                            id: 2050,
                            name: 'Eden Garage',
                            available: '-'
                        },
                        {
                            id: 2052,
                            name: 'Kingsgate Garage',
                            available: '-'
                        }
                    ]
                }
            ]
        }
    },
    beforeMount() {
    },
    computed: {
        parkingApp() {
            // if (this.requestStatus === 1) {
            //     this.parkingData.map(el => {
            //         el.Occupancy.map(occ => {if (occ.OccupancyType === "Transient") {el.Occupancy = occ}})
            //         if (el.FacilityID === '2061') {el.Description = 'University Park Apartments Garage'}
            //     })
            //     let parkingApp = this.parkingData
            //     // let parkingApp = new Object()
            //     // Object.keys(this.garageLocations).forEach(campus => {parkingApp[campus] = new Array()})
            //     this.sortByAvailable(parkingApp)
            //     return parkingApp.filter(el => {
            //         return parseInt(el.Occupancy.Available) > 0
            //     })
            // }
            return this.garageInfo
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
            this.requestStatus = 0
            this.jsonp('https://cso.uc.edu:3000/occupancy')
                .then(data => {
                    this.parkingData = data
                    this.requestStatus = 1
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