import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { invoke } from "@tauri-apps/api/tauri";
import { WebRTCPlayer } from "@eyevinn/webrtc-player";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  greetingMessage = "";

  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();

    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    invoke<string>("greet", { name }).then((text) => {
      this.greetingMessage = text;
    });
  }

  async ngAfterViewInit() {
    try {
      // Create a new video element and append it to the div
      const videoElement = document.createElement("video");
      videoElement.setAttribute("autoplay", "true");
      videoElement.setAttribute("controls", "true");
      videoElement.setAttribute("playsinline", "true");
      videoElement.setAttribute("muted", "true");
      videoElement.setAttribute("width", "440");
      videoElement.setAttribute("height", "280");
      videoElement.style.border = "1px solid black";

      let videoContainer = document.querySelector(
        ".stream-container"
      ) as HTMLDivElement;

      videoContainer.appendChild(videoElement);

      
      const player = new WebRTCPlayer({
        video: videoElement,
        type: "whep",
      });

      player.load(new URL(`https://localhost:8889/0/whep`));


      videoElement.addEventListener("loadedmetadata", () => {
        console.log("Stream loaded");
        videoElement.play();
      });

      videoElement.addEventListener("error", () => {
        console.log("Error loading stream");
      });
    } catch (error) {
      console.error("Error initializing stream from catch:", error);
    }
  }

}
