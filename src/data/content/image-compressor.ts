import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "To compress an image, load it, choose JPEG or WebP and lower the quality slider (around 70 to 80 is a good starting point for photos), then compare the before and after file sizes and download. Setting a maximum width or height as well gives the biggest savings.",
  intro:
    "Upload forms reject files over a size limit, slow pages lose visitors, and email attachments bounce. Most photos can lose well over half their file size with little visible difference. This compressor lets you see the trade-off directly and runs on your own device.",
  howToUse: [
    "Select an image. The original dimensions and file size are displayed.",
    "Choose the output format. JPEG and WebP use a quality setting from 10 to 100; PNG is lossless.",
    "Optionally set a maximum dimension, such as 1920 px, to scale down anything larger while keeping its proportions.",
    "Compress, compare the before and after sizes and the preview, then download. Try a different quality if the result is too large or too soft.",
  ],
  howItWorks: [
    "JPEG and WebP are lossy formats. They save space by discarding fine detail and color information the eye is least sensitive to. The quality setting controls how aggressive that is: high values keep more detail and produce larger files, low values produce smaller files with visible blockiness or smearing. The relationship is not linear; the step from 100 to 85 usually saves far more than the step from 60 to 45.",
    "PNG is lossless, so re-saving a PNG cannot throw away detail to save space, and the file may come out about the same size or even larger. For PNGs, the effective lever is the maximum dimension: halving the width and height leaves a quarter of the pixels. For photographs saved as PNG, converting to JPEG or WebP typically cuts the size dramatically.",
    "Compression happens in the browser using the canvas API. The image is decoded, optionally scaled, and re-encoded, so it is never uploaded. Metadata such as EXIF is stripped in the process, which also removes any GPS location a phone camera embedded in the photo.",
  ],
  formulas: [
    {
      label: "Size saving",
      expression: "Saving % = (Original size − New size) ÷ Original size × 100",
    },
    {
      label: "Effect of scaling on pixel count",
      expression: "Pixels = Width × Height, so scaling both sides by s multiplies pixels by s²",
      note: "Scaling to 50% on each side keeps 25% of the pixels, which usually has a bigger effect on size than a lower quality setting.",
    },
  ],
  examples: [
    {
      title: "A phone photo for an upload form with a 1 MB limit",
      steps: [
        "Original: 4032 × 3024 JPEG, 4.2 MB",
        "Max dimension 1920 px → 1920 × 1440; JPEG quality 80",
        "Result around 0.4 MB (actual size depends on the photo's detail)",
        "Saving ≈ (4.2 − 0.4) ÷ 4.2 × 100 ≈ 90%",
      ],
      result: "Comfortably under the limit and still sharp on a laptop screen.",
    },
    {
      title: "A screenshot saved as PNG",
      steps: [
        "Original: 2880 × 1800 PNG, 1.6 MB",
        "Re-saving as PNG at the same size barely changes it",
        "Max dimension 1440 px → 1440 × 900 keeps 25% of the pixels",
      ],
      result: "The file shrinks substantially while text stays crisp, because the format remains lossless.",
    },
  ],
  sections: [
    {
      heading: "What quality setting should I use?",
      list: [
        "90 to 100: near-original, for photos you may edit or print later. Files stay large.",
        "75 to 85: the usual sweet spot for web photos. Differences are hard to spot at normal viewing size.",
        "50 to 70: noticeably smaller files for thumbnails and previews. Artefacts appear around edges and in skies.",
        "Below 50: only when size matters above everything else.",
      ],
      paragraphs: [
        "Faces, text and smooth gradients show compression first, so check those areas in the preview before settling on a value.",
      ],
    },
    {
      heading: "Does compressing an image remove its location data?",
      paragraphs: [
        "Yes. Photos from phones often contain the GPS coordinates of where they were taken, plus the device model and time. Because the compressor re-encodes the pixels without copying metadata, the downloaded file contains none of that. It is a simple way to make a photo safer to post publicly. Keep the original if you want the date and location for your own records.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is compressing images here private?",
      answer:
        "Yes. Your browser does all the work, so the photo is never sent to a server. That makes it suitable for ID scans, receipts and other sensitive images.",
    },
    {
      question: "Why is my compressed PNG not smaller?",
      answer:
        "PNG is lossless, so there is no quality to trade away, and the browser's encoder may not match the optimization of the original file. Reduce the maximum dimension, or switch to JPEG or WebP if the image is a photograph.",
    },
    {
      question: "Can I compress the same image repeatedly?",
      answer:
        "You can, but each lossy save adds new artefacts. It is better to go back to the original and compress it once at a lower quality.",
    },
    {
      question: "Is WebP better than JPEG?",
      answer:
        "At the same visual quality, WebP files are generally smaller than JPEGs, and WebP supports transparency. Some older software and a few upload forms still accept only JPEG or PNG, so check where the file is going.",
    },
    {
      question: "Will compression change the image dimensions?",
      answer:
        "Only if you set a maximum dimension and the image is larger than it. Otherwise the width and height stay the same and only the encoding changes.",
    },
  ],
};

export default content;
