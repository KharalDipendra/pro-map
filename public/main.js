let setMode,
  dat = [],
  spots,
  locs = [],
  cs = [],
  pokes = [],
  MODE = "loc",
  poke,
  loc,
  lod,
  getSpotData,
  setPokemon,
  locdatas, headbutt, digspot, search;

const daytime = inp => {
  let M = inp[0] == 1;
  let D = inp[1] == 1;
  let N = inp[2] == 1;

  let res = "";
  if (M == true && D == true && N == true) {
    res = "M/D/N";
  } else if (M == true && D == true && N == false) {
    res = "M/D";
  } else if (M == true && D == false && N == true) {
    res = "M/N";
  } else if (M == true && D == false && N == false) {
    res = "M";
  } else if (M == false && D == false && N == true) {
    res = "N";
  } else if (M == false && D == true && N == true) {
    res = "D/N";
  } else if (M == false && D == true && N == false) {
    res = "D";
  } else {
    res = "Ugh";
  }

  return res;
};
$(async() => {
  dat = [];
  spots = $("#spots");
  lod = $("#loading");
  locs = [];
  pokes = [];
  cs = [];
  MODE = "loc";
  poke = $("#selection");
  loc = $("#locsel");

  function remp(spot) {
    spot = spot.replace(/p1/, "").trim();
    spot = spot.replace(/p2/, "").trim();
    spot = spot.replace(/p3/, "").trim();
    spot = spot.replace(/p4/, "").trim();
    spot = spot.replace(/p5/, "").trim();
    spot = spot.replace(/p6/, "").trim();
    spot = spot.replace(/p7/, "").trim();
    spot = spot.replace(/p8/, "").trim();
    spot = spot.replace(/p9/, "").trim();
    spot = spot.replace(/p10/, "").trim();
    return spot;
  }

  setMode = m => {
    MODE = m;
    if (MODE == "poke") {
      loc.css("display", "none");
      poke.css("display", "inline-block");
      $("#btn-poke").addClass("active");
      $("#btn-loc").removeClass("active");
    } else {
      loc.css("display", "inline-block");
      poke.css("display", "none");
      $("#btn-poke").addClass("active");
      $("#btn-loc").removeClass("active");
      if (cs.length != 0) {
        cs.forEach(e => {
          e.style.opacity = 0.0;
        });
        cs = [];
      }
    }
  };

  async function addSpots() {
    let data = await fetch(
      window.location.protocol + "//" + window.location.host + "/lspawns"
    );
    dat = await data.json();
    locations();
    pokemons();
    let spots = await fetch(
      window.location.protocol + "//" + window.location.host + "/spots3"
    );
    spots = await spots.json();
    locdatas = await fetch(
      window.location.protocol + "//" + window.location.host + "/locs"
    );
    headbutt = await fetch(
      window.location.protocol + "//" + window.location.host + "/headbutt"
    );
    headbutt = await headbutt.json();
    digspot = await fetch(
      window.location.protocol + "//" + window.location.host + "/digspot"
    );
    digspot = await digspot.json();
    locdatas = await locdatas.json();
    makeSpots(spots);
  }

  async function makeSpots(data) {
    let htmlDat = "";
    for (var spot in data) {
      let dat = data[spot];
      let info = locdatas[remp(spot)];
      let col = "";
      if (info) {
        col = "red";
      } else {
        col = "var(--col-cyan)";
      }
      if (dat.x == 0 && dat.y == 0) {
      } else {
        spot = spot;
        htmlDat += `<div class="spot tooltip"style="top:${dat.y}px; left:${
          dat.x
        }px;" id="${spot}" onclick="getSpotData('${spot}\')"><span class="bottom"><span style="color:${col};">${remp(
          spot
        )}</span></span><div class="draw"></div></div>`;
      }
    }
    spots.html(htmlDat);
    lod.css("animation", "goup 1.2s linear 0s 1");
    setTimeout(() => {
      lod.css("display", "none");
    }, 600);
  }

  async function locations() {
    dat.forEach(d => {
      find = locs.find(m => m == d.Map);
      if (!find) {
        locs.push(d.Map);
      }
    });
  }

  async function pokemons() {
    dat.forEach(d => {
      find = pokes.find(m => m == d.Pokemon);
      if (!find) {
        pokes.push(d.Pokemon);
      }
    });
    pokes = pokes.sort();
    poke.html(pokes.map(p => `<option value="${p}">${p}</option>`).join(""));
    //poke.innerHTML = poke.innerText.slice()
  }

  getSpotData = spot => {
    setMode("loc");
    getLocInfo(spot);
    let spawns = { innerHTML: "" };
    let find;
    let dig_data = digspot.find(sp=>sp.loc.toLowerCase()==remp(spot).toLowerCase());
    let hb_data = headbutt.find(sp=>sp.loc.toLowerCase()==remp(spot).toLowerCase());
    if (!spot.startsWith("Route")) {
      find = dat.find(d => d.Map.toLowerCase().startsWith(spot.toLowerCase()));
    } else {
      //alert("hi");
      find = dat.find(d => d.Map.toLowerCase() === remp(spot.toLowerCase()));
    }
    if (!find) {
      $("#inner-data").html("");
      getLocInfo(spot);
      $("#inner-data").html(
        "No spawns at " +
          remp(spot) +
          '.' +
          $("#inner-data").html()
      );
      return changeTab("map");
    }
    spawns.innerHTML =
      '<h2 style="color:var(--col-cyan);">' + remp(find.Map) + "</h2>";
    let sp;
    if (!spot.startsWith("Route")) {
      sp = dat.filter(d => {
        return d.Map.toLowerCase().startsWith(find.Map.toLowerCase());
      });
    } else {
      sp = dat.filter(d => {
        return d.Map.toLowerCase() == find.Map.toLowerCase();
      });
    }
    sp = sp.sort((a, b) => b.Tier - a.Tier);
    let info = locdatas[remp(spot)];
    let dt = "";
    if (info) {
      dt += ``;
    }
    dt += sp
      .map(
        d =>
          `
<div class="sdata">
<span style="font-size: 20px;color:var(--col-cyan); padding-top: 4px; padding-bottom: 4px;">#${
            d.MonsterID
          } ${d.Pokemon}</span>
<br>
<b>Daytime</b> - ${daytime(d.Daytime)}, 
<b>Level Range</b> - ${d.MinLVL} to ${d.MaxLVL}, <b>Tier</b> - ${
            d.Tier
          }, <b>Item</b> - ${d.Item || "None"}, <b>MS</b>: ${
            d.MemberOnly == true ? "Yes" : "No"
          }, <b>Fishing</b> - ${d.Fishing != undefined ? "Surf/Fish" : "Land"}
</div>
		`
      )
      .join("");
    let d = {};
    if(dig_data){
       d = dig_data;
      //console.log("dig")
      dt = `
<div class="sdata">
<span style="font-size: 20px;color:var(--col-cyan); padding-top: 4px; padding-bottom: 4px;">Digspots Data</span>
<br>
<b>Pokémon</b>: ${d.pokes.join(", ")}<br>
<b>Items</b>: ${d.items.join(", ")}
</div>
		`+ dt;
    }
    if(hb_data){
       d = hb_data;
      //console.log("hb")
      dt = `
<div class="sdata">
<span style="font-size: 20px;color:var(--col-cyan); padding-top: 4px; padding-bottom: 4px;">Headbutt Data</span>
<br>
<b>Pokémon</b>: ${d.pokes.join(", ")}<br>
<b>Items</b>: ${d.items.join(", ")}
</div>
		`+ dt;
    }
    spawns.innerHTML += dt;
    changeTab("map");
    $("#locsel").html(
      'Location: <a href="javascript:void(0);" style="color:var(--col-cyan);" onclick="changeTab(\'map\')">' +
        remp(spot) +
        "</a>"
    );
    $("#inner-data").html($("#inner-data").html() + spawns.innerHTML);
    if (window.innerHeight > window.innerWidth) {
      window.location.href = "#data";
    }
  };

  setPokemon = (pke) => {
    {
      let spawns = { innerHTML: "" };
      let psel = document.getElementById("selection");
      if (cs.length != 0) {
        cs.forEach(e => {
          e.style.opacity = 0.0;
        });
        cs = [];
      }
      spawns.innerHTML = "Searching...";
      let sel = pke||psel.options[psel.selectedIndex].value;
      let sps = dat.filter(p => p.Pokemon.toLowerCase() == sel.toLowerCase());
      let bs = [...document.getElementById("spots").children];
      spawns.innerHTML = `<h2 style="color: var(--col-cyan);">${sel}</h2>`;
      sps.forEach(s => {
        let f;
        if (!s.Map.startsWith("Route")) {
          f = bs.find(sp =>
            s.Map.toLowerCase().startsWith(remp(sp.id).toLowerCase())
          );
        } else {
          f = bs.find(sp => s.Map.toLowerCase() == remp(sp.id.toLowerCase()));
        }
        if (!f) return;
        if (s.Pokemon == sel) {
          f = [...f.children].find(el => el.className == "draw");
          f.style.opacity = "0.6";
          f.Tier = s.Tier;
          f.MemberOnly = s.MemberOnly;
          f.Map = s.Map;
          f.Fishing = s.Fishing;
          cs.push(f);
        }
      });
      cs = [...new Set(cs)];
      cs = cs.sort((a, b) => a.Tier - b.Tier);
      spawns.innerHTML = sps
        .map(
          (d, i) =>
            `
<div class="sdata">
<span style="font-size: 20px;color:var(--col-cyan); padding-top: 4px; padding-bottom: 4px;">#${i +
              1} ${d.Map}</span>
<br>
<b>Daytime</b> - ${daytime(d.Daytime)}, 
<b>Level Range</b> - ${d.MinLVL} to ${d.MaxLVL}, <b>Tier</b> - ${
              d.Tier
            }, <b>Item</b> - ${d.Item || "None"}, <b>MS</b>: ${
              d.MemberOnly == true ? "Yes" : "No"
            }, <b>Fishing</b> - ${d.Fishing != undefined ? "Surf/Fish" : "Land"}
</div>`
        )
        .join("");
      changeTab("map");
      $("#inner-data").html(spawns.innerHTML);
      if (window.innerHeight > window.innerWidth) {
        window.location.href = "#data";
      }
    }
  };
  const getLocInfo = spot => {
    let info = locdatas[remp(spot)];
    $("#inner-data").html("");
    if (info) {
      //console.log("li1")
      $("#inner-data").html(`
<div class="sdata">
<h2 style="color:var(--col-cyan);">Location Landmarks</h2>
<ul>
${info
  .split(",")
  .map(e => "<li>" + e.trim() + "</li>")
  .join("")}
</ul>
</div>
`);
    }
  };
  
   search = (prev)=>{
    let val = prev||$("#search").val();
    if(MODE == "poke"){
      let sps = dat.filter(d=>d.Pokemon.toLowerCase().includes(val.toLowerCase()));
      if(sps.length == 0) return $("#search-data").html("Cannot find such Pokémon in spawn data.");
      $("#search-data").html([...new Set(sps.map(s=>s.Pokemon))].map(d=>`
<div class="sdata" style="color:var(--col-cyan); text-align: left;">
<a href="javascript:void(0);" onclick="setPokemon('${d}')">${d}</a>
</div>
`).join(""));
    } else {
      let sps = dat.filter(d=>d.Map.toLowerCase().includes(val.toLowerCase()));
      if(sps.length == 0) return $("#search-data").html("Cannot find such Location in spawn data.");
      $("#search-data").html([...new Set(sps.map(s=>s.Map))].map(d=>`
<div class="sdata" style="color:var(--col-cyan); text-align: left;">
<a href="javascript:void(0);" onclick="getSpotData('${d}')">${d}</a>
</div>
`).join(""));
    }
  };
  setMode("loc");
  await addSpots();
  let queries = window.location.href.split("/?")[1];
  if(queries){
    queries = queries.split("&").map(p=>p.split("=")).map(p=>{return{key:p[0],value:(p[1]||null)}});
    //console.log(queries)
    let q = queries.find((q)=>q.key=="poke"||q.key=="loc"||q.key=="tab"||q.key=="search"||q.key=="mode");
    if(q){
      if(q.value){
        q.value = q.value.replace(/\++/g, " ");
        if(q.key == "poke"){
          setPokemon(q.value);
        } else if(q.key == "loc"){
          getSpotData(q.value);
        } else if(q.key == "tab"){
          if(["map","select","about"].includes(q.value)){
            q.value = q.value.replace("select","options")
            changeTab(q.value)
          }
        } else if(q.key == "search"){
          //console.log("s1");
          let typ = queries.find(q=>q.key=="mode");
          if(typ){
          //console.log("s2");
            if(typ.value == "loc" || typ.value == "poke"){
              setMode(typ.value);
              changeTab("options");
              search(q.value);
          //console.log("s3");
            }
          }
        } else if(q.key == "mode"){
          if(q.value == "loc" || q.value == "poke"){
              setMode(q.value);
            }
        }
      }
    }
  }
});
