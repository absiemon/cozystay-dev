import React from 'react';
import './Loading.css'; // import the CSS file for styling

function Loading({ loading, flag }) {
  return (
    <>
      {loading && (
        <div className={!flag ? "loading-container" : "loading-container2"}>
          <div className="loading-spinner"></div>
        </div>
      )}
    </>
  );
}

export default Loading;