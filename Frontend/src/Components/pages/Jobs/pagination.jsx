import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex m-3 justify-center items-center gap-2 mt-10 flex-wrap">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                aria-label="Previous page"
                className="h-10 w-10 p-0 rounded-md flex items-center justify-center bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <FaChevronLeft className="w-4 h-4" />
            </button>

            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={loading}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`h-10 w-10 p-0 rounded-md flex items-center justify-center text-sm font-medium transition
                        ${currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                aria-label="Next page"
                className="h-10 w-10 p-0 rounded-md flex items-center justify-center bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <FaChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;
