import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
const getListImgFromAPI = async (page, query) => {
  const _query = query || "a";
  const response = await axios.get(
    `https://api.unsplash.com/search/photos?query=${_query}&page=${page}&per_page=8&client_id=YqLEK4C5P--fyKC4bwk3Lazp0H3kU6-ENSmcAZljVfM`
  );
  return response.data;
};

const Photos = () => {
  const [images, setImages] = useState([]);
  const [page, setNextPage] = useState(1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoadMore = useRef({});
  handleLoadMore.current = async () => {
    setLoading(true);
    const res = await getListImgFromAPI(page, query);
    const listImage = res.results;
    const uniqueList = [...images, ...listImage].reduce((acc, curr) => {
      if (!acc[curr.id]) {
        acc[curr.id] = curr;
      }
      return acc;
    }, {});
    setImages([...Object.values(uniqueList)]);
    setNextPage((prev) => prev + 1);
    setLoading(false);
  };

  useEffect(() => {
    // Call api
    handleLoadMore.current();
  }, []);

  const handleSetQuery = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    setNextPage(1);
    const res = await getListImgFromAPI(page, query);
    const listImage = res.results;
    setImages([...listImage]);
    setLoading(false);
  };

  return loading ? (
    <div className="w-[40px] h-[40px] border-t-blue-600 border-[4px] rounded-full animate-spin mx-auto mt-[20px]"></div>
  ) : (
    <div>
      <div className="max-w-[300px] mx-auto my-[20px] flex gap-x-10">
        <input
          className="w-full border-solid border-2 border-indigo-600 px-[10px] py-[10px]"
          placeholder="Enter here to search"
          value={query}
          onChange={handleSetQuery}
        />
        <button className="bg-blue-500 text-white px-[20px]" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="grid grid-cols-4 gap-x-4 gap-y-4 px-5 py-5">
        {images.map((image, index) => {
          return (
            <div key={index} className="h-[400px] bg-white rounded-lg shadow-lg">
              <img
                src={image.urls.full}
                alt={image.alt_description}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          );
        })}
      </div>
      <div className="text-center px-5 py-5">
        <button className="inline-block px-4 py-3 text-cyan-50 bg-purple-600" onClick={handleLoadMore.current}>
          LOAD MORE
        </button>
      </div>
    </div>
  );
};

export default Photos;
