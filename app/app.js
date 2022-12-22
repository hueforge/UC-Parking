const { createApp } = Vue

// LINKS
// https://www.uc.edu/about/parking/visitors/uptown.html
// https://www.uc.edu/about/parking/locations.html#uptown-west
// https://www.uc.edu/about/parking/locations/maps.html

createApp({
    data() {
        return {
            requestStatus: false,
            requestID: 0,
            parkingData: [],
            garageInfo: [
                {
                    name: 'uptown west',
                    garages: [
                        {
                            id: 2043,
                            name: 'corry garage',
                            entrances: [
                                {
                                    name: 'corry blvd entrance',
                                    latitude: 39.12933373070052,
                                    longitude: -84.51288862695665
                                },
                                {
                                    name: 'classen st entrance',
                                    latitude: 39.128723123928545,
                                    longitude: -84.51299785637289
                                }
                            ],
                            payStation: 'edwards 2 lobby',
                            clearance: '6-feet 9-inches',
                            available: '-'
                        },
                        {
                            id: 2044,
                            name: 'varsity village garage',
                            entrances: [
                                {
                                    name: 'varsity village dr entrance',
                                    latitude: 39.13018764764033,
                                    longitude: -84.51602214035846
                                }
                            ],
                            payStation: 'near elevator',
                            clearance: '9-feet 6-inches',
                            available: '-'
                        },
                        {
                            id: 2045,
                            name: 'CCM garage',
                            entrances: [
                                {
                                    name: 'corry blvd entrance',
                                    latitude: 39.12975928116998,
                                    longitude:  -84.51654705913514
                                }
                            ],
                            payStation: 'lobby near garage main entrance',
                            clearance: '6-feet 10-inches',
                            available: '-'
                        },
                        {
                            id: 2046,
                            name: 'calhoun garage',
                            entrances: [
                                {
                                    name: 'calhoun st entrance',
                                    latitude: 39.12845438089837,
                                    longitude: -84.51656896245346
                                },
                                {
                                    name: 'dennis st entrance',
                                    latitude: 39.12910750242705,
                                    longitude: -84.5139241176143
                                },
                                {
                                    name: 'corry st entrance',
                                    latitude: 39.12920217234661,
                                    longitude: -84.5141319888143
                                }
                            ],
                            payStation: 'level P1 near elevator #4',
                            clearance: '7-feet 5-inches',
                            available: '-'
                        },
                        {
                            id: 2047,
                            name: 'campus green garage',
                            entrances: [
                                {
                                    name: 'campus green dr entrance',
                                    latitude: 39.135352726018496,
                                    longitude: -84.51390106981378
                                },
                                {
                                    name: 'woodside drive entrance',
                                    latitude: 39.13469836091519,
                                    longitude: -84.51489469106572
                                }
                            ],
                            payStation: 'level 3 near elevator',
                            clearance: '6-feet 9-inches',
                            available: '-'
                        },
                        {
                            id: 2048,
                            name: 'woodside garage',
                            entrances: [
                                {
                                    name: 'woodside drive entrance',
                                    latitude: 39.13500598950055,
                                    longitude: -84.51491614802495
                                }
                            ],
                            payStation: 'level 1 by library elevator',
                            clearance: '6-feet 7-inches',
                            available: '-'
                        },
                        {
                            id: 2049,
                            name: 'clifton court garage',
                            entrances: [
                                {
                                    name: 'clifton ct entrance',
                                    latitude: 39.134239703633554,
                                    longitude: -84.51768884292908
                                }
                            ],
                            payStation: 'level 1',
                            clearance: '6-feet 4-inches',
                            available: '-'
                        }
                    ]
                },
                {
                    name: 'uptown east',
                    garages: [
                        {
                            id: 2050,
                            name: 'eden garage',
                            entrances: [
                                {
                                    name: 'eden ave entrance',
                                    latitude: 39.13762378519983,
                                    longitude: -84.50538302581167
                                },
                                {
                                    name: 'panzeca way entrance (west)',
                                    latitude: 39.137693843754825,
                                    longitude: -84.50669779046099
                                },
                                {
                                    name: 'panzeca way entrance (north)',
                                    latitude: 39.13870673818666,
                                    longitude: -84.5057405374213
                                }
                            ],
                            payStation: 'level 5 near bridge to medical sciences building',
                            clearance: '6-feet 7-inches',
                            available: '-'
                        },
                        {
                            id: 2052,
                            name: 'kingsgate garage',
                            entrances: [
                                {
                                    name: 'goodman st entrance',
                                    latitude: 39.13687257444297,
                                    longitude: -84.50778269148674
                                }
                            ],
                            payStation: 'level p1 near garage entrance',
                            clearance: '6-feet 8-inches',
                            available: '-'
                        }
                    ]
                }
            ]
        }
    },
    beforeMount() {
        this.getParkingData()
    },
    computed: {
        parkingApp() {
            if (this.requestStatus === true) {
                this.garageInfo.forEach(campus => {
                    campus.garages.forEach(garage => {
                        const dataIndex = this.parkingData.findIndex(garageData => garageData.FacilityID == garage.id)
                        garage.available = this.parkingData[dataIndex].Occupancy.Available
                    })
                    this.sortByAvailable(campus.garages)
                })
                
            }
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
            this.requestStatus = false
            this.jsonp('https://cso.uc.edu:3000/occupancy')
                .then(data => {
                    data.map(el => {el.Occupancy.map(occ => 
                        {if (occ.OccupancyType === "Transient") {el.Occupancy = occ}}
                    )})
                    this.parkingData = data
                    this.requestStatus = true
                })
        },
        sortByAvailable(garages) {
            return garages.sort((elx, ely) => {
                const elxAvailable = parseInt(elx.available)
                const elyAvailable = parseInt(ely.available)
                if ( elxAvailable < elyAvailable) {return 1}
                if (elxAvailable > elyAvailable) {return -1}
                return 0
            })
        }
    },
}).mount('#app')