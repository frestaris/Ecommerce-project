import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

const Search = () => {
  const text = useSelector((state) => state.search.text);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: e.target.value },
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/shop?${text}`);
  };

  return (
    <div>
      <form className="form-inline pt-1" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            onChange={handleChange}
            type="search"
            value={text}
            className="form-control "
            placeholder="Search..."
            style={{
              background: "none",
              border: "none",
              outline: "none",
              boxShadow: "none",
            }}
          />
          <div className="input-group-append">
            <span
              className="form-control "
              style={{ background: "none", border: "none" }}
            >
              <SearchOutlined
                onClick={handleSubmit}
                style={{
                  cursor: "pointer",
                  fontSize: "1.25rem",
                  marginRight: "0.5rem",
                }}
              />
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Search;
