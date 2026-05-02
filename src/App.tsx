import { useState } from "react"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Button } from "./components/ui/button"
import { Slider } from "./components/ui/slider";

function App() {

  const [input_img, setInput_img] = useState<File | null>(null);
  const [output_img, setOutput_img] = useState<string>("");
  const [value, setValue] = useState(0.2)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInput_img(file);
  };

  const handeleSubmit = () => {
    if (!input_img) return;

    const img = new Image();
    img.src = input_img ? URL.createObjectURL(input_img) : '';

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const pixelScale = value; // 🔥 lower = more pixelated

      // Step 1: shrink image
      const smallW = img.width * pixelScale;
      const smallH = img.height * pixelScale;

      canvas.width = smallW;
      canvas.height = smallH;

      ctx.drawImage(img, 0, 0, smallW, smallH);

      // Step 2: scale back up WITHOUT smoothing
      const finalCanvas = document.createElement("canvas");
      const fctx = finalCanvas.getContext("2d");
      if (!fctx) return;

      finalCanvas.width = img.width;
      finalCanvas.height = img.height;

      fctx.imageSmoothingEnabled = false; // 🔥 THIS IS THE MAGIC

      fctx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);

      // Optional: also compress
      const result = finalCanvas.toDataURL("image/jpeg", 0.7);

      setOutput_img(result);
    };
  };

  const handleDownload = () => {
    if (!output_img) return;
    
    const link = document.createElement("a");
    link.href = output_img;
    const timestamp = new Date().getTime();
    link.download = `5arabha-${timestamp}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-10 shadow-xl">
          <h1 className="text-3xl font-semibold mb-6 text-center">
            خربها
          </h1>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" type="file" onChange={handleFileChange} />

              <div className="flex items-center justify-between gap-2 mt-6">
                <Label htmlFor="slider-demo-temperature">Curse lvl</Label>
                <span className="text-sm text-muted-foreground">
                  {value.toFixed(2)}
                </span>
              </div>

              <Slider
                defaultValue={[0.2]}
                max={0.5}
                min={0.05}
                step={0.1}
                value={[value]}
                onValueChange={([newValue]) => setValue(newValue)}
                className="mx-auto w-full max-w-xs"
              />
              <Button onClick={handeleSubmit} className="mt-4">Curse it</Button>
            </div>
            <div className="mt-6 flex align-center justify-center gap-2.5">
              <img src={input_img ? URL.createObjectURL(input_img) : ''} alt="" className="rounded-md w-26 h-26 object-cover" />
              <img src={output_img} alt="" className="rounded-md w-26 h-26 object-cover" />
            </div>
            <Button onClick={handleDownload} className="mt-4 w-full">Download</Button>
        </div>
      </div>
    )
    
  }

  export default App
