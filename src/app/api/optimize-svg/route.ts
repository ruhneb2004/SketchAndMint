import { optimize } from "svgo";

export async function POST(request: Request) {
  const { svg } = await request.json();

  if (!svg) {
    return new Response(JSON.stringify({ error: "Missing SVG content" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const result = optimize(svg, {
      multipass: true,
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              // turn off plugins you don’t need
              removeViewBox: false, // keeps responsiveness
            },
          },
        },
        "removeDimensions", // removes width/height
        "convertStyleToAttrs", // reduces style tags
        "cleanupNumericValues", // e.g. 10.000 → 10
        "convertColors", // shortens color values
        "minifyStyles", // aggressive CSS minification
        "removeUnknownsAndDefaults", // remove unknown attrs
        "removeUselessStrokeAndFill", // removes redundant fill/stroke
      ],
    });

    return new Response(JSON.stringify({ optimizedSvg: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("SVGO error:", error);
    return new Response(JSON.stringify({ error: "Failed to optimize SVG" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
