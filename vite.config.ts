import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

import Sitemap from "vite-plugin-sitemap";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables for the build process (since Vite config runs in Node)
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Fetch dynamic user routes for the sitemap
  let dynamicRoutes: string[] = [];
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .not('username', 'is', null)
        .neq('username', '');

      if (!error && data) {
        dynamicRoutes = ['/', '/pricing', '/about', ...data.map(profile => `/${profile.username}`)];
      } else {
        dynamicRoutes = ['/', '/pricing', '/about'];
      }
    } else {
      dynamicRoutes = ['/', '/pricing', '/about'];
    }
  } catch (error) {
    console.error("Failed to fetch dynamic routes for sitemap:", error);
  }

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      Sitemap({
        hostname: "https://www.foliogen.in",
        outDir: "public",
        dynamicRoutes,
        exclude: ["/404"],
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
