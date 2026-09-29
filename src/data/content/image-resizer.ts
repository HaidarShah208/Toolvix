import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "To resize an image, open it in the tool, enter a new width or height in pixels (the other side adjusts to keep the proportions) or choose a percentage, then download the result as JPEG, PNG, WebP or the original format. The image is processed in your browser and is never uploaded.",
  intro:
    "Job portals, marketplaces, email signatures and CMS templates often demand an image of a specific size, and phone photos are usually far larger than any of them need. This resizer gives you exact pixel control without installing software or sending your photos to a server.",
  howToUse: [
    "Choose an image file (JPG, PNG, WebP, GIF or BMP). Its current dimensions and file size are shown.",
    "Pick a mode: exact pixels or percentage. In pixel mode, keep aspect ratio on and type just the width or the height; turn it off only if you really want to stretch the image.",
    "Select the output format: same as the original, JPEG, PNG or WebP. For JPEG and WebP, set the quality.",
    "Resize, check the preview and new file size, and download.",
  ],
  howItWorks: [
    "The file is read by your browser and drawn onto an HTML canvas at the new dimensions, then encoded into the format you chose. The browser's own image smoothing handles the resampling. None of this involves a network request, so private documents and personal photos stay on your device.",
    "With aspect ratio locked, the missing side is calculated from the original proportions and rounded to the nearest whole pixel. A 4000 × 3000 photo set to 1200 px wide becomes 1200 × 900.",
    "A few things change along the way. JPEG has no transparency, so any transparent areas are filled with white when you save as JPEG; choose PNG or WebP to keep them. Animated GIFs are reduced to their first frame. EXIF metadata such as camera model, date taken and GPS location is not carried over to the new file.",
  ],
  formulas: [
    {
      label: "Keeping the aspect ratio",
      expression: "New height = Original height × (New width ÷ Original width)",
    },
    {
      label: "Resizing by percentage",
      expression: "New width = Original width × P ÷ 100, and the same for height",
    },
  ],
  examples: [
    {
      title: "Phone photo for a website banner",
      steps: ["Original: 4000 × 3000 px", "Width set to 1200 px, aspect ratio locked", "Height = 3000 × 1200 ÷ 4000 = 900"],
      result: "1200 × 900 px, typically a fraction of the original file size.",
    },
    {
      title: "Shrinking a screenshot to 25%",
      steps: ["Original: 2560 × 1440 px", "2560 × 0.25 = 640; 1440 × 0.25 = 360"],
      result: "640 × 360 px, small enough to paste into a chat or document.",
    },
    {
      title: "A 600 × 600 profile picture from a portrait photo",
      steps: [
        "Original: 3024 × 4032 px (3:4)",
        "Locked ratio at 600 px wide gives 600 × 800, not a square",
        "Crop to a square first, or unlock the ratio and accept some distortion",
      ],
      result: "Resizing alone cannot change the shape without stretching; a square output needs a square input.",
    },
  ],
  sections: [
    {
      heading: "Does resizing reduce image quality?",
      paragraphs: [
        "Making an image smaller discards pixels, but at the smaller size it usually looks just as sharp, since the detail removed was finer than the new display can show. Making an image larger is different: the browser can only interpolate between existing pixels, so an enlarged image looks soft or blurry. If you need a big version, start from the largest original you have.",
        "Saving as JPEG or WebP adds compression on top of the resize. A quality setting of around 80 to 90 is hard to tell from the original for photos; drop lower only if file size matters more than detail.",
      ],
    },
    {
      heading: "Which output format should I choose?",
      list: [
        "JPEG: photos where small file size matters and transparency is not needed.",
        "PNG: screenshots, logos, diagrams and anything with sharp edges, text or transparency. Lossless, but larger for photos.",
        "WebP: a good all-rounder for the web, smaller than JPEG at similar quality and supports transparency. Supported by all current major browsers.",
        "Same as original: keeps the file type your destination already accepts.",
      ],
    },
  ],
  faqs: [
    {
      question: "Are my images uploaded to a server?",
      answer:
        "No. The resizing uses your browser's canvas, so the image never leaves your device. You can even disconnect from the internet after the page loads and it still works.",
    },
    {
      question: "Why did the transparent background turn white?",
      answer:
        "JPEG does not support transparency, so transparent pixels have to be filled with a color. Choose PNG or WebP as the output format to keep the background transparent.",
    },
    {
      question: "Can I resize an animated GIF?",
      answer:
        "Only the first frame is kept, so the output is a still image. Animated GIFs need a dedicated GIF editor to resize every frame.",
    },
    {
      question: "Is the photo's location data kept?",
      answer:
        "No. EXIF metadata, including GPS coordinates, camera details and orientation tags, is not copied into the resized file. That is useful for privacy, but keep the original if you need that information.",
    },
    {
      question: "What size should an image be for a website?",
      answer:
        "Match the largest size it will be displayed at, allowing double for high-density screens. A full-width hero image is commonly 1600 to 2400 px wide; an image in a blog column is often 800 to 1200 px.",
    },
    {
      question: "Does resizing change the DPI?",
      answer:
        "DPI only matters for print and is stored as metadata, which is not preserved. What matters for screens is the pixel dimensions; for print, divide the pixel width by the DPI to get inches (1800 px at 300 DPI prints 6 inches wide).",
    },
  ],
};

export default content;
