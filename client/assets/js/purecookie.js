let purecookieTitle = "Cookies";
let purecookieDesc = "By using this website, you automatically accept that we use cookies.";
let purecookieLink = '<a href="cookie-policy.html" target="_blank">What for?</a>';
let purecookieButton = "Understood";

function pureFadeIn(elem, display) {
    let el = document.getElementById(elem);
    el.style.opacity = "0";
    el.style.display = display || "block";

    (function fade() {
        let val = parseFloat(el.style.opacity);
        if (!((val += .02) > 1)) {
            el.style.opacity = val.toString();
            requestAnimationFrame(fade);
        }
    })();
}

function pureFadeOut(elem) {
    let el = document.getElementById(elem);
    el.style.opacity = "1";

    (function fade() {
        if ((el.style.opacity -= "0.02") < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function cookieConsent() {
    if (!getCookie('purecookieDismiss')) {
        document.body.innerHTML += '<div class="cookieConsentContainer" id="cookieConsentContainer">' +
            '<div class="row">' +
            '<div class="col-sm" >' +
            '<div class="cookieTitle"><a>' + purecookieTitle + '</a></div>' +
            '<div class="cookieDesc"><p>' + purecookieDesc + ' ' + purecookieLink + '</p></div></div>' +
            '<div class="col-sm" >' +
            '<div class="cookieButton"><a onClick="purecookieDismiss();">' + purecookieButton + '</a></div></div></div></div></div>';
        pureFadeIn("cookieConsentContainer");
    }
}

function purecookieDismiss() {
    setCookie('purecookieDismiss', '1', 7);
    pureFadeOut("cookieConsentContainer");
}

window.onload = function () {
    cookieConsent();
};