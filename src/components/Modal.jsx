import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={onClose}
        >
            <div
                className="premium-card w-full max-w-lg animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="btn-icon"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
