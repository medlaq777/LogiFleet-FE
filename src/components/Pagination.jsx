import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    // Logic to show limited page numbers (e.g. 1 2 3 ... 10)
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift('...');
        }
        if (currentPage + delta < totalPages - 1) {
            range.push('...');
        }

        range.unshift(1);
        if (totalPages !== 1) {
            range.push(totalPages);
        }

        return range;
    };

    const pages = getPageNumbers();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalItems === 0) return null;

    return (
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-zinc-400 text-sm">
                Showing <span className="text-white font-medium">{startItem}</span> to <span className="text-white font-medium">{endItem}</span> of <span className="text-white font-medium">{totalItems}</span> results
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-white/10"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                </button>

                <div className="flex items-center gap-1">
                    {pages.map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                            disabled={page === '...'}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${page === currentPage
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                : page === '...'
                                    ? 'text-zinc-500 cursor-default'
                                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-white/10"
                >
                    <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
