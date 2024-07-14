const Filter = ({ nameFilter, handleFilterChange }) => {
    return (
        <div>
            filter shown with{" "}
            <input value={nameFilter} onChange={handleFilterChange} />
        </div>
    );
};

export default Filter;
