//This will always register if the browser is OPENED
//but after the installation if old sw is there
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => console.log("service worker registered", reg))
    .catch((err) => console.log("service worker not registered"));
}

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

let installbtn = document.getElementsByClassName("installbtn")[0];
installbtn.addEventListener("click", async () => {
  // Hide the app provided install promotion
  hideInstallPromotion();
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Optionally, send analytics event with outcome of user choice
  console.log(`User response to the install prompt: ${outcome}`);
  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt = null;
});
function showInstallPromotion() {
  installbtn.style.display = "inline";
}
function hideInstallPromotion() {
  installbtn.style.display = "none";
}
window.addEventListener("appinstalled", () => {
  // Hide the app-provided install promotion
  hideInstallPromotion();
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log("PWA was installed");
});
window.addEventListener("beforeinstallprompt", async (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  //Check if the app is already installed

  if ("getInstalledRelatedApps" in navigator) {
    let apps = await navigator.getInstalledRelatedApps();
    if (apps.length > 0) {
      return;
    }
  }
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});

//to track how the PWA was launched
function getPWADisplayMode() {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  if (document.referrer.startsWith("android-app://")) {
    return "twa";
  } else if (navigator.standalone || isStandalone) {
    return "standalone";
  }
  return "browser";
}

//listen to display mode changes
// window.matchMedia("(display-mode: standalone)").addEventListener((evt) => {
//   let displayMode = "browser";
//   if (evt.matches) {
//     displayMode = "standalone";
//   }
//   // Log display mode change to analytics
//   console.log("DISPLAY_MODE_CHANGED", displayMode);
// });
