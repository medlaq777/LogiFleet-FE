import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faInbox } from '@fortawesome/free-solid-svg-icons';

const Table = ({ columns, data, onEdit, onDelete }) => {

    const showActions = onEdit || onDelete;


    const hasData = data && data.length > 0;

    return (
        <div className="bg-[#1A1F2E] border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#11141F] border-b border-zinc-800">

                            {columns.map((col, index) => (
                                <th key={index} className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                    {col.header}
                                </th>
                            ))}


                            {showActions && (
                                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {!hasData ? (

                            <tr>
                                <td colSpan={columns.length + (showActions ? 1 : 0)} className="p-16 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-800">
                                            <FontAwesomeIcon icon={faInbox} className="text-3xl text-zinc-600" />
                                        </div>
                                        <div>
                                            <p className="text-zinc-400 font-semibold mb-1">No data available</p>
                                            <p className="text-zinc-600 text-sm">Get started by adding your first entry</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (

                            data.map((item, rowIndex) => (
                                <tr
                                    key={item.id || rowIndex}
                                    className="border-b border-zinc-800 hover:bg-[#151926] transition-all duration-200 group"
                                >

                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 text-sm text-zinc-300 font-medium">

                                            {col.render ? col.render(item) : item[col.accessor]}
                                        </td>
                                    ))}


                                    {showActions && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="text-primary-400 hover:text-primary-300 p-2.5 hover:bg-zinc-800 rounded-lg transition-all duration-200"
                                                        title="Edit"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className="text-error-400 hover:text-error-300 p-2.5 hover:bg-zinc-800 rounded-lg transition-all duration-200"
                                                        title="Delete"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
