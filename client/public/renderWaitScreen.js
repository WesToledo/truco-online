export default function renderWaitList(waitList) {
  
  const list = document.querySelector("#players");
  list.querySelectorAll("*").forEach((n) => n.remove());

  const playerEl = document.createElement("div");
  const rows = waitList.map((player) => {
    return `<li>
            <div class="card">
              <div class="card-content">
                <div class="content">
                  <img src="${player.imageURL}" width="30" height="30" / >
                  <div class="name">${player.name}</div>
                  <div class="description">${player.admin}</div>
                </div>
              </div>
            </div>
          </li>`;
  });
  const html = `<ul>${rows.join("")}</ul>`;
  playerEl.innerHTML = html;

  list.appendChild(playerEl);
}
