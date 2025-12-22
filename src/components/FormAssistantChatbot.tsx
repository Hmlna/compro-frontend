import { useEffect } from "react";

export const FormAssistantChatbot = () => {
  useEffect(() => {
    const WIDGET_ROOT_ID = "JotformAgent-019b1cfd770f77a5ba98b08b3fb4724e3db2";

    const sanitizeVariables = (url: string, width: number, height: number) => {
      try {
        const sanitizedUrl = new URL(url);
        const urlStr = sanitizedUrl.toString();
        const w = parseInt(width.toString());
        const h = parseInt(height.toString());
        return { url: urlStr, width: w, height: h };
      } catch (e) {
        console.error("Error sanitizing variables", e);
        return { url: "", width: 0, height: 0 };
      }
    };

    const handlePictureInPictureRequest = async (event: MessageEvent) => {
      if (event.data.type !== "jf-request-pip-window") {
        return;
      }
      const { _url, _width, _height } = event.data;
      const { url, width, height } = sanitizeVariables(_url, _width, _height);

      if (url === "" || width === 0 || height === 0) {
        return;
      }

      if ("documentPictureInPicture" in window) {
        // @ts-expect-error - documentPictureInPicture types might not be available in all TS configs
        if (window.documentPictureInPicture.window) {
          return;
        }

        // @ts-expect-error - documentPictureInPicture types
        const pipWindow = await window.documentPictureInPicture.requestWindow({
          width,
          height,
          disallowReturnToOpener: true,
        });

        Array.from(document.styleSheets).forEach((styleSheet) => {
          try {
            const cssRules = Array.from(styleSheet.cssRules)
              .map((rule) => rule.cssText)
              .join("");
            const style = document.createElement("style");
            style.textContent = cssRules;
            pipWindow.document.head.appendChild(style);
          } catch (error) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = styleSheet.type;
            link.media = styleSheet.media?.toString() || "";
            link.href = styleSheet.href || "";
            pipWindow.document.head.appendChild(link);

            console.error(error);
          }
        });

        pipWindow.document.body.innerHTML = `<iframe src="${url}" style="width: ${width}px; height: ${height}px;" allow="microphone *; display-capture *;"></iframe>`;
      }
    };

    const initChatbot = () => {
      // @ts-expect-error - AgentInitializer is added to window by the external script
      if (window.AgentInitializer) {
        // @ts-expect-error - AgentInitializer is added to window
        window.AgentInitializer.init({
          agentRenderURL:
            "https://www.noupe.com/agent/019b1cfd770f77a5ba98b08b3fb4724e3db2",
          rootId: WIDGET_ROOT_ID,
          formID: "019b1cfd770f77a5ba98b08b3fb4724e3db2",
          contextID: "019b41821c8a7543acf5d96cc82a472e5bb1",
          initialContext: "",
          queryParams: [
            "skipWelcome=1",
            "maximizable=1",
            "isNoupeAgent=1",
            "isNoupeLogo=0",
            "noupeSelectedColor=%23000000",
            "B_VARIANT_AUTO_OPEN_NOUPE_CHATBOT_ON_PREVIEW=34462",
          ],
          domain: "https://www.noupe.com",
          isDraggable: false,
          buttonBackgroundColor: "#000000",
          background: "linear-gradient(180deg, #000000 0%, #000000 100%)",
          buttonIconColor: "#FFFFFF",
          inputTextColor: "#01105C",
          variant: false,
          customizations: {
            greeting: "Yes",
            greetingMessage: "Hi! How can I assist you with your request?",
            openByDefault: "No",
            pulse: "Yes",
            position: "right",
            autoOpenChatIn: "0",
            layout: "square",
          },
          isVoice: false,
          isVoiceWebCallEnabled: false,
        });
      }
    };

    window.addEventListener("message", handlePictureInPictureRequest);

    const scriptSrc =
      "https://www.noupe.com/s/umd/2adf5bfd6eb/for-embedded-agent.js";

    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
      initChatbot();
    } else {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.onload = initChatbot;
      document.head.appendChild(script);
    }

    return () => {
      window.removeEventListener("message", handlePictureInPictureRequest);

      const widgetElement = document.getElementById(WIDGET_ROOT_ID);
      if (widgetElement) {
        widgetElement.remove();
      }
    };
  }, []);

  return null;
};
