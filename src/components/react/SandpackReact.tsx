import { Sandpack } from "@codesandbox/sandpack-react";
import { getSandpackCssText } from "@codesandbox/sandpack-react";

export default function SandpackContent(props) {
  return (
    <div className="breakout">
      <div className=" w-full max-w-[75%] min-w-[65ch] mx-auto">
        <Sandpack
          theme="dark"
          template="react-ts"
          options={{
            editorHeight: "500px",
          }}
          {...props}
        />
      </div>
    </div>
  );
}

export const cssTextOutput = getSandpackCssText();
