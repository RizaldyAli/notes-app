(() => { class t extends HTMLElement { constructor() { super() }
        connectedCallback() { this.innerHTML = "\n            <header>\n                <h1>Notes App</h1>\n            </header>\n        " } }
    customElements.define("app-bar", t);
    class e extends HTMLElement { constructor() { super() }
        connectedCallback() { const t = this.getAttribute("title"),
                e = this.getAttribute("body");
            this.innerHTML = `\n            <div class="note">\n                <h2>${t}</h2>\n                <p>${e}</p>\n                <button class="delete-button">Delete</button>\n            </div>\n        ` } }
    customElements.define("note-item", e);
    class n extends HTMLElement { constructor() { super() }
        connectedCallback() { this.innerHTML = '\n            <form id="noteForm">\n                <input type="text" id="noteTitle" placeholder="Title" required>\n                <textarea id="noteBody" placeholder="Write your note here" required></textarea>\n                <button type="submit">Add Note</button>\n            </form>\n        ' } }
    customElements.define("note-input", n); const o = "https://notes-api.dicoding.dev/v2/notes";
    async function r() { try { const t = await async function() { try { const t = await fetch(o); return await t.json() } catch (t) { throw console.error("Error getting notes:", t), t } }(),
                e = document.getElementById("noteList");
            e.innerHTML = "", t.data.forEach((t => { const n = document.createElement("note-item");
                n.setAttribute("title", t.title), n.setAttribute("body", t.body), n.setAttribute("note-id", t.id), e.appendChild(n) })) } catch (t) { console.error("Error rendering notes:", t) } } const i = document.getElementById("noteForm");
    i.addEventListener("submit", (async function(t) { t.preventDefault(); const e = document.getElementById("noteTitle").value,
            n = document.getElementById("noteBody").value; if ("" !== e.trim() && "" !== n.trim()) try { await async function(t, e) { try { const n = await fetch(o, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: t, body: e }) }); return await n.json() } catch (t) { throw console.error("Error creating note:", t), t } }(e, n), await r(), i.reset() } catch (t) { console.error("Error creating note:", t) } else alert("Please fill in both title and body fields.") })), document.getElementById("noteList").addEventListener("click", (async function(t) { if (t.target.classList.contains("delete-button")) { const e = t.target.closest("note-item").getAttribute("note-id"); try { await async function(t) { try { const e = await fetch(`${o}/${t}`, { method: "DELETE" }); return await e.json() } catch (t) { throw console.error("Error deleting note:", t), t } }(e), await r() } catch (t) { console.error("Error deleting note:", t) } } })), window.onload = r })();