import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux/es/hooks/useSelector"
import Input from "./Input"

export default function CountryInfo() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [countryData, setCountryData] = useState()

    // fetching name from the redux store
    const name = useSelector(state => state.countryName.name)

    let currency
    let languages = ""
    let timezone = ""

    useEffect(() => {
        if (name) {
            const fetchDetail = async () => {
                try {
                    setIsLoading(true)
                    // replace all the spaces from name so the api can understand the name
                    const editedName = name.replaceAll(" ", "%20")

                    const { data } = await axios.get(`https://restcountries.com/v3.1/name/${editedName}?fullText=true`)

                    // setting the data from the api to a internal state
                    setCountryData(data[0])
                    setIsLoading(false)
                } catch (err) {
                    console.log(err)
                    setError("Something Went Wrong ...")
                }
            }

            fetchDetail()
        }
    }, [name])

    if (countryData) {
        for (const key in countryData.currencies) {
            currency = `${countryData.currencies[key].symbol} , ${key} , ${countryData.currencies[key].name} `
        }

        for (const key in countryData.languages) {
            languages = languages + ` ${countryData.languages[key]} ,`
        }

        for (const zone of countryData.timezones) {
            timezone = timezone + ` ${zone} ,`
        }
    }


    return <div>
        <Input />
        <div className="p-10 relative">
            {!countryData && <h1 className="text-xl font-bold text-center">Get details of any Country just by clicking on the Map or by searching the name</h1>}
            {
                isLoading ? <>
                    <img className="mt-10 w-[50px] absolute left-[50%] -translate-x-[50%]" src="/loading.svg" alt="loading" />
                </> : <>
                    {
                        (countryData && !error) ? <div className="flex flex-col gap-4 items-center ">
                            <h1 className="text-3xl font-bold text-center">{countryData.name.common}</h1>
                            <img className="w-[150px] shadow-2xl" src={`${countryData.flags.svg}`} alt={`${countryData.flags.alt}`} />
                            <p><span className="text-lg font-semibold">Capital : </span>{countryData.capital[0]} </p>
                            <p><span className="text-lg font-semibold">Currencies : </span>{currency} </p>
                            <p><span className="text-lg font-semibold">Population : </span>{countryData.population.toLocaleString()} </p>
                            <p><span className="text-lg font-semibold">LatLng : </span>{countryData.latlng[0] + " , " + countryData.latlng[1]} </p>
                            <p><span className="text-lg font-semibold">Area : </span>{countryData.area} </p>
                            <p><span className="text-lg font-semibold">Languages : </span>{languages} </p>
                            <p className=""><span className="text-lg font-semibold">TimeZones : </span>{timezone} </p>
                            <p className=""><span className="text-lg font-semibold">Region : </span>{countryData.region} </p>
                        </div> : <>
                                    <h1 className="text-3xl font-bold text-center">{error}</h1>
                        </>
                    }
                </>
            }
            <div>
            </div>
        </div>
    </div>
}