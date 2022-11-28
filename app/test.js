

// Each Occupancy type (transient, non-trans, etc)
var Occupancy = React.createClass({
    render: function() {
    }
});

// Each Garage
var Garage = React.createClass({
    render: function() {
        // Because IE won't let me have nice things...
        for (var i in this.props.garage.Occupancy) {
            var occ = this.props.garage.Occupancy[i];
            if (occ.OccupancyType == 'Transient') {
                var occupancy = occ;
            }
        }

        if (typeof occupancy != 'undefined') {
            // Check for invalid numbers
            var occupied = Number(occupancy.Occupied);
            var capacity = Number(occupancy.Capacity);

            if (occupied < 0) {occupied = 0;}
            if (capacity < 0) {capacity = 0;}
            if (occupied > capacity) {occupied = capacity;}

            var count = Math.floor((occupied / capacity)*100);
            if (isNaN(count)) { count = 100 } // set garage to full if numbers don't make sense

            // Levels to change colors
            var fullLevel = 100;
            var warnLevel = 75;
            var openLevel = 50;

            // Colors
            var fullColor = '#E00122'; //RED
            var warnColor = '#FFAE27'; //YELLOW
            var openColor = '#412DE9'; //BLUE
            var emptyColor = '#0A640B'; // GREEN

            // Styles
            var barWidth = 12;
            var counterWidth = 3;

            var labelStyle = {
            };
            var barStyle = {
                width: count+'%'
            };
            var containerStyle = {
                width: barWidth+'em'
            };

            // Adjust counter position
            var countStyle = {
                width: counterWidth+'em',
            };
            if ((count*barWidth)/100 + (counterWidth/2) > barWidth) {
                countStyle.right = counterWidth+'em';
            } else if ((count*barWidth)/100 - (counterWidth/2) < 0) {
                countStyle.left = 0;
            } else {
                countStyle.right = (counterWidth/2)+'em';
            }

            if (count >= fullLevel) {
                labelStyle.color = fullColor;
                barStyle.backgroundColor = fullColor;
            //} else if (count >= warnLevel) {
            //    labelStyle.color = warnColor;
            //    barStyle.backgroundColor = warnColor;
            } else if (count >= openLevel) {
                labelStyle.color = openColor;
                barStyle.backgroundColor = openColor;
            } else if (count > 0) {
                labelStyle.color = emptyColor;
                barStyle.backgroundColor = emptyColor;
            } else {
                labelStyle.color = emptyColor;
                barStyle.display = 'none';
            }
            return (
                <div className="garage">
                    <div className="label">{this.props.garage.Description.replace('Garage', '').trim()}</div>
                    <div className="bar_container" style={containerStyle}>
                        <div className="bar" style={barStyle}></div>
                        <div className="count" style={countStyle}>{count}%</div>
                    </div>
                </div>
            );
        } else {
            return (
                null
            );
        }
    }
});

// Full container
var CapacityMonitor = React.createClass({
    getInitialState: function() {
        return {garages: []};
    },
    populateGarages: function() {
        const loadGarages = function loadGarages(data) {
        this.setState({
            garages:data,
            updateTime:new Date(data[0].Occupancy[0].Timestamp)
        });
        }.bind(this)

        $.ajax({
            url: this.props.apiUrl,
            type: "GET",
            dataType: 'jsonp',
            cache: false,
            success: loadGarages,
            error: function(xhr, status, err) {
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.populateGarages();
        if (this.props.pollInterval != undefined && this.props.pollInterval != null) {
            setInterval(this.populateGarages, this.props.pollInterval);
        }
    },
    updateTime: function() {
        var updateTime;
        if (this.state.updateTime) {
            var hour = this.state.updateTime.getHours();
            var marker = 'a.m.'

            if (hour >= 12) {
                hour -= 12;
                marker = 'p.m.'
            }

            if (hour === 0) {
                hour = 12;
            }

            var minute = this.state.updateTime.getMinutes();
            if (minute < 10) { minute = '0'+minute; }

            updateTime = hour+':'+minute+' '+marker;
            updateTime = 'Last Updated: '+updateTime;
        }
        return updateTime;
    },
    render: function() {
        var garageNodes = this.state.garages.map(function(garage) {
            if (garage.FacilityID != "2061") {
                return (
                    <Garage garage={garage} key={garage.FacilityID} />
                );
            }
        });
        return (
            <div>
                {garageNodes}
                <div className="time">{this.updateTime()}</div>
            </div>
        );
    }
});

ReactDOM.render(
    // Add pollInterval value for polling
    <CapacityMonitor apiUrl='https://cso.uc.edu:3000/occupancy' />,
    document.getElementById('monitor')
);