import type { Action } from "svelte/action";
import kebabCase from "just-kebab-case";

export const sidebar: Action<HTMLElement, { marginTop: number }> = (node, { marginTop }) => {
    const headings = document.querySelectorAll(".content > *:is(h2, h3, h4, h5, h6)") 
    if (headings.length === 0) {
      node.remove();
      return;
    }
    const links: HTMLAnchorElement[] = []
    const headingElements: HTMLElement[] = []

    for (const heading of headings) {
      const id = kebabCase(heading.textContent!);
      heading.setAttribute("id", id);
      if (heading instanceof HTMLElement) {
        heading.style.scrollMarginTop = `calc(${marginTop}px + 1rem)`
        headingElements.push(heading)
      }
      const link = document.createElement("a")
      link.textContent = heading.textContent
      link.setAttribute("href", `#${id}`)
      link.style.width = "fit-content";
      link.style.color = "#818181";
      link.style.fontSize = "0.9rem";
      links.push(link)
      node.appendChild(link)
    }

    const updateActiveLink = () => {
      const scrollPosition = window.scrollY + (marginTop / 4); // Add a small offset
      let activeHeading: HTMLElement | null = null;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        if (headingElements[i].offsetTop <= scrollPosition) {
          activeHeading = headingElements[i];
          break;
        }
      }

      links.forEach((link) => {
        if (activeHeading && link.getAttribute('href') === `#${activeHeading.id}`) {
          link.style.color = 'var(--white)'; // Change to your desired active color
        } else {
          link.style.color = '#818181'; // Reset to default color
        }
      });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call to set the active link on page load

    return {
      destroy() {
        links.forEach(link => link.remove());
        window.removeEventListener('scroll', updateActiveLink);
      }
    }
}
