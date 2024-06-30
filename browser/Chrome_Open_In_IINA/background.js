import { updateBrowserAction, openInIINA, getOptions } from "./common.js";

updateBrowserAction();

const dict = {
  page: "pageUrl",
  link: "linkUrl",
  video: "srcUrl",
  audio: "srcUrl",
};

Object.keys(dict).forEach((item) => {
  chrome.contextMenus.create({
    title: `Open this ${item} in IINA`,
    id: `openiniina_${item}`,
    contexts: [item],
  });
});

const dictYt = {
  YT: "yt",
  YT1440: "yt1440",
  YT1080: "yt1080",
};

["page", "link"].forEach((context) => {
  Object.keys(dictYt).forEach((item) => {
    chrome.contextMenus.create({
      title: `Open in IINA with ${item}`,
      id: `openiniina_${dictYt[item]}_${context}`,
      contexts: [context],
    });
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId.startsWith("openiniina")) {
    const key = info.menuItemId.split("_")[1];
    if (key.startsWith("yt")) {
      var context = info.menuItemId.split("_")[2];
      switch (context) {
        case "link":
          openInIINA(tab.id, info["linkUrl"], { mode: key }); return;
        case "page":
          openInIINA(tab.id, info["pageUrl"], { mode: key }); return;
      }
    }
    const url = info[dict[key]];
    if (url) {
      openInIINA(tab.id, url);
    }
  }
});

chrome.action.onClicked.addListener(() => {
  // get active window
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    if (tabs.length === 0) {
      return;
    }
    // TODO: filter url
    const tab = tabs[0];
    if (tab.id === chrome.tabs.TAB_ID_NONE) {
      return;
    }
    getOptions((options) => {
      openInIINA(tab.id, tab.url, {
        mode: options.iconActionOption,
      });
    });
  });
});
