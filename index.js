eruda.init();

var popover = new bootstrap.Popover(
  document.querySelector(".popover-dismiss"),
  {
    trigger: "focus",
    html: true,
  }
);

const base_url = "https://ojk-invest-api.vercel.app/api/";
const yadi = {
  adi: "apps",
  mulyana: "products",
  listApps: document.getElementById("listApps"),
  listProduk: document.getElementById("listProduk"),
};

const getData = (url, data) => {
  return fetch(url + data)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res) => res)
    .catch((error) => console.error(error));
};

const loading = (html, color) => {
  html.innerHTML = `<button class="btn btn-${color} shadow rounded-3" style="height: 3rem;" type="button" disabled>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...
</button>`;
};

const ojkCheckerApps = async () => {
  loading(yadi.listApps, "primary");
  loading(yadi.listProduk, "warning");

  const ojkApps = await getData(base_url, yadi.adi);
  const ojkProduk = await getData(base_url, yadi.mulyana);

  try {
    action(ojkApps, yadi.listApps);
    action(ojkProduk, yadi.listProduk);
  } catch (e) {
    console.log(e);
  }
};

const action = (data, html) => {
  const x = data.data;
  let templateApps = "";
  let templateProduk = "";
  if (data.error === null && x.apps) {
    x.apps.forEach((item) => {
      templateApps += cardAppsTemplates(item.name, item.owner, item.url);
      html.innerHTML = templateApps;
    });
  } else if (data.count && data.version) {
    //console.log(data);
    x.forEach((item) => {
      //console.log(item);
      if (parseInt(item.id) < 10000) {
        templateProduk += produkCardTemplates(
          item.name,
          item.management,
          item.custodian,
          item.type
        );
      }
    });
    console.log(data.count);
    html.innerHTML = templateProduk;
  }
};

ojkCheckerApps();

const cardAppsTemplates = (title, yadi, url) => `
          <div
            class="card col shadow-lg text-white bg-primary m-3"
            style="
              max-width: 100rem;
              min-width: 20rem;
              box-shadow: 0 0.125rem 0.25rem rgba(#444, 0.075);
            "
          >
               <h4 class="card-header">${title ? title : ""}</h4>
           <div class="card-body">
              <p class="card-title">
                Dikelola oleh : ${yadi ? yadi : ""}
              </p>
               <a href="http://${
                 url ? url : ""
               }" target="_blank" class="btn btn-info">Link</a>
           </div>
          </div>
`;
const produkCardTemplates = (header, title, text, type) => `
          <div
            class="card col text-dark bg-warning m-3"
            style="max-width: 100rem; min-width: 20rem"
          >
            <div class="card-header">${header ? header : ""}</div>
            <div class="card-body">
              <h5 class="card-title"> Management : <i>${
                title ? title : ""
              }</i></h5>
              <p class="card-text">
               Custodian : ${text ? text : ""}
              </p>
              <p class="card-text"><small class="text-muted">Type : ${
                type ? type : ""
              }</small></p>

           </div>
          </div>`;
