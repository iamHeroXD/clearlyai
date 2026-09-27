import shadowStyles from './styles/shadow.css?inline';

let shadowRootInstance: ShadowRoot | null = null;
let containerElement: HTMLDivElement | null = null;

export function getOrCreateShadowRoot(): { shadowRoot: ShadowRoot; container: HTMLDivElement } {
  if (shadowRootInstance && containerElement && document.documentElement.contains(containerElement.parentElement)) {
    return { shadowRoot: shadowRootInstance, container: containerElement };
  }

  const existingHost = document.getElementById('clearly-host-container');
  if (existingHost) {
    existingHost.remove();
  }

  const host = document.createElement('div');
  host.id = 'clearly-host-container';
  host.style.position = 'fixed';
  host.style.top = '0';
  host.style.left = '0';
  host.style.width = '100vw';
  host.style.height = '100vh';
  host.style.pointerEvents = 'none';
  host.style.zIndex = '2147483647';
  host.style.overflow = 'visible';

  const shadowRoot = host.attachShadow({ mode: 'open' });

  const styleTag = document.createElement('style');
  styleTag.textContent = shadowStyles;
  shadowRoot.appendChild(styleTag);

  const container = document.createElement('div');
  container.className = 'clearly-root';
  shadowRoot.appendChild(container);

  (document.body || document.documentElement).appendChild(host);

  shadowRootInstance = shadowRoot;
  containerElement = container;

  return { shadowRoot, container };
}
