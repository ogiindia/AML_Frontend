const otpPage = import('../pages/OtpPage');
const kbaPage = import('../pages/KbaPage');
const totpPage = import('../pages/TOTP');

export function triggerMFA(mfaType = null) {


    switch (mfaType) {
        case "OTP":
            showOverlay(otpPage);
            break;
        case "KBA":
            showOverlay(kbaPage);
            break;
        case "TOTP":
            showOverlay(totpPage);
            break
        default: break;
    }


}

export function showOverlay(content) {
    const overlay = document.createElement("div");
    overlay.id = "sdk-overlay";
    overlay.style.position = "fixed";
    overlay.style.overflow = "scroll";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.7)";
    overlay.style.zIndex = 9999;
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.color = "white";
    overlay.style.fontSize = "20px";
    overlay.style.padding = "20px";
    overlay.style.boxSizing = "border-box";
    overlay.innerHTML = `<div><div>
    ${content}
    </div>
    <button id="close-overlay" style="margin-top:20px; padding: 10px 20px; font-size:16px; cursor:pointer;">Close</button>
    </div>`;

    // console.log(overlay);
    document.body.appendChild(overlay);


    //for static buttons
    // const closeButton = document.getElementById("close-overlay");

    // if (closeButton) {
    //     console.log("it is present in dom");
    //     closeButton.addEventListener("click", () => {
    //         console.log(`Close button is clicked`);
    //         overlay.remove();
    //         //call cancel api...

    //     });
    // } else {
    //     console.error("Close button is not present in the dom");
    // }

    //for dynamic buttons 

    document.body.addEventListener("click", (event) => {
        if (event.target && event.target.id === "close-overlay") {
            console.log(`Close button Triggered`);
            overlay.remove();

            //call cancel api 
        }
    });


}