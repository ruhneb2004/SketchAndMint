"use client";

//too big of a code, have to split it up ;(
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { CircleIcon } from "@/images/circle";
import { ClearIcon } from "@/images/clear";
import { LineIcon } from "@/images/Line";
import { PencilIcon } from "@/images/pencil";
import { RectangleIcon } from "@/images/rectangle";
import { UndoIcon } from "@/images/undo";
import { useRef, useState, useEffect } from "react";
import { useWatchContractEvent } from "wagmi";
import rough from "roughjs/bin/rough";
import { HexColorPicker } from "react-colorful";
import { CrossHatch } from "@/images/crossHatch";
import { Solid } from "@/images/solid";
import { NoStyle } from "@/images/noStyle";
import { Hachure } from "@/images/hachure";
import { MintButton } from "@/components/ui/mintButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { abi, contractAddr } from "@/library/contractConfig";
import { AnimatePresence, motion } from "framer-motion";
type ShapeType = {
  type: string;
  attr: Record<string, string | number>;
};

const DrawingPage = () => {
  const [strokeWidth, setStrokeWidth] = useState([10]);
  const [showCustomization, setShowCustomization] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fillStyle, selectFillStyle] = useState("hachure");
  const [openStrokeColorPicker, setOpenStrokeColorPicker] = useState(false);
  const [openFillColorPicker, setOpenFillColorPicker] = useState(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [openBackgroundColorPicker, setOpenBackgroundColorPicker] =
    useState(false);
  const colorRefArray = useRef<(HTMLDivElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const tempPathRef = useRef<SVGElement | null>(null);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#000000");
  const tempShapeRef = useRef<SVGElement | null>(null);
  const finalPathRef = useRef<SVGElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [selectButtonId, setSelectButtonId] = useState<number>(0);
  const [fillStyleId, setFillStyleId] = useState<number>(0);
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const [tool, setTool] = useState<
    "freehand" | "rectangle" | "circle" | "line"
  >("freehand");

  const fillStyles = [
    { icon: <Hachure />, value: "hachure" },
    { icon: <NoStyle />, value: "none" },
    { icon: <CrossHatch />, value: "cross-hatch" },
    { icon: <Solid />, value: "solid" },
  ];

  const buttons = [
    {
      icon: <PencilIcon />,
      label: "pencil",
      onClick: () => setTool("freehand"),
    },
    {
      icon: <RectangleIcon />,
      label: "rectangle",
      onClick: () => setTool("rectangle"),
    },
    {
      icon: <CircleIcon />,
      label: "circle",
      onClick: () => setTool("circle"),
    },
    {
      icon: <LineIcon />,
      label: "line",
      onClick: () => setTool("line"),
    },
    {
      icon: <ClearIcon />,
      label: "reset",
      onClick: () => eraseDrawing("reset"),
    },
    {
      icon: <UndoIcon />,
      label: "undo",
      onClick: () => eraseDrawing("undo"),
    },
    { label: "Compressed", onClick: exportToSvg },
    { label: "Raw", onClick: exportToSvgRaw },
  ];

  useWatchContractEvent({
    address: contractAddr,
    abi,
    eventName: "SonthamNft__NftMinted",
    onLogs(logs) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      console.log(logs);
    },
  });

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    const getMousePosition = (evt: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      };
    };

    const handleMouseDown = (evt: MouseEvent) => {
      setIsDrawing(true);
      const pos = getMousePosition(evt);
      startPointRef.current = pos;
      if (tool == "freehand") pointsRef.current = [pos];
    };

    const handleMouseMove = (evt: MouseEvent) => {
      if (!isDrawing) return;
      const pos = getMousePosition(evt);
      switch (tool) {
        case "freehand":
          pointsRef.current.push(pos);

          const pointTuples = pointsRef.current.map(
            (pt) => [pt.x, pt.y] as [number, number]
          );
          const path = rc.curve(pointTuples, {
            stroke: strokeColor,
            strokeWidth: strokeWidth[0],
            roughness: 0.3,
          });

          if (tempPathRef.current) {
            svg.removeChild(tempPathRef.current);
          }

          svg.appendChild(path);
          tempPathRef.current = path;
          break;
        case "rectangle":
          const startPointRect = startPointRef.current;
          if (!startPointRect) return;

          const width = pos.x - startPointRect.x;
          const height = pos.y - startPointRect.y;

          //new shape!
          if (tempShapeRef.current) {
            svg.removeChild(tempShapeRef.current);
          }

          const rect = rc.rectangle(
            startPointRect.x,
            startPointRect.y,
            width,
            height,
            {
              stroke: strokeColor,
              strokeWidth: strokeWidth[0],
              roughness: 0.3,
              fill: fillStyle === "none" ? "" : fillColor,
              fillStyle,
            }
          );

          svg.appendChild(rect);
          tempShapeRef.current = rect;
          break;
        case "circle":
          const startPointCircle = startPointRef.current;
          if (!startPointCircle) return;

          const x = pos.x - startPointCircle.x;
          const y = pos.y - startPointCircle.y;
          const radius = Math.sqrt(x * x + y * y);

          if (tempShapeRef.current) {
            svg.removeChild(tempShapeRef.current);
          }

          const circle = rc.circle(
            startPointCircle.x,
            startPointCircle.y,
            radius * 2,
            {
              stroke: strokeColor,
              strokeWidth: strokeWidth[0],
              roughness: 0.3,
              fill: fillStyle === "none" ? "" : fillColor,
              fillStyle,
            }
          );

          svg.appendChild(circle);
          tempShapeRef.current = circle;
          break;
        case "line":
          const startPointLine = startPointRef.current;
          if (!startPointLine) return;

          if (tempShapeRef.current) {
            svg.removeChild(tempShapeRef.current);
          }

          const line = rc.line(
            startPointLine.x,
            startPointLine.y,
            pos.x,
            pos.y,
            {
              stroke: strokeColor,
              strokeWidth: strokeWidth[0],
              roughness: 0.3,
            }
          );

          svg.appendChild(line);
          tempShapeRef.current = line;
          break;
      }
      lastPointRef.current = pos;
    };

    const handleMouseUp = () => {
      if (!isDrawing) return;
      setIsDrawing(false);

      const pos = lastPointRef.current;
      const start = startPointRef.current;
      if (!start || !pos) return;

      //add the shape to the shapes array

      switch (tool) {
        case "rectangle":
          const rect = {
            type: "rect",
            attr: {
              x: start.x,
              y: start.y,
              width: pos.x - start.x,
              height: pos.y - start.y,
              fill: "none",
              stroke: strokeColor,
              "stroke-width": strokeWidth[0],
            },
          };
          setShapes((prev) => [...prev, rect]);
          break;
        case "circle":
          const dx = pos.x - start.x;
          const dy = pos.y - start.y;
          const radius = Math.sqrt(dx * dx + dy * dy);
          const circle = {
            type: "circle",
            attr: {
              cx: start.x,
              cy: start.y,
              r: radius,
              fill: "none",
              stroke: strokeColor,
              "stroke-width": strokeWidth[0],
            },
          };
          setShapes((prev) => [...prev, circle]);
          break;
        case "line":
          const line = {
            type: "line",
            attr: {
              x1: start.x,
              y1: start.y,
              x2: pos.x,
              y2: pos.y,
              stroke: strokeColor,
              "stroke-width": strokeWidth[0],
            },
          };
          setShapes((prev) => [...prev, line]);
          break;
        case "freehand":
          if (pointsRef.current.length > 1) {
            const d = pointsRef.current
              .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
              .join(" ");
            const path = {
              type: "path",
              attr: {
                d,
                fill: "none",
                stroke: strokeColor,
                "stroke-width": strokeWidth[0],
              },
            };
            setShapes((prev) => [...prev, path]);
          }
          break;
      }

      if (tool != "freehand") {
        if (tempShapeRef.current) {
          tempShapeRef.current = null;
        }
        startPointRef.current = null;
        return;
      }

      if (pointsRef.current.length < 2 && tool == "freehand") {
        pointsRef.current = [];
        return;
      }

      const pointTuples = pointsRef.current.map(
        (pt) => [pt.x, pt.y] as [number, number]
      );
      const finalPath = rc.curve(pointTuples, {
        stroke: strokeColor,
        strokeWidth: strokeWidth[0],
        roughness: 0.3,
      });

      if (tempPathRef.current) {
        svg.removeChild(tempPathRef.current);
        tempPathRef.current = null;
      }

      svg.appendChild(finalPath);
      pointsRef.current = [];
      finalPathRef.current = finalPath;
    };

    svg.addEventListener("mousedown", handleMouseDown);
    svg.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      svg.removeEventListener("mousedown", handleMouseDown);
      svg.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDrawing, tool]);

  async function exportToSvg(): Promise<string> {
    const svgContent = shapes
      .map((shape) => {
        const attrs = Object.entries(shape.attr)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ");
        return `<${shape.type} ${attrs} />`;
      })
      .join("\n");

    const fullSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgRef.current?.clientWidth}" height="${svgRef.current?.clientHeight}"><rect width="100%" height="100%" fill="white" />${svgContent}</svg>`;
    console.log(fullSvgContent);
    await navigator.clipboard.writeText(fullSvgContent);
    return fullSvgContent;
  }

  const optimizeSvgOnServer = async (rawSvg: string) => {
    const res = await fetch("/api/optimize-svg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ svg: rawSvg }),
    });

    if (!res.ok) {
      throw new Error("Failed to optimize SVG");
    }

    const { optimizedSvg } = await res.json();
    return optimizedSvg;
  };

  async function exportToSvgRaw() {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    const clone = svgElement.cloneNode(true) as SVGSVGElement;

    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", svgElement.clientWidth.toString());
    clone.setAttribute("height", svgElement.clientHeight.toString());

    const fullSvgContent = clone.outerHTML;
    console.log("full svg content ", fullSvgContent);
    const compressedSvg = await optimizeSvgOnServer(fullSvgContent);
    for (let i = 0; i < compressedSvg.data.length; i++) {
      if (compressedSvg.data[i] == ">") {
        compressedSvg.data =
          compressedSvg.data.slice(0, i + 1) +
          '<rect width="100%" height="100%" fill="white" />' +
          compressedSvg.data.slice(i + 1);
        break;
      }
    }
    console.log("compressesd svg ", compressedSvg.data);
    navigator.clipboard.writeText(compressedSvg.data);
    return compressedSvg.data;
  }

  function eraseDrawing(option: string) {
    if (!svgRef.current) return;
    const svg = svgRef.current;

    if (option == "reset") {
      while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
      }
      setShapes([]);
    } else if (option == "undo") {
      if (svg.lastChild) svg.removeChild(svg.lastChild);
      setShapes((prev) => prev.slice(0, -1));
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    const clickInside = colorRefArray.current.some(
      (ref) => ref && ref.contains(event.target as Node)
    );

    if (!clickInside) {
      setOpenStrokeColorPicker(false);
      setOpenFillColorPicker(false);
      setOpenBackgroundColorPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {showAlert ? (
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-10 w-[50%] z-[100]"
            >
              <Alert variant="success">
                <Terminal />
                <AlertTitle>NFT Minted 🎉</AlertTitle>
                <AlertDescription>
                  Your NFT has been successfully minted! Check your wallet to
                  see it.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div></div>
      )}
      {/* This is the customization menu */}
      <div className="flex h-fit flex-col  w-64  fixed top-8 left-8 z-50 space-y-4">
        <div className=" flex ">
          <ConnectButton accountStatus={"avatar"} />
        </div>
        <div
          className="px-1.5 font-semibold py-4  text-xs h-8 flex items-center justify-center hover:bg-sky-700 active:bg-sky-800 hover:text-white transition-all hover:shadow-gray-600 hover:shadow-sm bg-sky-200 text-sky-800 p-2 rounded-lg shadow-md z-50 space-x-2 cursor-pointer"
          onClick={() => {
            setShowCustomization((show) => {
              console.log("show customization", show);
              return !show;
            });
          }}
        >
          show customization
        </div>
        {showCustomization && (
          <div className="h-fit bg-sky-200 w-64 p-4 rounded-lg shadow-md text-sky-900">
            {/* Things to add!
        1. Stroke Width
        2. Storke Color
        3. Fill Color (transparent and other colors, maybe a color wheel perhaps!)
        4. Fill Style
        */}
            <div className="flex flex-col space-y-2">
              <span className="text-sm">Stroke Width</span>
              <Slider
                max={20}
                min={0.5}
                defaultValue={[10]}
                onValueChange={setStrokeWidth}
                className=""
              />
            </div>
            <div>
              <span className="text-sm">Pick Stroke Color</span>
              <div
                className={`w-[80%] h-7 rounded-md shadow-sm shadow-gray-400   relative cursor-pointer transition-all`}
                style={{ backgroundColor: strokeColor }}
                onClick={() => setOpenStrokeColorPicker(!openStrokeColorPicker)}
              ></div>
              {openStrokeColorPicker && (
                <div
                  className="absolute z-50 "
                  ref={(el) => {
                    colorRefArray.current[0] = el;
                  }}
                >
                  <HexColorPicker
                    color={strokeColor}
                    onChange={setStrokeColor}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm">Fill Style</span>
              <div className="flex items-center  space-x-2">
                {fillStyles.map((style, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setFillStyleId(idx);
                      selectFillStyle(style.value);
                      console.log(fillStyle);
                    }}
                    className={` w-fit active:shadow-none rounded-md p-1.5 shadow-sm shadow-gray-400  transition-all active:bg-sky-700 hover:bg-sky-700 ${
                      fillStyleId === idx ? "bg-sky-800" : "bg-white"
                    }`}
                  >
                    {style.icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm">Pick Fill Color</span>
              <div
                className={`w-[80%] h-7 rounded-md shadow-sm shadow-gray-400   relative cursor-pointer transition-all`}
                style={{ backgroundColor: fillColor }}
                onClick={() => setOpenFillColorPicker(!openFillColorPicker)}
              ></div>
              {openFillColorPicker && (
                <div
                  className="absolute z-50"
                  ref={(el) => {
                    colorRefArray.current[1] = el;
                  }}
                >
                  <HexColorPicker color={fillColor} onChange={setFillColor} />
                </div>
              )}
            </div>
            <div>
              <span className="text-sm">Background Color</span>
              <div
                className={`w-[80%] h-7 rounded-md shadow-sm shadow-gray-400 relative cursor-pointer transition-all`}
                style={{ backgroundColor: backgroundColor }}
                onClick={() =>
                  setOpenBackgroundColorPicker(!openBackgroundColorPicker)
                }
              ></div>
              {openBackgroundColorPicker && (
                <div
                  className="absolute z-50"
                  ref={(el) => {
                    colorRefArray.current[2] = el;
                  }}
                >
                  <HexColorPicker
                    color={backgroundColor}
                    onChange={setBackgroundColor}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="fixed top-5 right-10 text-[1.1rem] font-[500] font-sans  tracking-widest text-neutral-400 select-none">
        Ruhn3b
      </div>
      <svg
        ref={svgRef}
        style={{ backgroundColor }}
        className="h-screen w-full border border-gray-300  cursor-crosshair "
      />

      {/* main menu bar is this */}

      <div className="fixed left-1/2 bottom-8 -translate-x-1/2 flex items-center justify-center gap-3">
        <div className=" bg-sky-200 text-sky-800 p-2 rounded-lg shadow-md z-50 space-x-2 items-center flex">
          {buttons.map((btn, idx) => (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <button
                  key={idx}
                  className={`${
                    selectButtonId === idx
                      ? "bg-sky-900 shadow-sm shadow-gray-600 text-white"
                      : ""
                  } hover:bg-sky-700 active:bg-sky-800 hover:text-white rounded-md transition-all hover:shadow-gray-600 hover:shadow-sm p-1.5 text-xs ${
                    btn.icon ? "cursor-pointer" : "cursor-copy"
                  }`}
                  onClick={() => {
                    btn.onClick();
                    if (idx < 4) setSelectButtonId(idx);
                  }}
                >
                  {btn.icon || btn.label}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{btn.icon ? btn.label : `Copy ${btn.label} svg`}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className=" bg-sky-200 h-full w-fit text-sky-800 p-2.5 rounded-lg shadow-md z-50 space-x-2 items-center flex">
          <MintButton
            className="px-1.5 py-4  text-xs h-8 flex items-center justify-center hover:bg-sky-700 active:bg-sky-800 hover:text-white rounded-md transition-all hover:shadow-gray-600 hover:shadow-sm cursor-pointer"
            exportToSvgRaw={exportToSvgRaw}
            exportToSvg={exportToSvg}
          />
        </div>
      </div>
    </div>
  );
};

export default DrawingPage;
