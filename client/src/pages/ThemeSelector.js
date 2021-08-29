import React from "react";

const Theme = React.lazy(() => import("./Theme"));
const Theme2 = React.lazy(() => import("./Theme2"));

const ThemeSelector = (props) => (
  <>
    {/* Conditionally render theme, based on the current client context */}
    <React.Suspense fallback={() => null}>
      {props.shouldRenderMediaQuary ? <Theme /> : <Theme2 />}
    </React.Suspense>
    {/* Render children immediately! */}
    {props.children}
  </>
);

export default ThemeSelector;
