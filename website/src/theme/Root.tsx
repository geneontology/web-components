import React, { useEffect } from "react";
import { defineCustomElements } from "@geneontology/web-components/loader";

export default function Root({ children }) {
  useEffect(() => {
    defineCustomElements();
  }, []);
  return <>{children}</>;
}
