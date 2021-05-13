export default function renderWaitList(waitList) {
  const table = document.querySelector("#players");
  table.querySelectorAll("*").forEach((n) => n.remove());

  const tableBody = document.createElement("tbody");
  const rows = waitList.map((player) => {
    return `<tr>
    <th scope="row">
      <div class="media align-items-center">
        <a class="avatar rounded-circle mr-3">
          <img
            src="${player.imageURL}"
          />
        </a>
        <div class="media-body">
          <span class="mb-0 text-sm"
            >${player.name}</span
          >
        </div>
      </div>
    </th>
    <td>${player.playerId}</td>
    <td>
      <span class="badge badge-dot mr-4">
        <i class="${
          player.admin ? "bg-success" : "bg-warning"
        }"></i> Administrador
      </span>
    </td>
    </tr>`;
  });

  const html = `${rows.join("")}`;
  tableBody.innerHTML = html;

  const tableHead = document.createElement("thead");
  tableHead.innerHTML = `<tr>
                      <th scope="col">Nome</th>
                      <th scope="col">ID</th>
                      <th scope="col">Admin</th>
                      <th scope="col"></th>
                    </tr>`;

  table.appendChild(tableHead);
  table.appendChild(tableBody);
}
