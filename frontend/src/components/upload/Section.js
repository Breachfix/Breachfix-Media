import React from "react";

const Section = ({ title, children }) => {
  return (
    <section className="mb-6 p-4 bg-white shadow rounded-2xl">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
};

export default Section;