const { createApp } = Vue

// LINKS
// https://www.uc.edu/about/parking/visitors/uptown.html
// https://www.uc.edu/about/parking/locations.html#uptown-west
// https://www.uc.edu/about/parking/locations/maps.html

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
                            name: 'university ave garage',
                            address: ['40 W University Ave, Cincinnati, OH 45221'],
                            latitute: 39.134615,
                            longitude: -84.510986,
                            available: undefined
                        },
                        {
                            id: 2043,
                            name: 'corry garage',
                            available: undefined
                        },
                        {
                            id: 2044,
                            name: 'varsity village garage',
                            available: undefined
                        },
                        {
                            id: 2045,
                            name: 'CCM garage',
                            address: ['CCM Blvd, Cincinnati, OH 45219'],
                            latitute: 39.129894,
                            longitude: -84.516852,
                            googlePlusCode: '4FHM+X5 Cincinnati, Ohio',
                            payStation: 'lobby near garage main entrance',
                            clearance: 'level 3 (main): 7-feet 6-inches; level 2 and below: 6-feet 10-inches',
                            available: undefined
                        },
                        {
                            id: 2046,
                            name: 'calhoun garage',
                            entrances: {
                                primary: {
                                    name: 'calhoun st. entrance',
                                    address: '15 Calhoun St, Cincinnati, OH 45219',
                                    latitute: 39.12845438089837,
                                    longitude: -84.51656896245346,
                                    googlePlusCode: '4FHM+99 Cincinnati, Ohio',
                                },
                                secondary: {
                                    name: 'dennis st. entrance',
                                    address: '2543 Dennis St, Cincinnati, OH 45219',
                                    latitute: 39.12910750242705,
                                    longitude: -84.5139241176143,
                                    googlePlusCode: '4FHP+JC Cincinnati, Ohio',
                                },
                                tertiary: {
                                    name: 'corry st. entrance',
                                    address: '125 W Corry St, Cincinnati, OH 45219',
                                    latitute: 39.12920217234661, 
                                    longitude: -84.5141319888143,
                                    googlePlusCode: '4FHP+M8 Cincinnati, Ohio',
                                }
                            },                          
                            payStation: 'level P1 near elevator #4',
                            clearance: '1000 level: 7-feet 10-inches; Remaining Levels: 7-feet 5-inches',
                            available: undefined
                        },
                        {
                            id: 2047,
                            name: 'campus green garage',
                            available: undefined
                        },
                        {
                            id: 2048,
                            name: 'woodside garage',
                            available: undefined
                        },
                        {
                            id: 2049,
                            name: 'clifton court garage',
                            available: undefined
                        },
                        {
                            id: 2051,
                            name: 'stratford garage',
                            available: undefined
                        },
                        {
                            id: 2060,
                            name: 'university ave garage level 1',
                            available: undefined
                        },
                        {
                            id: 2061,
                            name: 'university park apartments garage',
                            available: undefined
                        }
                    ]
                },
                {
                    name: 'uptown east',
                    garages: [
                        {
                            id: 2050,
                            name: 'eden garage',
                            available: undefined
                        },
                        {
                            id: 2052,
                            name: 'kingsgate garage',
                            available: undefined
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