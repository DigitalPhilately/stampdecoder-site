(function () {
  "use strict";

  var measurementId = "G-J3NQ2YL5E5";
  var consentKey = "stampdecoder_analytics_consent";
  var banner;

  function loadAnalytics() {
    if (document.querySelector("script[data-stampdecoder-ga]")) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted"
    });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    var script = document.createElement("script");
    script.async = true;
    script.dataset.stampdecoderGa = "true";
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  function clearAnalyticsCookies() {
    document.cookie.split(";").forEach(function (cookie) {
      var name = cookie.split("=")[0].trim();
      if (name.indexOf("_ga") !== 0) return;

      document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax";
      document.cookie = name + "=; Max-Age=0; path=/; domain=.stampdecoder.app; SameSite=Lax";
    });
  }

  function showBanner() {
    banner.hidden = false;
    banner.querySelector("[data-analytics-accept]").focus();
  }

  function hideBanner() {
    banner.hidden = true;
  }

  function saveConsent(value) {
    try {
      window.localStorage.setItem(consentKey, value);
    } catch (error) {
      // The choice still applies for the current page if storage is unavailable.
    }
  }

  function getConsent() {
    try {
      return window.localStorage.getItem(consentKey);
    } catch (error) {
      return null;
    }
  }

  function buildBanner() {
    banner = document.createElement("aside");
    banner.className = "analytics-consent";
    banner.hidden = true;
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Analytics choices");
    banner.innerHTML =
      '<div class="analytics-consent__inner">' +
        '<div class="analytics-consent__copy">' +
          '<strong>Help us understand website visits?</strong>' +
          '<p>With your permission, we use Google Analytics to count visits and see which pages are useful. The app itself has no analytics or tracking. <a href="/privacy/">Privacy details</a>.</p>' +
        '</div>' +
        '<div class="analytics-consent__actions">' +
          '<button type="button" data-analytics-reject>Reject</button>' +
          '<button type="button" data-analytics-accept>Accept analytics</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    banner.querySelector("[data-analytics-accept]").addEventListener("click", function () {
      saveConsent("accepted");
      hideBanner();
      loadAnalytics();
    });

    banner.querySelector("[data-analytics-reject]").addEventListener("click", function () {
      var wasAccepted = getConsent() === "accepted";
      saveConsent("rejected");
      clearAnalyticsCookies();
      hideBanner();
      if (wasAccepted) window.location.reload();
    });

    document.querySelectorAll("[data-analytics-settings]").forEach(function (button) {
      button.addEventListener("click", showBanner);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildBanner();

    var consent = getConsent();
    var settingsRequested = new URLSearchParams(window.location.search).get("cookie-settings") === "1";

    if (consent === "accepted") loadAnalytics();
    if (!consent || settingsRequested) showBanner();
  });
}());
