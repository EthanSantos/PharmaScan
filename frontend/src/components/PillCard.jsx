import React from "react"

const PillCard = ({ name, imageUrl }) => {
    return (
        <div className="bg-white shadow-sm hover:shadow-md rounded-lg overflow-hidden flex flex-col transition-all duration-200 ease-in-out transform hover:scale-105 border border-gray-200">
            <div className="relative w-full pt-[100%]">
                <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
            </div>
            <div className="p-4 flex-grow">
                <h2 className="text-lg font-medium text-gray-900 truncate">{name}</h2>
            </div>
        </div>
    )
}

export default PillCard

