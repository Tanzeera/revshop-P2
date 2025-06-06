/* eslint-disable react/prop-types */
function Button({ color, hover, text, onClick }) {
    return (
        <div className="flex items-center justify-center">
            <button className={`btn bg-${color} hover:bg-${hover}`} onClick={onClick}>
                {text}
            </button>
        </div>
    );
}

export default Button;
