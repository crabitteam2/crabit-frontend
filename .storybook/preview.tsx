import type { CSSProperties } from "react";
import type { Preview } from "@storybook/nextjs-vite";
import "pretendard/dist/web/variable/pretendardvariable.css";
import "../src/app/globals.css";

const fontVariables = {
  "--font-pretendard": '"Pretendard Variable"',
} as CSSProperties;

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        className="bg-layer-default text-fg-neutral min-h-screen w-full font-sans"
        style={fontVariables}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      options: {
        light: { name: "Light", value: "#ffffff" },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    viewport: {
      options: {
        mobile375: {
          name: "Mobile 375",
          styles: { width: "375px", height: "812px" },
          type: "mobile",
        },
        mobile390: {
          name: "Mobile 390",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
        mobile430: {
          name: "Mobile 430",
          styles: { width: "430px", height: "932px" },
          type: "mobile",
        },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: "light" },
    viewport: { value: "mobile390", isRotated: false },
  },
};

export default preview;
