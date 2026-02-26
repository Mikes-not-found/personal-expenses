import { Composition } from "remotion";
import { AppDemo } from "./compositions/AppDemo";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="AppDemo"
        component={AppDemo}
        durationInFrames={560}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
