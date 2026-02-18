import { useEffect, useRef, useState, useCallback } from "react";

/**
 * GridScan Component Props
 */
interface GridScanProps {
    /** Sensitivity of the scan (currently unused but reserved for future interactive features) */
    sensitivity?: number;
    /** Thickness of the grid lines in pixels */
    lineThickness?: number;
    /** Color of the grid lines */
    linesColor?: string;
    /** Color of the scanning beam */
    scanColor?: string;
    /** Opacity of the scan beam (0 to 1) */
    scanOpacity?: number;
    /** Scale of the grid (larger value = smaller grid cells) */
    gridScale?: number;
    /** Style of the grid lines */
    lineStyle?: "solid" | "dashed" | "dotted";
    /** Amount of jitter/noise applied to lines */
    lineJitter?: number;
    /** Direction of the scanning beam */
    scanDirection?: "top-bottom" | "bottom-top" | "left-right" | "right-left" | "pingpong";
    /** Intensity of visual noise (0 to 1) */
    noiseIntensity?: number;
    /** Glow intensity of the scan beam */
    scanGlow?: number;
    /** Softness/fade of the scan beam edges */
    scanSoftness?: number;
    /** Duration of one scan cycle in seconds */
    scanDuration?: number;
    /** Delay between scan cycles in seconds */
    scanDelay?: number;
    /** Whether clicking the component triggers a scan reset/interaction */
    scanOnClick?: boolean;
}

/**
 * GridScan Component
 * 
 * Renders an animated cyber-security style grid with a scanning beam effect using HTML5 Canvas.
 */
export default function GridScan({
    sensitivity: _sensitivity = 0.6,
    lineThickness = 2,
    linesColor = "#121212", // Default to dark
    scanColor = "#f60440",
    scanOpacity = 0.4,
    gridScale = 0.1,
    lineStyle = "solid",
    lineJitter = 0.1,
    scanDirection = "pingpong",
    noiseIntensity = 0.01,
    scanGlow = 0.7,
    scanSoftness = 2.5,
    scanDuration = 2,
    scanDelay = 2,
    scanOnClick = true,
}: GridScanProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scanOffset, setScanOffset] = useState(0);

    // Main drawing function wrapped in useCallback to be used in the animation loop
    const drawGrid = useCallback((timestamp: number) => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear the canvas for the new frame
        ctx.clearRect(0, 0, width, height);

        // --- Draw Grid ---
        // Calculate grid size based on scale prop
        const gridSize = Math.max(20, (1 / gridScale) * 50);

        ctx.strokeStyle = linesColor;
        ctx.lineWidth = lineThickness;

        // Set line dash style
        if (lineStyle === "dashed") {
            ctx.setLineDash([5, 5]);
        } else if (lineStyle === "dotted") {
            ctx.setLineDash([2, 5]);
        } else {
            ctx.setLineDash([]);
        }

        // Draw vertical lines with jitter
        ctx.beginPath();
        for (let x = 0; x <= width; x += gridSize) {
            // Apply random jitter to line positions if enabled
            const jitterX = (Math.random() - 0.5) * lineJitter * 2;
            ctx.moveTo(x + jitterX, 0);
            ctx.lineTo(x + jitterX, height);
        }
        ctx.stroke();

        // Draw horizontal lines with jitter
        ctx.beginPath();
        for (let y = 0; y <= height; y += gridSize) {
            const jitterY = (Math.random() - 0.5) * lineJitter * 2;
            ctx.moveTo(0, y + jitterY);
            ctx.lineTo(width, y + jitterY);
        }
        ctx.stroke();

        // --- Draw Scan Beam ---

        // Calculate animation timing
        const cycleTime = scanDuration * 1000;
        const delayTime = scanDelay * 1000;
        const totalCycle = cycleTime + delayTime;

        // Adjust logic time based on user clicks (offset)
        const adjustedTime = timestamp - scanOffset;

        // Normalize progress (0 to 1) within the active scan period
        let progress = (adjustedTime % totalCycle) / cycleTime;

        // Check if we are in the delay period
        let activeScan = true;
        if (progress > 1) {
            progress = 0;
            activeScan = false;
        }

        if (activeScan) {
            let visualProgress = progress;

            // Handle scanning directions
            if (scanDirection === "pingpong") {
                // Ping-pong: Move 0->1 then 1->0
                // We treat 2 * scanDuration as one full ping-pong loop
                const pingPongCycle = (scanDuration * 2) * 1000;
                const ppProgress = (adjustedTime % pingPongCycle) / (scanDuration * 1000);

                if (ppProgress <= 1) {
                    visualProgress = ppProgress; // Forward: 0 to 1
                } else {
                    visualProgress = 2 - ppProgress; // Backward: 1 to 0
                }
            } else if (scanDirection === "bottom-top") {
                visualProgress = 1 - progress;
            } else {
                // Default: top-bottom
                visualProgress = progress;
            }

            const scanPos = visualProgress * height;
            const scanHeight = 100 * scanSoftness;

            // Create gradient for the beam
            const gradient = ctx.createLinearGradient(0, scanPos - (scanHeight / 2), 0, scanPos + (scanHeight / 2));
            gradient.addColorStop(0, "transparent");
            gradient.addColorStop(0.5, scanColor);
            gradient.addColorStop(1, "transparent");

            // Use globalAlpha for opacity
            ctx.fillStyle = gradient;
            ctx.globalAlpha = scanOpacity;
            ctx.fillRect(0, scanPos - (scanHeight / 2), width, scanHeight);

            // --- Glow Effect ---
            ctx.shadowBlur = 20 * scanGlow;
            ctx.shadowColor = scanColor;
            ctx.globalAlpha = 1;

            // Draw the bright center line of the scan
            ctx.beginPath();
            ctx.strokeStyle = scanColor;
            ctx.lineWidth = Math.max(1, lineThickness);
            ctx.moveTo(0, scanPos);
            ctx.lineTo(width, scanPos);
            ctx.stroke();

            ctx.shadowBlur = 0;
        }

        // --- Noise Effect ---
        if (noiseIntensity > 0) {
            // Simple noise: random rectangles
            ctx.fillStyle = `rgba(255, 255, 255, ${noiseIntensity})`;
            for (let i = 0; i < 20; i++) {
                const nx = Math.random() * width;
                const ny = Math.random() * height;
                ctx.fillRect(nx, ny, 2, 2);
            }
        }

    }, [lineThickness, linesColor, scanColor, scanOpacity, gridScale, lineStyle, lineJitter, scanDirection, noiseIntensity, scanGlow, scanSoftness, scanDuration, scanDelay, scanOffset]);

    // Handle Resize and Animation Loop
    useEffect(() => {
        let animationFrameId: number;

        const renderLoop = (timestamp: number) => {
            drawGrid(timestamp);
            animationFrameId = requestAnimationFrame(renderLoop);
        };

        animationFrameId = requestAnimationFrame(renderLoop);

        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                canvasRef.current.width = containerRef.current.clientWidth;
                canvasRef.current.height = containerRef.current.clientHeight;
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial size

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, [drawGrid]);

    const handleClick = () => {
        if (scanOnClick) {
            // Reset scan animation by setting offset to current time
            setScanOffset(performance.now());
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full absolute inset-0 overflow-hidden pointer-events-none">
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
                style={{ pointerEvents: scanOnClick ? 'auto' : 'none' }}
                onClick={handleClick}
            />
        </div>
    );
}
