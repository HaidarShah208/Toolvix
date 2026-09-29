import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "To make a QR code, choose what it should contain (a link, plain text, an email, a phone number or Wi-Fi details), fill in the fields, and download the code as a PNG or SVG. The code is generated in your browser and, because it is static, it never expires and does not track scans.",
  intro:
    "A QR code is just data drawn as a grid of squares, so the most important decisions are what you put in it and whether it will scan reliably where people see it. This generator covers the five content types people use most and gives you control over size, colors, margin and error correction.",
  howToUse: [
    "Pick a content type: URL, Text, Email, Phone or Wi-Fi.",
    "Fill in the fields. For email you can add a subject and body; for Wi-Fi, enter the network name, password and security type.",
    "Adjust the size (128 to 1024 px), foreground and background colors, error correction level and margin if you need to. The preview updates as you go.",
    "Scan the preview with your phone camera to check it works, then download it as PNG for documents and screens or SVG for print and design software.",
  ],
  howItWorks: [
    "The text you enter is encoded into a standard QR symbol. Other content types are turned into a string that phones recognize: an email becomes a mailto: link with the subject and body attached, a phone number becomes a tel: link, and Wi-Fi details become a WIFI: string that most modern iOS and Android cameras offer to join directly.",
    "QR codes use Reed–Solomon error correction, which lets a scanner rebuild missing or dirty parts of the code. Level L can recover roughly 7% of the data, M about 15%, Q about 25% and H about 30%. Higher levels make the code more robust but add more modules (squares), so the same content produces a denser pattern.",
    "Everything happens in your browser. The code is drawn locally, nothing you type is sent to a server, and there is no redirect service in between: the phone reads your link or text straight from the pattern.",
  ],
  formulas: [
    {
      label: "Wi-Fi QR payload format",
      expression: "WIFI:T:<security>;S:<network name>;P:<password>;;",
      note: "Security is WPA (which also covers WPA2/WPA3), WEP or nopass. The generator escapes special characters such as ; and : for you.",
    },
    {
      label: "Email payload format",
      expression: "mailto:<address>?subject=<subject>&body=<body>",
      note: "Subject and body are URL-encoded so spaces and punctuation survive the trip.",
    },
  ],
  examples: [
    {
      title: "A menu link on a restaurant table card",
      steps: [
        "Type: URL → https://example.com/menu",
        "Error correction: M, size 512 px, black on white",
        "Download PNG and place it at least 2.5 cm (1 inch) wide on the card",
      ],
      result: "A short, low-density code that scans quickly even in dim light.",
    },
    {
      title: "Guest Wi-Fi sign in a holiday rental",
      steps: [
        "Type: Wi-Fi → network name BeachHouse-Guest, security WPA, password entered",
        "Error correction: Q, in case the printed sign gets scuffed",
        "Download SVG and print at any size without blurring",
      ],
      result: "Guests point their camera at the sign and tap Join, with no typing.",
    },
    {
      title: "A support email with a pre-filled subject",
      steps: [
        "Type: Email → help@example.com, subject: Order enquiry",
        "Scanning opens the mail app with the address and subject already filled in",
      ],
      result: "Fewer emails arrive with a blank or unhelpful subject line.",
    },
  ],
  sections: [
    {
      heading: "Do QR codes expire?",
      paragraphs: [
        "Static QR codes, like the ones made here, never expire. The content is stored in the pattern itself, so the code works for as long as the link or information inside it stays valid. If the web page you point to disappears, the code will still scan but lead nowhere.",
        "Codes that expire are usually dynamic codes from subscription services. Those point to a short redirect URL owned by the provider, which lets you change the destination and count scans, but stops working if the account lapses. If you need to change the destination later without reprinting, point a static code at a page on your own domain that you control.",
      ],
    },
    {
      heading: "How do I make sure a QR code scans?",
      list: [
        "Keep strong contrast: a dark foreground on a light background. Inverted (light on dark) codes fail on some older scanners.",
        "Leave the margin (quiet zone) in place. Four modules of blank space is the standard; cropping it off is a common cause of failed scans.",
        "Print big enough. A rough rule is that the code should be about one tenth of the scanning distance, so a poster read from 2 m away needs a code around 20 cm wide.",
        "Keep the content short. A long URL makes a denser code with smaller squares; a shorter link scans more easily at the same size.",
        "Test on more than one phone before printing a large run.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is this QR code generator free for commercial use?",
      answer:
        "Yes. The codes are yours to use on packaging, flyers, signs or anything else, with no watermark and no attribution required.",
    },
    {
      question: "Should I download PNG or SVG?",
      answer:
        "PNG is a pixel image that suits web pages, slides and documents. SVG is a vector file that stays sharp at any size, so it is the better choice for print, signage and design tools like Illustrator, Figma or InDesign.",
    },
    {
      question: "Can I track how many people scan my QR code?",
      answer:
        "Not with a static code, because nothing sits between the phone and your content. To count visits, add campaign parameters (such as UTM tags) to your URL and check your website analytics.",
    },
    {
      question: "Which error correction level should I use?",
      answer:
        "M is a sensible default for screens and clean print. Choose Q or H for codes that may get scratched, dirty or partly covered, and L only when you need to fit a lot of data into a small code.",
    },
    {
      question: "Can I use brand colors?",
      answer:
        "Yes, but keep the foreground clearly darker than the background. Pale colors on white, or two mid-tones of similar brightness, are the most common reason a branded code will not scan.",
    },
    {
      question: "Is the Wi-Fi password stored anywhere?",
      answer:
        "No. The code is built in your browser and the password is never uploaded. Remember, though, that anyone who scans the printed code can read the password, so use a guest network for public signs.",
    },
  ],
};

export default content;
