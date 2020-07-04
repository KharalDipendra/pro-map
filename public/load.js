$("#form").submit(function(e) {
  e.preventDefault();
  search();
});
const changeTab = tab => {
  $("#about").css("z-index", -1);
  $("#map").css("z-index", -1);
  $("#options").css("z-index", -1);
  $("#" + tab).css("z-index", 2);

  const btnAbout = $("#btn-about");
  const btnMap = $("#btn-map");
  const btnOpts = $("#btn-options");

  let a = "active";
  if (btnAbout.hasClass(a)) btnAbout.removeClass(a);
  if (btnMap.hasClass(a)) btnMap.removeClass(a);
  if (btnOpts.hasClass(a)) btnOpts.removeClass(a);

  if (!$("#btn-" + tab).hasClass(a)) $("#btn-" + tab).addClass(a);
  $("#about").css("display", "none");
  $("#map").css("display", "none");
  $("#options").css("display", "none");
  $("#" + tab).css("display", "block");
  $("#" + tab).css("animation", "fadeIn 0.1s ease-in");
  setTimeout(() => {
    $("#about").css("display", "block");
    $("#map").css("display", "block");
    $("#options").css("display", "block");
    $("#" + tab).css("animation", "none");
  }, 100);
};
const fitMap = () => {
  $("#map-inner-cont").css("position", "absolute");
  $("#map-inner-cont").css("left", 0);
  if (window.innerHeight > window.innerWidth) {
    $("#map-inner-cont").css("position", "relative");
    $("#map-inner-cont").css("width", "94%");
    $("#map-inner-cont").css("left", "3%");
    $("#data").css("position", "relative");
    $("#data").css("left", "3%");
    $("#data").css("margin-top", "20px");
    $("#data").css("width", "94%");
    return;
  } else {
    $("#map-inner-cont").css("position", "absolute");
    $("#map-inner-cont").css("width", "48%");
    $("#map-inner-cont").css("left", "1%");
    $("#data").css("position", "absolute");
    $("#data").css("left", "51%");
    $("#data").css("top", "5%");
    $("#data").css("margin-top", "0px");
    $("#data").css("width", "48%");
  }
};
$(() => {
  fitMap();
});
fitMap();
fitMap();
fitMap();
document.onload = fitMap;
window.addEventListener("resize", fitMap);
window.addEventListener("load", fitMap);

let mic = document.getElementById("map-inner-cont");
let isd = false;
let px = 0;
let py = 0;
mic.addEventListener("mouseup", evt => {
  evt.preventDefault();
  isd = false;
});
mic.addEventListener("mousemove", evt => {
  evt.preventDefault();
  if (px != 0 && py != 0 && isd) {
    let x = px - evt.clientX;
    let y = py - evt.clientY;
    mic.scrollTop += y;
    mic.scrollLeft += x;
  }
  px = evt.clientX;
  py = evt.clientY;
});
mic.addEventListener("mousedown", evt => {
  evt.preventDefault();
  isd = true;
});
