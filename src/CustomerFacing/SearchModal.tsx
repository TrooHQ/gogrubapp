import CloseLineIcon from "remixicon-react/CloseLineIcon";
import { IoIosBackspace } from "react-icons/io";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function SearchModal({ setShowSearch, allMenuItems, business_identifier }: { setShowSearch: (show: boolean) => void, allMenuItems: { name: string, id: string }[], business_identifier: string | null }) {

  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }

  return (
    <div className="fixed top-0 left-0 w-full z-[51] h-full bg-white py-6 ">

      <div className="px-4 border-b border-b-200 pb-4 relative">
        <div className="w-full relative">

          <input
            className="w-full h-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            type="text"
            placeholder="Search for items"
            autoComplete=""
            value={searchValue}
            onChange={handleSearch}
          />
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
            {searchValue.length > 0 ? (
              <IoIosBackspace
                className="w-6 h-6 text-black rounded-full cursor-pointer"
                onClick={() => setSearchValue('')}
              />
            ) :
              <CloseLineIcon
                className=" w-6 h-6 text-white bg-black rounded-full cursor-pointer"
                onClick={() => setShowSearch(false)}
              />}
          </div>
        </div>
      </div>
      <div className="px-4">
        {searchValue.trim().length === 0 ? (
          <div className="py-2 text-sm text-gray-500 flex flex-col items-center justify-center gap-2 h-[80vh]">
            <p>Search for menu items</p>
            <p className="text-xs">Start typing in the box above</p>
          </div>
        ) : (
          <>
            {allMenuItems
              .filter((i) => i.name.toLowerCase().includes(searchValue.trim().toLowerCase()))
              .map((item) => (
                <Link to={`/item-details?id=${item.id}&bid=${business_identifier}`} key={item.id} className="py-2 text-gray-800 "
                // onClick={}
                >
                  {item.name}
                </Link>
              ))}
            {allMenuItems.filter((i) => i.name.toLowerCase().includes(searchValue.trim().toLowerCase())).length === 0 && (
              <div className="py-2 text-sm text-gray-500 flex flex-col items-center justify-center gap-2 h-[80vh]">
                <p>No result found for</p>
                <p className="text-base text-gray-900 font-semibold">"{searchValue.trim()}"</p>
                <img
                  src="/bev.png"
                  alt="no result"
                  className="w-24 mx-auto"
                />
                <p>Try Searching for Something Else</p>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  )
}
