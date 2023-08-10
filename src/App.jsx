import { MapContainer, GeoJSON } from "react-leaflet"
import mapData from "./data/countries.json"
import "./App.css"
import CountryInfo from "./componets/CountryInfo"
import { useDispatch, useSelector } from "react-redux"
import { countryNameAction } from "./store/store"
import { useEffect, useRef } from "react"
import useStableCallback from "./hooks/useStableCallback"

function App() {
  const dispatch = useDispatch()
  const name = useSelector((state) => state.countryName.name)

  // this is used to get the latest data for GeoJSON it is also a workaround
  const geoJsonLayer = useRef(null);

  const countryClickHandler = (country) => async (event) => {
    try {
      event.target.setStyle({
        fillColor: "red",
      })

      const countryName = country.properties.ADMIN

      // updating country name in redux state
      dispatch(countryNameAction.setCountryName({ countryName }))

    } catch (err) {
      console.log("error", err)
      event.target.setStyle({
        fillColor: "white",
      })
    }
  }



  const onEachFeature = (country, layer) => {
    if (name) {
      if (country.properties.ADMIN.toLowerCase() === name.toLowerCase()) {
        layer.options.fillColor = "red"
      }
    }

    layer.on({
      click: countryClickHandler(country),
    })
  }

  // useStableCallback hook is used to provide latest state of component to the function 
  // there is some issue with GeoJSON internal state closure more info on
  // github issue ( https://github.com/PaulLeCam/react-leaflet/issues/697 )
  const stableOnEachFeature = useStableCallback(onEachFeature)


  useEffect(() => {
    //in this we are clearing the layers and adding new ones so that we always have updated data 
    if (geoJsonLayer.current) {
      geoJsonLayer.current.clearLayers().addData(mapData.features);
    }
  }, [name,dispatch,geoJsonLayer]);

  const countryStyles = {
    fillColor: "white",
    fillOpacity: 1,
    color: "black",
    weight: 1,
  }


  return (
    <div className="w-[95%] m-auto">
      <h1 className="text-3xl font-semibold text-center pt-5">Get information about any country by simply clicking on the map.</h1>
      <div className="absolute top-20 flex gap-2 max-md:flex-col max-md:gap-5 max-md:top-[100px] ">
        <MapContainer center={[51.505, -0.09]} zoom={2} minZoom={2} scrollWheelZoom={true} className="min-w-[70vw] h-[90vh] max-md:w-full max-md:h-[400px] max-md:min-w-[100vw]">
          <GeoJSON ref={geoJsonLayer} style={countryStyles} data={mapData.features} onEachFeature={stableOnEachFeature} />
        </MapContainer>
        <CountryInfo />
      </div>
    </div>
  )
}

export default App
