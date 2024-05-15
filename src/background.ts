chrome.runtime.onMessage.addListener(
  (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (message.type === "getCurrentTabUrl") {
      getCurrentTabUrl().then((url) => {
        sendResponse(url);
      });
      return true;
    }

    if (message.type === "getCurrentTabHtml") {
      getCurrentTabHtml().then((html) => {
        sendResponse(html);
      });
      return true;
    }
  }
);

const getCurrentTabUrl = async (): Promise<string> => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  const url = tab.url;
  return url!;
};

const getCurrentTabHtml = async (): Promise<string> => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  // Inject a script to retrieve the HTML content
  const html = await chrome.tabs.executeScript(tab.id!, {
    code: "document.documentElement.outerHTML;",
  });

  return html[0];
};
