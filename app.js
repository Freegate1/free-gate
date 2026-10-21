const state = {
  events: [],
  filter: "all",
  query: ""
};

const eventList = document.getElementById("event-list");
const notesList = document.getElementById("notes-list");
const searchInput = document.getElementById("search-input");
const statusNode = document.getElementById("last-updated");

const tagMarkup = (who) => {
  const labels = {
    everyone: "Free for adults",
    kids: "Kids free",
    members: "Members free"
  };

  const classes = {
    everyone: "tag",
    kids: "tag kids",
    members: "tag members"
  };

  return (who || []).map(tag => {
    return `<span class="${classes[tag] || "tag"}">${labels[tag] || tag}</span>`;
  }).join("");
};

const renderNotes = (notes) => {
  if (!notes || !notes.length) {
    notesList.innerHTML = "<li>No seasonal notes right now.</li>";
    return;
  }

  notesList.innerHTML = notes.map(note => `
    <li>
      <strong>${note.title}</strong><br />
      ${note.body}
    </li>
  `).join("");
};

const renderStats = (items) => {
  document.getElementById("stat-count").textContent = String(items.length);
  document.getElementById("mini-upcoming").textContent = String(items.length);

  const kids = items.filter(event => event.who.includes("kids")).length;
  const members = items.filter(event => event.who.includes("members")).length;

  document.getElementById("stat-kids").textContent = String(kids);
  document.getElementById("mini-kids").textContent = String(kids);
  document.getElementById("mini-members").textContent = String(members);
};

const renderEvents = () => {
  const query = state.query.trim().toLowerCase();

  const filtered = state.events.filter(event => {
    const matchesFilter = state.filter === "all" || event.who.includes(state.filter);
    const haystack = [
      event.title,
      event.sport,
      event.venue,
      event.time,
      event.how,
      event.srcName
    ].join(" ").toLowerCase();

    const matchesQuery = !query || haystack.includes(query);

    return matchesFilter && matchesQuery;
  });

  if (!filtered.length) {
    eventList.innerHTML = `
      <div class="empty-state">
        Nothing matches that filter right now. Try a different category or search term.
      </div>
    `;
    return;
  }

  eventList.innerHTML = filtered.map(event => {
    const date = new Date(`${event.date}T00:00:00`);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat("en-AU", { month: "short" }).format(date);

    return `
      <article class="card">
        <div class="card-top">
          <div class="date-box">
            <span class="day">${day}</span>
            <span class="month">${month}</span>
          </div>

          <div class="card-meta">
            ${tagMarkup(event.who)}
            <h3 class="card-title">${event.title}</h3>
          </div>
        </div>

        <div class="card-body">
          <p class="card-sub">${event.sport}</p>
          <p><strong>Venue:</strong> ${event.venue}</p>
          <p><strong>When:</strong> ${event.time}</p>
          <p>${event.how}</p>
          ${event.flag ? `<p><em>${event.flag}</em></p>` : ""}
          <div class="frame">
            <span class="dot" aria-hidden="true"></span>
            <span>Source: ${event.srcName}</span>
          </div>
          <a class="link" href="${event.src}" target="_blank" rel="noreferrer">View source</a>
        </div>
      </article>
    `;
  }).join("");

  renderStats(filtered);
};

const updateStatus = (updatedAt) => {
  if (!updatedAt) {
    statusNode.textContent = "No update yet";
    return;
  }

  const formatted = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(updatedAt));

  statusNode.textContent = `Updated ${formatted}`;
};

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(btn => {
      btn.classList.toggle("active", btn === button);
    });
    renderEvents();
  });
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderEvents();
});

fetch("/events.json", { cache: "no-cache" })
  .then(res => {
    if (!res.ok) throw new Error("Failed to load JSON");
    return res.json();
  })
  .then(data => {
    state.events = [...(data.events || [])].sort((a, b) => a.date.localeCompare(b.date));
    renderEvents();
    renderNotes(data.notes || []);
    updateStatus(data.updatedAt);
  })
  .catch(() => {
    eventList.innerHTML = `
      <div class="empty-state">
        Couldn’t load the latest fixtures. Check the data file or refresh the page.
      </div>
    `;
    notesList.innerHTML = "<li>Unable to load notes.</li>";
    statusNode.textContent = "Unable to load";
  });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
