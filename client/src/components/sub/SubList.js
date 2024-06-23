import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSubs } from "../../functions/sub";

const SubList = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubs().then((res) => {
      setSubs(res.data);
      setLoading(false);
    });
  }, []);

  const showSubs = () =>
    subs.map((s) => (
      <div key={s._id}>
        <Link
          className="btn btn-dark text-white btn-lg m-3 "
          to={`/sub/${s.slug}`}
        >
          {s.name}
        </Link>
      </div>
    ));

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <h4 className="text-center">Loading...</h4>
        ) : (
          <div className="d-flex flex-wrap">{showSubs()}</div>
        )}
      </div>
    </div>
  );
};

export default SubList;
