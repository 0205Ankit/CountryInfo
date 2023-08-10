import { BiSearch } from "react-icons/bi"
import mapData from "../data/countries.json"
import { useCallback, useEffect, useState } from "react"
import _ from "lodash"
import { useDispatch } from "react-redux"
import { countryNameAction } from "../store/store"

export default function Input() {
    const [filterData, setFilterData] = useState()
    const allCountryNames = mapData.features.map(item => item.properties.ADMIN)
    const [input, setInput] = useState("")
    const dispatch = useDispatch()

    useEffect(() => {
        if (input) {
            const filteredData = allCountryNames.filter(item => item.toLowerCase().includes(input.toLowerCase()))
            setFilterData(filteredData)
            return
        }
        if (input.length === 0) {
            setFilterData(undefined)
            return
        }
    }, [input])

    const inputHandler = useCallback((e) => {
        setInput(e.target.value)
    }, [])

    const debounceHandler = _.debounce(inputHandler, 600)

    // used when user select from the dropdown menu
    const selectNameHandler = (name) => {
        setInput("")
        setFilterData(undefined)
        //// updating country name in redux state
        dispatch(countryNameAction.setCountryName({ countryName: name }))
    }

    // used when user enters whole value and press enter
    const submitHandler = (e) => {
        e.preventDefault()
        setInput("")
        setFilterData(undefined)

        //if the input value does not have any matching then user should not be able to submit the form
        if (filterData?.length === 0) {
            setFilterData(undefined)
            setInput("")
            return
        }
        // updating country name in redux state
        dispatch(countryNameAction.setCountryName({ countryName: input }))
    }



    return <form onSubmit={submitHandler} className="relative">
        <label htmlFor="search" className="p-2 flex gap-3 items-center border-[1px] border-black mx-5 rounded-md">
            <BiSearch />
            <input onChange={debounceHandler} type="text" className="outline-none border-none w-full" id="search" placeholder="search" />
        </label>
        <div className="absolute top-10 mx-5 w-[90%] z-10">
            {
                filterData?.length > 0 ? <>
                    {
                        filterData.map((item, i) => {
                            return <p key={i} value={input} onClick={() => selectNameHandler(item)} className="px-5 cursor-pointer hover:bg-slate-300 py-1 border-[0.5px] border-black bg-white">{item}</p>
                        })
                    }
                </> : <>{filterData && <p className="px-5  py-1 border-[0.5px] border-black bg-white">No items match for your search</p>}</>
            }

        </div>
    </form>
}