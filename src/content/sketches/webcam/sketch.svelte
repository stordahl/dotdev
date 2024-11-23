<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  
  let videoElement: HTMLVideoElement;
  let canvasElement: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let animationFrame: number | null = null;
  let error = '';
  
  const GRID_SIZE = 20;
  
  type WebcamError = {
    name: string;
    message: string;
  };
  
  function getErrorMessage(err: WebcamError): string {
    switch (err.name) {
      case 'NotAllowedError':
        return 'Camera access was denied. Please grant permission to use your webcam.';
      case 'NotFoundError':
        return 'No camera found. Please connect a webcam and refresh the page.';
      case 'NotReadableError':
        return 'Camera is already in use by another application.';
      case 'OverconstrainedError':
        return 'Could not find a suitable camera.';
      default:
        return err.message;
    }
  }
  
  async function initializeWebcam(): Promise<void> {
    try {
      if (!browser) return;
      
      // Handle insecure context (like localhost)
      const constraints: MediaStreamConstraints = { video: true };
      if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
        throw new Error('Webcam access requires HTTPS unless on localhost');
      }
      
      const stream = await navigator.mediaDevices?.getUserMedia(constraints);
      if (!videoElement) return; // Component might have been destroyed
      
      videoElement.srcObject = stream;
      await videoElement.play();
      
      function processFrame(): void {
        if (!ctx || !videoElement) return;
        
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;
        
        if (width === 0 || height === 0) {
          animationFrame = requestAnimationFrame(processFrame);
          return;
        }
        
        canvasElement.width = width;
        canvasElement.height = height;
        
        ctx.drawImage(videoElement, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
        
        for (let y = 0; y < height; y += GRID_SIZE) {
          for (let x = 0; x < width; x += GRID_SIZE) {
            let totalBrightness = 0;
            let pixelCount = 0;
            
            for (let dy = 0; dy < GRID_SIZE && y + dy < height; dy++) {
              for (let dx = 0; dx < GRID_SIZE && x + dx < width; dx++) {
                const i = ((y + dy) * width + (x + dx)) * 4;
                const brightness = 
                  data[i] * 0.299 + 
                  data[i + 1] * 0.587 + 
                  data[i + 2] * 0.114;
                totalBrightness += brightness;
                pixelCount++;
              }
            }
            
            const avgBrightness = totalBrightness / pixelCount;
            const grayValue = Math.floor(avgBrightness);
            
            ctx.fillStyle = `rgb(${grayValue},${grayValue},${grayValue})`;
            ctx.fillRect(x, y, GRID_SIZE - 1, GRID_SIZE - 1);
          }
        }
        
        animationFrame = requestAnimationFrame(processFrame);
      }
      
      processFrame();
      
    } catch (err) {
      console.error('Error accessing webcam:', err);
      error = getErrorMessage(err as WebcamError);
    }
  }
  
  onMount(() => {
    if (browser) {
      if (!navigator.mediaDevices?.getUserMedia) {
        error = 'Your browser does not support webcam access';
        return;
      }
      initializeWebcam();
    }
  });
  
  onDestroy(() => {
    if (browser) {
      if (videoElement?.srcObject instanceof MediaStream) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
      }
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    }
  });
</script>

<div class="webcam-grid">
  {#if error}
    <p class="error">{error}</p>
  {/if}
  <video 
    bind:this={videoElement} 
    style="display: none;"
    aria-hidden="true"
  ></video>
  <canvas 
    bind:this={canvasElement}
  ></canvas>
</div>

<style>
  .webcam-grid {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  canvas {
    max-width: 100%;
    max-height: 100%;
  }
  
  .error {
    color: var(--orange);
    text-align: center;
    padding: 1rem;
    margin: 1rem;
    border: 1px solid var(--orange);
    border-radius: 4px;
    background: rgba(255, 62, 0, 0.1);
  }
</style>
