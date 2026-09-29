/* ErgMath engine - honest rowing ergometer math. */
(function (root) {
  "use strict";

  /* Watts from split (seconds per 500m): W = 2.8 * (500/split)^3. */
  function wattsFromSplit(splitSec) {
    if (splitSec <= 0) return 0;
    var p = 500 / splitSec;
    return Math.round(2.8 * p * p * p * 10) / 10;
  }

  /* Split (sec/500m) from watts. */
  function splitFromWatts(watts) {
    if (watts <= 0) return Infinity;
    return Math.round(500 * Math.pow(2.8 / watts, 1 / 3) * 10) / 10;
  }

  /* Format seconds as m:ss.s for a 500m split. */
  function formatSplit(sec) {
    if (!isFinite(sec)) return "n/a";
    var m = Math.floor(sec / 60);
    var s = sec - m * 60;
    return m + ":" + (s < 10 ? "0" : "") + s.toFixed(1);
  }

  /* Distance (m) covered in minutes at a split. */
  function distanceInMinutes(splitSec, minutes) {
    if (splitSec <= 0) return 0;
    return Math.round((minutes * 60 / splitSec) * 500);
  }

  /* Time (seconds) for a distance at a split. */
  function timeForDistance(splitSec, meters) {
    return Math.round((meters / 500) * splitSec * 10) / 10;
  }

  /* Predicted 2k time (seconds) from a sustainable split. */
  function predicted2k(splitSec) {
    return Math.round(splitSec * 4);
  }

  /* Honest calories: the monitor shows 4*W + 300 for a 175 lb body;
     scale the basal part by actual weight. */
  function kcalPerHour(watts, weightLb) {
    var w = typeof weightLb === "number" && weightLb > 0 ? weightLb : 175;
    var basal = 300 * (w / 175);
    return Math.round(4 * watts + basal);
  }

  /* Drag factor estimate from damper setting (1-10). */
  function dragFromDamper(damper) {
    var d = Math.min(10, Math.max(1, damper));
    return Math.round(85 + d * 12);
  }

  function dragVerdict(drag) {
    if (drag < 110) return "light - quick catch, suits smaller or technique-focused rows";
    if (drag <= 140) return "the sweet spot most rowers settle on";
    if (drag <= 170) return "heavy - strong legs only, watch the back";
    return "very heavy - feels like a tank, not a faster workout";
  }

  /* 2k watt bands (rough, open male / female, mid-weight). */
  function wattBand(watts, sex) {
    var bands = sex === "female"
      ? [[120, "recreational"], [180, "fit"], [240, "competitive club"], [300, "national level"]]
      : [[150, "recreational"], [220, "fit"], [300, "competitive club"], [400, "national level"]];
    var label = bands[0][1];
    for (var i = 0; i < bands.length; i++) {
      if (watts >= bands[i][0]) label = bands[i][1];
    }
    return label;
  }

  /* Weight-adjusted score: watts per kg, the comparison that matters
     across body sizes. */
  function wattsPerKg(watts, weightLb) {
    var kg = weightLb / 2.205;
    return Math.round((watts / kg) * 100) / 100;
  }

  /* Honest steady-state split: 2k split plus a band by piece length. */
  function steadySplit(split2kSec, piece) {
    var add = 18;
    if (piece === "30min") add = 14;
    else if (piece === "60min") add = 20;
    else if (piece === "5k") add = 12;
    return Math.round((split2kSec + add) * 10) / 10;
  }

  var api = {
    wattsFromSplit: wattsFromSplit,
    splitFromWatts: splitFromWatts,
    formatSplit: formatSplit,
    distanceInMinutes: distanceInMinutes,
    timeForDistance: timeForDistance,
    predicted2k: predicted2k,
    kcalPerHour: kcalPerHour,
    dragFromDamper: dragFromDamper,
    dragVerdict: dragVerdict,
    wattBand: wattBand,
    wattsPerKg: wattsPerKg,
    steadySplit: steadySplit
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.ErgMath = api;
})(typeof window !== "undefined" ? window : globalThis);
