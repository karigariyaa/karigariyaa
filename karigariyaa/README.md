# Karigariyaa — Website Project

## Folder Structure
```
karigariyaa/
├── index.html      ← Main website
├── style.css       ← All styles
├── script.js       ← Interactivity
├── images/         ← All product photos (extracted from catalogue)
│   ├── image1.jpeg
│   ├── image2.jpeg
│   └── ... (44 images total)
└── README.md
```

## How to Open in VS Code
1. Open VS Code
2. File → Open Folder → select the `karigariyaa` folder
3. Right-click `index.html` → Open with Live Server (install Live Server extension first)

## To Add Your UPI QR Code
Replace the `.qr-placeholder` div in `index.html` with:
```html
<img src="images/your-qr-code.png" alt="UPI QR Code" style="width:180px;height:180px;" />
```

## Product Names
Update product names/categories in `index.html` to match your actual product names.

## WhatsApp Number
Currently set to: +91 79999 61630
To change, search for `wa.me/917999961630` in index.html and replace with your number.

## To Host on GitHub Pages
1. Create a new GitHub repository
2. Upload all files (including the `images` folder)
3. Go to Settings → Pages → Source: main branch
4. Your site will be live at: https://yourusername.github.io/karigariyaa
