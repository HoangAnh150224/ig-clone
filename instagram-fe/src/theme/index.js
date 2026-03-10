import { createSystem, defineConfig, defaultBaseConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          blue: { value: "#0095f6" },
          red: { value: "#ff3040" },
          dark: { value: "#000000" }, // Pure Black chuẩn 2024
          gray: { value: "#8e8e8e" },
          border: { value: "#dbdbdb" },
          text: { value: "#262626" },
        },
      },
      radii: {
        ig: { value: "8px" }, // Bo góc chuẩn cho bài viết và nút
      }
    },
    semanticTokens: {
      colors: {
        bg: {
          default: { value: "#ffffff" },
          _dark: { value: "#000000" },
        },
        fg: {
          default: { value: "#262626" },
          _dark: { value: "#f5f5f5" },
        },
      },
    },
  },
})

export const system = createSystem(defaultBaseConfig, config)
