import React from "react";

const Section = ({ title, children }) => {
  return (
    <section className="mb-6 p-4 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-lg font-semibold text-black mb-2">{title}</h2>
       {/* <div className="mb-6 p-4 border rounded-xl shadow-sm bg-white dark:bg-gray-900"></div> */}
      {children}
    </section>
  );
};

export default Section;