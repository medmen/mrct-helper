/*
Listen for clicks in the popup.

If it's on a button which contains class "clear":
  Reload the page.
  Close the popup. This is needed, as the content script malfunctions after page reloads.
*/

document.addEventListener("click", (e) => {
  if (e.target.id === "CT") {
    browser.tabs.executeScript(null, { 
      code: `fill_myform();`
    });
  }
  else if (e.target.id === "MR-STRESS") {
    browser.tabs.executeScript({ 
      file: "mrct-helper.js",
      code: `fill_myform();`
    });
  }
  else if (e.target.id === "MR-ITIS") {
 	alert('Hit Itis'); 
    browser.tabs.executeScript(null, { 
      file: "mrct-helper.js" 
    });
  }
  else if (e.target.classList.contains("clear")) {
    browser.tabs.reload();
    window.close();
  }
});
