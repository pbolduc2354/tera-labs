import React, { Component } from 'react';
import ReactWeather from 'react-open-weather';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Grid, Row, Col, Modal, Button, Form, FormGroup, ControlLabel, FormControl, Panel } from 'react-bootstrap';
import GoogleMapIconGreen from '../map-marker-green.png'
import GoogleMapIconRed from '../map-marker-red.png'
import DataBoard from './Databoard'

const axios = require('axios');

const style = {
  width: '100%',
  height: '100%',
  position: "absolute",

}

class SensorMap extends Component {
  constructor(props) {
    super(props);

    // Functions for the Add Sensors Modal
    this.handleAddSensors = this.handleAddSensors.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.onMarkerClick = this.onMarkerClick.bind(this);


    this.state = {
      markers: [],
      nameValue: "",
      latitudeValue: 0,
      longitudeValue: 0,
      hideSensorInfo: true,
      show: false,  // show state for the Add Sensors Modal
      dbButtonShow: false,
      dataBoard: []
    }
  }


  // *********** ADD SENSORS FEATURE BELOW *********************

  handleAddSensors(e) {
    e.preventDefault();
    const user_id = this.props.currentUser.userId
    const name = this.name.value
    const latitude = this.latitude.value
    const longitude = this.longitude.value
    const set_min_sm = this.set_min_sm.value
    const set_max_sm = this.set_max_sm.value
    const set_min_ae = this.set_min_ae.value
    const set_max_ae = this.set_max_ae.value
    const set_min_st = this.set_min_st.value
    const set_max_st = this.set_max_st.value
    const set_min_ni = this.set_min_ni.value
    const set_max_ni = this.set_max_ni.value
    const set_min_phos = this.set_min_phos.value
    const set_max_phos = this.set_max_phos.value
    const set_min_sa = this.set_min_sa.value
    const set_max_sa = this.set_max_sa.value
    const set_min_re = this.set_min_re.value
    const set_max_re = this.set_max_re.value
    const set_min_pH = this.set_min_pH.value
    const set_max_pH = this.set_max_pH.value
    const set_min_pota = this.set_min_pota.value
    const set_max_pota = this.set_max_pota.value

    axios
      .post(`http://localhost:3001/api/v1/users/${user_id}/group_sensors`, {
        user_id: user_id,
        name: name,
        latitude: latitude,
        longitude: longitude,
        single_sensors: [
          {
            data_type: "Soil Moisture",
            set_min: set_min_sm,
            set_max: set_max_sm,
            data_points: [
              {
                data_value: 0
              }
            ]
          },
          {
            data_type: "Aeration",
            set_min: set_min_ae,
            set_max: set_max_ae,
            data_points: [
              {
                data_value: 0
              }
            ]
          },
          {
            data_type: "Soil Temp",
            set_min: set_min_st,
            set_max: set_max_st,
            data_points: [
              {
                data_value: 0
              }
            ]
          },
          {
            data_type: "Nitrate",
            set_min: set_min_ni,
            set_max: set_max_ni,
            data_points: [
              {
                data_value: 0
              }
            ]
          },
          {
            data_type: "Phosphorus",
            set_min: set_min_phos,
            set_max: set_max_phos,
            data_points: [
              {
                data_value: 0
              }
            ]
          },
          {
            data_type: "Salinity",
            set_min: set_min_sa,
            set_max: set_max_sa,
            data_points: [
              {
                data_value: 0
              }
            ]
          },
          {
            data_type: "Respiration",
            set_min: set_min_re,
            set_max: set_max_re,
            data_points: [
              {
                data_value: 0
              }
            ]
          },
          {
            data_type: "pH",
            set_min: set_min_pH,
            set_max: set_max_pH,
            data_points: [
              {
                data_value: 0
              }
            ]
          },
          {
            data_type: "Potassium",
            set_min: set_min_pota,
            set_max: set_max_pota,
            data_points: [
              {
                data_value: 0
              }
            ]
          }
        ]
      })
      .then(response => {

        // this.props.getGroups(user_id)
        // this.componentWillReceiveProps(this.props.currentUser.userId)
        this.handleClose();
        window.location.reload();
        // let getElement = this.state.markers.length 

        // axios
        //   .get(`http://localhost:3001/api/v1/users/${user_id}/group_sensors/${getElement}`)
        //   .then(response => {
        //     console.log("ressssppppoooonnnnsssseeeee",response.data)
        //       const newMarker = {
        //         id: response.data[0].id,
        //         name: response.data[0].name,
        //         latitude: response.data[0].latitude,
        //         longitude: response.data[0].longitude
        //         // data: response.data[0].
        //       }
        //       this.state.markers.push(newMarker)
        //       // this.setState({ markers: addMarker })
        //   })
        //   .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }

  // Functions for showing and closing the Add Sensors Modal
  handleClose() {
    this.setState({ show: false });
  }
  handleShow() {
    this.setState({ show: true });
  }

  // *********** ADD SENSORS FEATURE ABOVE *********************

  // *************** marker generator Below *********************
  componentWillReceiveProps(nextProps) {
    const groups = nextProps.groups
    if( !this.state.markers[0] || groups[0].id !== this.state.markers[0].id){
      for (var marker of groups) {
  
        const newMarker = {
          id: marker.id,
          name: marker.name,
          latitude: marker.latitude,
          longitude: marker.longitude,
          data: marker.single_sensors,
          alert: 0
        }
  
        for (var sensor of marker.single_sensors) {
          let data_type = sensor.data_type
          let sensorMin = sensor.set_min
          let data_typeMin = data_type + "Min"
  
          let sensorMax = sensor.set_max
          let data_typeMax = data_type + "Max"
  
          const newData = 0;
  
          for (var data of sensor.data_points) {
  
            newData = data.data_value;
  
          }
  
          const newSensorSetting = {
            data_typeMin: sensorMin,
            data_typeMax: sensorMax,
            data_value: newData
          }
          newMarker[data_type] = newSensorSetting
  
        }
        let newCenterPoint = {lat: marker.latitude , lng: marker.longitude}
        const addMarker = this.state.markers.concat(newMarker)
        this.state.markers = addMarker
        this.setState({initialCenterPoint: newCenterPoint})
      }
    }
  }



  // *********** DATABOARD FEATURE *********************

  // *********** DATABOARD FEATURE BELOW *********************

  onMarkerClick(props, marker, e) {
    this.setState({ dbButtonShow: !this.state.dbButtonShow })
    let data = []

    axios
      .get(`http://localhost:3001/api/v1/group_sensors_data/${this.props.currentUser.userId}`)
      .then(res => {
        res.data.group_sensors.filter(x => x.id === marker.id)[0].single_sensors.map(sensor => {
          let mostRecentValue = 0
          if (sensor.data_points.length > 0) {
            mostRecentValue = sensor.data_points.sort((a, b) => { return ((new Date(b.updated_at)) - (new Date(a.updated_at))) })[0].data_value
          }
          console.log('Sensor empty?', sensor.data_points)
          data.push({
            data_type: sensor.data_type,
            data_value: mostRecentValue,
            data_min: sensor.set_min,
            data_max: sensor.set_max
          })
        })
        this.setState({ dataBoard: data })
      })

    if (this.state.isHidden) {
    } else {
    }
    // this.setState({ dataBoard: data })
  }

  render() {
    // *************** return the markers from the state and send it to the final return ****************
    let markers = this.state.markers;
    let types_of_data = ["Aeration", "Nitrate", "Phosphorus", "Potassium", "Respiration", "Salinity", "Soil Moisture", "Soil Temp", "pH"];

    const listOfMarkers = markers.map((item, index) => {
      item.alert = 0;
      for (var dataType of types_of_data) {
        if (item[dataType]) {
          const dataObj = item[dataType]
          if (dataObj.data_value < dataObj.data_typeMin || dataObj.data_value > dataObj.data_typeMax) {
<<<<<<< HEAD
            dataObj.alert = 1;
           item.alert = 1;
=======
            item.alert = 1;

>>>>>>> master
          } else {
            dataObj.alert = 0;
          }


          console.log("hollllaaaaaaaaaaaa",dataObj)
          
        } else {
        }


      }

      // *************** icon change if alert ********************
      if (item.alert === 0) {
        return (
          <Marker onClick={this.onMarkerClick} key={index} name={item.name} id={item.id} icon={GoogleMapIconGreen} position={{ lat: item.latitude, lng: item.longitude }} />
        )
      } else {
        return (
          <Marker onClick={this.onMarkerClick} key={index} name={item.name} id={item.id} icon={GoogleMapIconRed} position={{ lat: item.latitude, lng: item.longitude }} />
        )
      }
    })
<<<<<<< HEAD

   
    console.log("Markerrrrrrrrr",this.state.markers)


=======
>>>>>>> master
    // ***************** Marker generator ***************************

    return (
      <Grid>

        {/* ***************** NOTIFICATION BAR *************************** */}
        <Row>
          <div>
            <Col md={1}></Col>
            <Col md={3}>
              <h3>{this.props.currentUser.companyName}</h3>
            </Col>
            <Col md={1}></Col>
            <Col md={3}>
              <h3>{this.state.markers.length} Units Sensors</h3>
            </Col>
            <Col md={1}></Col>
            <Col md={2}>
              <div>
                <ReactWeather
                  forecast="today"
                  apikey="ba2b14c881784efb99f150704180608"
                  type="geo"
                  lat={this.props.currentUser.latitude}
                  lon={this.props.currentUser.longitude}
                />
              </div>
            </Col>
          </div>
        </Row>
        {/* ***************** NOTIFICATION BAR *************************** */}


        {/* ****************** Add Sensors Modal ****************** */}
        <Row className="add-sensors-row">
          <div className="fixed-bottom">
            <Col md={10}></Col>
            {/* <Row className="add-sensors-row2"> */}
            <Col className="add-sensors-col">

<<<<<<< HEAD
              <div className="modal-container" >
=======
              <div className="modal-container">
>>>>>>> master
                <Button
                  className="modal-container-button"
                  // positon="float right"
                  bsStyle="primary"
                  bsSize="medium"
                  onClick={() => this.setState({ show: true })}
                >
                  Add Sensors
              </Button>
                {/* <Col md={2}></Col> */}

                <Modal show={this.state.show} onHide={this.handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Sensors</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>

                    <Form horizontal>
                      <FormGroup controlId="formHorizontalName">
                        <Col componentClass={ControlLabel} sm={2}>
                          Name
                            </Col>
                        <Col sm={10}>
                          <FormControl inputRef={(ref) => { this.name = ref }} name="name" type="text" placeholder="Name" />
                        </Col>
                      </FormGroup>

                      <FormGroup controlId="formHorizontalLocation">
                        <Col componentClass={ControlLabel} sm={2}>
                          Location
                            </Col>
                        <Col sm={5}>
                          <FormControl inputRef={(ref) => { this.latitude = ref }} name="latitude" type="text" placeholder="Latitude" />
                        </Col>
                        <Col sm={5}>
                          <FormControl inputRef={(ref) => { this.longitude = ref }} name="longitude" type="text" placeholder="Longitude" />
                        </Col>
                      </FormGroup>

                      <FormGroup controlId="formHorizontalLocation">
                        <Col componentClass={ControlLabel} sm={2}>
                        </Col>
                        <Col componentClass={ControlLabel} sm={3}>
                          Minimum
                            </Col>
                        <Col componentClass={ControlLabel} sm={5}>
                          Maximum
                            </Col>
                      </FormGroup>

                      <FormGroup controlId="formHorizontalMoisture">
                        <Col componentClass={ControlLabel} sm={2}>
                          Moisture
                            </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_min_sm = ref }} name="min" type="text" defaultValue="0.2" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          awc
                            </Col>
                        <Col componentClass={ControlLabel} sm={2}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_max_sm = ref }} name="max" type="text" defaultValue="0.8" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          awc
                            </Col>
                      </FormGroup>

                      <FormGroup controlId="formHorizontalAeration">
                        <Col componentClass={ControlLabel} sm={2}>
                          Aeration
                            </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_min_ae = ref }} name="min" type="text" defaultValue="15" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          %
                            </Col>
                        <Col componentClass={ControlLabel} sm={2}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_max_ae = ref }} name="max" type="text" defaultValue="23" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          %
                            </Col>
                      </FormGroup>

                      <FormGroup controlId="formHorizontalSoilTemp">
                        <Col componentClass={ControlLabel} sm={2}>
                          Temperature
                            </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_min_st = ref }} name="min" type="text" defaultValue="44" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          °F
                            </Col>
                        <Col componentClass={ControlLabel} sm={2}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_max_st = ref }} name="max" type="text" defaultValue="58" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          °F
                            </Col>
                      </FormGroup>

                      <FormGroup controlId="formHorizontalNitrate">
                        <Col componentClass={ControlLabel} sm={2}>
                          Nitrate
                            </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_min_ni = ref }} name="min" type="text" defaultValue="74" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          ppm
                            </Col>
                        <Col componentClass={ControlLabel} sm={2}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_max_ni = ref }} name="max" type="text" defaultValue="89" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          ppm
                            </Col>
                      </FormGroup>

                      <FormGroup controlId="formHorizontalPhosphorus">
                        <Col componentClass={ControlLabel} sm={2}>
                          Phosphorus
                            </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_min_phos = ref }} name="min" type="text" defaultValue="74" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          ppm
                            </Col>
                        <Col componentClass={ControlLabel} sm={2}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_max_phos = ref }} name="max" type="text" defaultValue="89" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          ppm
                            </Col>
                      </FormGroup>

                      <FormGroup controlId="formHorizontalSalinity">
                        <Col componentClass={ControlLabel} sm={2}>
                          Salinity
                            </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_min_sa = ref }} name="min" type="text" defaultValue="0.4" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          dS/m
                            </Col>
                        <Col componentClass={ControlLabel} sm={2}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_max_sa = ref }} name="max" type="text" defaultValue="1" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          dS/m
                            </Col>
                      </FormGroup>

                      <FormGroup controlId="formHorizontalRespiration">
                        <Col componentClass={ControlLabel} sm={2}>
                          Respiration
                            </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_min_re = ref }} name="min" type="text" defaultValue="0.02" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          %
                            </Col>
                        <Col componentClass={ControlLabel} sm={2}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_max_re = ref }} name="max" type="text" defaultValue="0.08" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          %
                            </Col>
                      </FormGroup>

                      <FormGroup controlId="formHorizontalpH">
                        <Col componentClass={ControlLabel} sm={2}>
                          pH
                            </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_min_pH = ref }} name="min" type="text" defaultValue="6" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={3}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_max_pH = ref }} name="max" type="text" defaultValue="7" />
                        </Col>
                      </FormGroup>

                      <FormGroup controlId="formHorizontalPotassium">
                        <Col componentClass={ControlLabel} sm={2}>
                          Potassium
                            </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_min_pota = ref }} name="min" type="text" defaultValue="80" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          ppm
                            </Col>
                        <Col componentClass={ControlLabel} sm={2}>
                        </Col>
                        <Col sm={2}>
                          <FormControl inputRef={(ref) => { this.set_max_pota = ref }} name="max" type="text" defaultValue="90" />
                        </Col>
                        <Col componentClass={ControlLabel} sm={1}>
                          ppm
                            </Col>
                      </FormGroup>
                    </Form>

                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      bsStyle="primary"
<<<<<<< HEAD
                      bsSize="large"
                      onClick={this.handleAddSensors }>Submit</Button>
=======
                      bsSize="medium"
                      onClick={this.handleAddSensors}>Submit</Button>
>>>>>>> master
                  </Modal.Footer>
                </Modal>
              </div>

            </Col>
            {/* </Row> */}
            <Col md={1}></Col>
          </div>
        </Row>
        {/* ****************** End of Add Sensors Modal ****************** */}

        <Row>
          <Col md={1}></Col>
          <Col md={3}>

            {/* **************** Databoard ****************** */}

            <DataBoard groups={this.props.groups} currentUser={this.props.currentUser} groupID={this.state.groupID} dataBoard={this.state.dataBoard} markers={this.state.markers} dbButtonShow={this.state.dbButtonShow} />


            {/* **************** Databoard ****************** */}

          </Col>

          {/* **************** MAP ************** */}

          <Col md={7}>
            <div className="embed-responsive map-wrapper container">
              <div className="col"></div>
              <Map className="embed-responsive-item"
                google={this.props.google}
                style={style}
<<<<<<< HEAD
                initialCenter={
                  this.state.initialCenterPoint
                }
=======
                initialCenter={{
                  lat: this.props.currentUser.latitude,
                  lng: this.props.currentUser.longitude
                }}
>>>>>>> master
                zoom={15}
                onClick={this.onMapClicked}
              >
                {listOfMarkers}
              </Map>
              <div className="col"></div>
            </div>

          </Col>
          <Col md={1}></Col>

          {/* **************** MAP ************** */}

        </Row>

      </Grid >
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCRmv6SaTr9BTMU7yeXHarnU3v5zYGaLMk")
})(SensorMap)
