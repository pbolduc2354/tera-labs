import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Grid, Row, Col, Modal, Button, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Popup from "reactjs-popup";
import GoogleMapIconGreen from '../map-marker-green.png'
import GoogleMapIconRed from '../map-marker-red.png'
const axios = require('axios');


const style = { // Styling the map.
  width: '100%',
  height: '100%',
  position: "absolute",
  zIndex: "3",
}


class SensorMap extends Component {
  constructor(props) {
    super(props);

    this.handleValueName = this.handleValueName.bind(this);
    this.handleValueLatitude = this.handleValueLatitude.bind(this);
    this.handleValueNLongitude = this.handleValueLongitude.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.getGroupFromJSON = this.getGroupFromJSON.bind(this);
    this.getSensorsFromJSON = this.getSensorsFromJSON.bind(this);
    this.getDataPointsFromJSON = this.getDataPointsFromJSON.bind(this);
    this.getGroupFromJSON()
    this.getSensorsFromJSON()
    this.getDataPointsFromJSON()

    // Functions for the Add Sensors Modal
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      markers: [],
      nameValue: "",
      latitudeValue: 0,
      longitudeValue: 0,
      hideSensorInfo: true,
      show: false  // show state for the Add Sensors Modal
    }
  }

  getGroupFromJSON() {
    axios
      .get("http://localhost:3001/api/v1/users/1/group_sensors") // getting the group sensor data
      .then(response => {
        // console.log(response)
        for (var marker of response.data) {
          // console.log(marker)
          const newMarker = { id: marker.id, name: marker.name, latitude: marker.latitude, longitude: marker.longitude }
          const addMarker = this.state.markers.concat(newMarker)
          this.setState({ markers: addMarker })

        }
        console.log(this.state.markers)
      })
      .catch(error => console.log(error));
  }

  getSensorsFromJSON() {
    axios
      //each groupSensor has 9 sensors. Each sensor represents an element(object)
      .get("http://localhost:3001/api/v1/users/1/group_sensors/1/single_sensors") //getting all the sensors
      .then(response => {

        for (var groupSensor of this.state.markers) {
          for (var sensor of response.data) {
            if (groupSensor.id === sensor.group_sensor_id) {

              let data_type = sensor.data_type
              let sensorMin = sensor.set_min // assigning min to a variable
              let data_typeMin = data_type + "Min" // assigning a data_type + a string called min to a variable
              groupSensor[data_typeMin] = sensorMin // passing data_typeMin as a key in the groupSensor object, setting its value to sensorMin

              let sensorMax = sensor.set_max // same concept as line 84 to 86
              let data_typeMax = data_type + "Max"
              groupSensor[data_typeMax] = sensorMax


            }
          }
          console.log(groupSensor)
        }
      })
      .catch(error => console.log(error));
  }

  getDataPointsFromJSON() {
    for (var i = 0; i < 10; i++) {
      axios
        .get(`http://localhost:3001/api/v1/users/1/group_sensors/1/single_sensors/${i}/datapoints`)
        .then(response => {

          for (var dataPoints of response.data) {
            const marker = this.state.markers
            // groupSensor[data_type] = dataPoints.data_value

          }
          // console.log(this.state.markers)

          // let data_type = sensor.data_type
          // groupSensor[data_type] = sensor.data_value

        })
        .catch(error => console.log(error));
    }
  }


  onMarkerClick(props, marker, e) {
    this.setState({ isHidden: !this.state.isHidden })

    console.log(marker);
    console.log(marker.id);
    // console.log(marker.name)

    if (this.state.isHidden) {
      console.log("is hidden")
    } else {
      console.log("is shown")
    }
  }

  handleValueName = e => {
    console.log(e.target.value)
    this.setState({ nameValue: e.target.value });
  }
  handleValueLatitude = e => {
    console.log(e.target.value)
    this.setState({ latitudeValue: e.target.value });
  }
  handleValueLongitude = e => {
    console.log(e.target.value)
    this.setState({ longitudeValue: e.target.value });
  }

  handleNewMarker = e => {
    console.log(this.state.latitudeValue)
    const newMarker = { id: this.state.id, name: this.state.nameValue, latitude: this.state.latitudeValue, longitude: this.state.longitudeValue }
    const addMarker = this.state.markers.concat(newMarker)
    this.setState({ markers: addMarker })
    this.state.nameValue = "";
    this.state.latitudeValue = 0;
    this.state.longitudeValue = 0;
    e.preventDefault();
  }

  // Functions for showing and closing the Add Sensors Modal
  handleClose() {
    this.setState({ show: false });
  }
  handleShow() {
    this.setState({ show: true });
  }


  render() {

    // let iconMarker = new window.google.maps.MarkerImage(
    //   url,
    //   null, /* size is determined at runtime */
    //   null, /* origin is 0,0 */
    //   null, /* anchor is bottom center of the scaled image */
    //   new window.google.maps.Size(32, 32)
    // );


    // *************** return the markers from the state and send it to the final return ****************
    let markers = this.state.markers

    const listOfMarkers = markers.map((item, index) => {
      return (
        <Marker onClick={this.onMarkerClick} key={index} id={item.id} name={item.name} icon={GoogleMapIconRed} position={{ lat: item.latitude, lng: item.longitude }} />

      )
    })


    // ***************** final return ***************************
    return (
      <Grid>
        <Row>
          <Col md={9}></Col>
          <Col md={2}>

            {/* ****************** Add Sensors Modal ****************** */}
            <div className="modal-container" style={{ height: 200 }}>
              <Button
                bsStyle="primary"
                bsSize="large"
                onClick={() => this.setState({ show: true })}
              >
                Add Sensors
            </Button>

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
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="name" type="text" placeholder="Name" />
                      </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalLocation">
                      <Col componentClass={ControlLabel} sm={2}>
                        Location
                            </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="latitude" type="text" placeholder="Latitude" />
                      </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="longitude" type="text" placeholder="Longitude" />
                      </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalMoisture">
                      <Col componentClass={ControlLabel} sm={2}>
                        Moisture
                            </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="min" type="text" placeholder="Min" />
                      </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="max" type="text" placeholder="Max" />
                      </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalAeration">
                      <Col componentClass={ControlLabel} sm={2}>
                        Aeration
                            </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="min" type="text" placeholder="Min" />
                      </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="max" type="text" placeholder="Max" />
                      </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalSoilTemp">
                      <Col componentClass={ControlLabel} sm={2}>
                        Temperature
                            </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="min" type="text" placeholder="Min" />
                      </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="max" type="text" placeholder="Max" />
                      </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalNitrate">
                      <Col componentClass={ControlLabel} sm={2}>
                        Nitrate
                            </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="min" type="text" placeholder="Min" />
                      </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="max" type="text" placeholder="Max" />
                      </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalPhosphorus">
                      <Col componentClass={ControlLabel} sm={2}>
                        Phosphorus
                            </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="min" type="text" placeholder="Min" />
                      </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="max" type="text" placeholder="Max" />
                      </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalSalinity">
                      <Col componentClass={ControlLabel} sm={2}>
                        Salinity
                            </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="min" type="text" placeholder="Min" />
                      </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="max" type="text" placeholder="Max" />
                      </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalRespiration">
                      <Col componentClass={ControlLabel} sm={2}>
                        Respiration
                            </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="min" type="text" placeholder="Min" />
                      </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="max" type="text" placeholder="Max" />
                      </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalpH">
                      <Col componentClass={ControlLabel} sm={2}>
                        pH
                            </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="min" type="text" placeholder="Min" />
                      </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="max" type="text" placeholder="Max" />
                      </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalPotassium">
                      <Col componentClass={ControlLabel} sm={2}>
                        Potassium
                            </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="min" type="text" placeholder="Min" />
                      </Col>
                      <Col sm={5}>
                        <FormControl inputRef={(ref) => { this.first_name = ref }} name="max" type="text" placeholder="Max" />
                      </Col>
                    </FormGroup>
                  </Form>

                </Modal.Body>
                <Modal.Footer>
                  <Button
                    bsStyle="primary"
                    bsSize="large"
                    onClick={this.handleSubmit}>Submit</Button>
                </Modal.Footer>
              </Modal>

              {/* <Popup trigger={<button> Add sensor</button>} position="right center" modal closeOnDocumentClick>
              {close => (
                <div>
                  <form onSubmit={this.handleNewMarker.bind(this)}>
                    <label>
                      Name:
                            <input type="text" value={this.state.nameValue} onChange={this.handleValueName} />
                    </label>
                    <label>
                      Latitude:
                            <input type="number" value={this.state.latitudeValue} onChange={this.handleValueLatitude} />
                      <input type="number" value={this.state.latitudeValue} onChange={this.handleValueLatitude} />
                    </label>
                    <label>
                      Longitude:
                            <input type="number" value={this.state.longitudeValue} onChange={this.handleValueLongitude} />
                    </label>
                    <input type="submit" value="Submit" />
                    <input type="button" value="close" onClick={() => {
                      console.log('modal closed ')
                      close()
                    }} />
                  </form>
                </div>
              )}
            </Popup> */}

            </div>
            {/* ****************** End of Add Sensors Modal ****************** */}

          </Col>
          <Col md={1}></Col>
        </Row>

        <Row>
          <Col md={1}></Col>
          <Col md={3}>
            <div className="databoard">
              <p>
                Thierry's databoard
                  </p>
            </div>
          </Col>
          <Col md={7}>
            <div className="embed-responsive map-wrapper container">
              <div className="col"></div>
              <Map className="embed-responsive-item"
                google={this.props.google}
                style={style}
                initialCenter={{
                  lat: 45.212059,
                  lng: -73.738771
                }}
                zoom={15}
                onClick={this.onMapClicked}
              >
                <Marker onClick={this.onMarkerClick}
                  name={'Current location'} />
                {listOfMarkers}
              </Map>
              <div className="col"></div>
            </div>
          </Col>
          <Col md={1}></Col>
        </Row>


      </Grid>

    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCRmv6SaTr9BTMU7yeXHarnU3v5zYGaLMk")
})(SensorMap)
