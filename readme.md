## Key Components

### Theme Switching

The landing page includes a dark/light theme toggle that respects the user's system preferences:

```javascript
// Check for saved theme or system preference
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark" || (!savedTheme && prefersDarkScheme.matches)) {
  document.documentElement.setAttribute("data-theme", "dark");
} else {
  document.documentElement.setAttribute("data-theme", "light");
}

// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", function () {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});
```

### 3D Model Viewer

The landing page features an interactive 3D model using Google's `<model-viewer>` component:

```html
<model-viewer
  id="logoModel"
  src="./assets/logo1.glb"
  alt="3D bull logo"
  camera-controls="false"
  auto-rotate="false"
  rotation-per-second="0deg"
  interaction-prompt="none"
  camera-orbit="0deg 90deg 1.0m"
  min-camera-orbit="auto auto auto"
  max-camera-orbit="auto auto auto"
  reveal="auto"
  disable-zoom
  disable-pan
>
</model-viewer>
```

The model responds to mouse movement with smooth animations:

```javascript
// Handle mouse movement with dampened effect
container.addEventListener("mousemove", (e) => {
  if (!isModelLoaded || !isMouseOver) return;

  const rect = container.getBoundingClientRect();

  // Calculate mouse position as percentage of container (-0.5 to 0.5)
  const mouseXPercent = (e.clientX - rect.left) / rect.width - 0.5;
  const mouseYPercent = (e.clientY - rect.top) / rect.height - 0.5;

  targetRotY = mouseXPercent * -10; // Invert X for natural movement
  targetRotX = 90 + mouseYPercent * -10; // Add to base 90 degrees
});
```

### Scroll Animations

Feature cards animate in as they enter the viewport:

```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  {
    threshold: 0.1,
  }
);

document.querySelectorAll(".feature-card").forEach((card) => {
  card.style.opacity = 0;
  card.style.transform = "translateY(20px)";
  card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  observer.observe(card);
});
```

## Customization

### Modifying Styles

The landing page uses CSS variables for easy theming. To modify the appearance:

1. Open `index.css` in your preferred code editor
2. Update the CSS variables in the `:root` selector to change global colors:

```css
:root {
  --primary: #b89d55;
  --primary-dark: #a58d4a;
  --text: #333333;
  --text-light: #666666;
  --background: #ffffff;
  --background-light: #f8f8f8;
  --navbar-bg: #f8f8f8;
  --border-color: #e0e0e0;
  --button-hover: #a58d4a;
  --accent: #e0e0e0;
}

[data-theme="dark"] {
  --primary: #d4b976;
  --primary-dark: #c9b980;
  --text: #f5f5f5;
  --text-light: #aaaaaa;
  --background: #0a0a0a;
  --background-light: #141414;
  --navbar-bg: #141414;
  --border-color: #333333;
  --button-hover: #e4c980;
  --accent: #3e3e3e;
}
```

### Updating Content

1. Open `index.html` to modify the page content
2. Replace text, images, and links as needed
3. Add or remove sections based on your requirements

### Modifying the 3D Model

To replace or modify the 3D model:

1. Create a new GLB file using Blender or another 3D modeling tool
2. Replace the `logo1.glb` file in the assets folder
3. Adjust the camera settings in the `<model-viewer>` element if needed

## Browser Support

BullUI Landing Page supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Mobile Responsiveness

The landing page is fully responsive and optimized for mobile devices:

- Collapsible navigation menu for small screens
- Fluid typography that scales with viewport size
- Responsive grid layouts that adapt to different screen sizes
- Touch-friendly interactive elements

## Contributing

We welcome contributions to improve the BullUI Landing Page! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Email: [bullui2425@gmail.com](mailto:bullui2425@gmail.com)
- Website: [www.bullui.com](https://www.bullui.com/)
- GitHub: [github.com/blackbullui](https://github.com/blackbullui)

---

© 2025 BullUI. All rights reserved.

```plaintext

This README provides a comprehensive overview of the BullUI Landing Page, including detailed information about its features, structure, and customization options. It also includes code snippets to highlight key functionality and provides clear instructions for getting started with the project.

<Actions>
  <Action name="Add CONTRIBUTING.md file" description="Create contributing guidelines for the repository" />
  <Action name="Create LICENSE file" description="Add an MIT license file to the repository" />
  <Action name="Add documentation for 3D model customization" description="Create detailed instructions for customizing the 3D model" />
  <Action name="Create deployment guide" description="Add instructions for deploying to various platforms" />
  <Action name="Add performance optimization tips" description="Document best practices for optimizing the landing page" />
</Actions>

```
