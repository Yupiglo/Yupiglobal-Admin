import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const [inputPage, setInputPage] = useState<number | string>("");

  const handlePageClick = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10); // Convert to integer
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      setInputPage(value);
    } else {
      setInputPage(""); // Clear input if out of range
    }
  };

  const handleGoClick = () => {
    const pageNumber = Number(inputPage);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
    setInputPage("");
  };

  // Define the dynamic middle three pages
  let pagesToShow: number[] = [];
  if (currentPage === 1) {
    pagesToShow = [currentPage, currentPage + 1, currentPage + 2].filter(
      (p) => p < totalPages
    );
  } else if (currentPage === totalPages) {
    pagesToShow = [currentPage - 2, currentPage - 1, currentPage].filter(
      (p) => p > 1
    );
  } else {
    pagesToShow = [currentPage - 1, currentPage, currentPage + 1].filter(
      (p) => p >= 1 && p <= totalPages
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* First Page Button */}
       {/* Previous Button */}
       {totalPages > 1 && (
        <button
          className={`p-1 border rounded ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200"
          }`}
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </button>
      )}
      {currentPage >= 2 && (
        <>
          <button
            className="px-3 py-1 border rounded hover:bg-gray-200"
            onClick={() => handlePageClick(1)}
          >
            1
          </button>
          <span className="font-bold opacity-30 text-2xl align-bottom">
            ...
          </span>
        </>
      )}

     

      {/* Dynamic Middle Page Numbers (Previous, Current, Next) */}
      {pagesToShow.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 border rounded ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      ))}

{/* Last Page Button */}
{currentPage <= totalPages - 1 && (
        <>
          <span className="font-bold opacity-30 text-2xl align-bottom">
            ...
          </span>
          <button
            className="px-3 py-1 border rounded hover:bg-gray-200"
            onClick={() => handlePageClick(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}
      {/* Next Button */}
      {totalPages > 1 && (
        <button
          className={`p-1 border rounded ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200"
          }`}
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </button>
      )}

      

      {/* Page Input + Go Button */}
      {totalPages > 1 && (
        <div className="flex items-center gap-4">
          <form className="relative w-fit ml-5">
            <input
              type="text"
              id="searchPage"
              className="block px-2 py-1 w-fit z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-s-gray-100 rounded-l-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
              placeholder="Enter Page No."
              value={inputPage}
              onChange={handleInputChange}
              min="1"
              max={totalPages.toString()}
            />
            <button
              type="submit"
              className="absolute top-0 end-0 px-2 py-1 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
              onClick={handleGoClick}
              disabled={
                !inputPage ||
                Number(inputPage) < 1 ||
                Number(inputPage) > totalPages
              }
            >
              Go
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Pagination;
