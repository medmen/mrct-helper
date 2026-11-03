/*
Listen for clicks in the popup.

If it's on a button which contains class "clear":
  Reload the page.
  Close the popup. This is needed, as the content script malfunctions after page reloads.
*/

document.addEventListener("click", async (e) => {
  const formtypes = {
    "CT": "CT_KHK",
    "MR-STRESS": "MRT_STRESS",
    "MR-ITIS": "MRT_ITIS_3T"
  };
  if (Object.hasOwn(formtypes, e.target.id)) {
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: formtype => fill_myform(formtype),
        args: [formtypes[e.target.id]]
      });
    } catch (error) {
      console.error("Could not fill form from popup.", error);
    }
  }
  else if (e.target.classList.contains("clear")) {
    browser.tabs.reload();
    window.close();
  }
});
