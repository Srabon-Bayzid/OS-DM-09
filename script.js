
const processBody =
document.getElementById("processBody");

const addProcessBtn =
document.getElementById("addProcess");

const previewQuantum =
document.getElementById("previewQuantum");

// PID Counter

let processCounter = 1;

// Add Process Row

function addProcessRow(data = {})
{
    const row =
    document.createElement("tr");

    row.className =
    "border-b border-slate-800";

    const pid =
    data.pid ||
    `P${processCounter++}`;

    row.innerHTML = `

    <td class="p-2">

        <input
        class="pid bg-slate-800 rounded-lg p-2 w-full"

        value="${pid}">

    </td>

    <td class="p-2">

        <input
        type="number"
        min="0"

        class="arrival bg-slate-800 rounded-lg p-2 w-full"

        value="${data.arrival ?? 0}">

    </td>

    <td class="p-2">

        <input
        type="number"
        min="1"

        class="burst bg-slate-800 rounded-lg p-2 w-full"

        value="${data.burst ?? 5}">

    </td>

    <td class="p-2">

        <select
        class="critical bg-slate-800 rounded-lg p-2">

            <option
            ${data.critical ? "selected" : ""}>
            Yes
            </option>

            <option
            ${!data.critical ? "selected" : ""}>
            No
            </option>

        </select>

    </td>

    <td class="p-2">

        <select
        class="profile bg-slate-800 rounded-lg p-2">

            <option
            ${data.profile==="Light"?"selected":""}>
            Light
            </option>

            <option
            ${data.profile==="Moderate"?"selected":""}>
            Moderate
            </option>

            <option
            ${data.profile==="Heavy"?"selected":""}>
            Heavy
            </option>

        </select>

    </td>

    <td class="p-2">

        <button
        class="deleteBtn

        bg-red-500
        hover:bg-red-400

        text-black

        px-3 py-2

        rounded-lg">

            Delete

        </button>

    </td>

    `;

    processBody.appendChild(row);

    attachDeleteEvents();

    updateQuantumPreview();
}
function attachDeleteEvents()
{
    document
    .querySelectorAll(".deleteBtn")
    .forEach(button =>
    {
        button.onclick = () =>
        {
            button
            .closest("tr")
            .remove();

            updateQuantumPreview();
        };
    });
}
addProcessBtn.addEventListener(
"click",
() =>
{
    addProcessRow();
});
function getSelectedMode()
{
    return document.querySelector(
        'input[name="mode"]:checked'
    ).value;
}

function getModeFactor()
{
    const mode =
    getSelectedMode();

    if(mode==="performance")
        return 1.2;

    if(mode==="balanced")
        return 0.9;

    return 0.7;
}
function updateQuantumPreview()
{
    const burstInputs =
    document.querySelectorAll(
        ".burst"
    );

    if(
        burstInputs.length===0
    )
    {
        previewQuantum.textContent =
        "--";

        return;
    }

    let total = 0;

    burstInputs.forEach(input =>
    {
        total +=
        Number(input.value);
    });

    const avgBurst =
    total /
    burstInputs.length;

    const factor =
    getModeFactor();

    let quantum =
    Math.round(
        avgBurst * factor
    );

    quantum =
    Math.max(
        2,
        quantum
    );

    quantum =
    Math.min(
        15,
        quantum
    );

    previewQuantum.textContent =
    quantum;
}
document.addEventListener(
"input",
event =>
{
    if(
        event.target.classList
        .contains("burst")
    )
    {
        updateQuantumPreview();
    }
});

document
.querySelectorAll(
'input[name="mode"]'
)
.forEach(radio =>
{
    radio.addEventListener(
    "change",
    updateQuantumPreview
    );
});
function getProcesses()
{
    const rows =
    document.querySelectorAll(
    "#processBody tr"
    );

    const processes = [];

    const pidSet =
    new Set();

    for(const row of rows)
    {
        const pid =
        row.querySelector(".pid")
        .value.trim();

        const arrival =
        Number(
            row.querySelector(".arrival")
            .value
        );

        const burst =
        Number(
            row.querySelector(".burst")
            .value
        );

        const critical =
        row.querySelector(".critical")
        .value === "Yes";

        const profile =
        row.querySelector(".profile")
        .value;

        if(!pid)
        {
            alert(
            "PID cannot be empty."
            );

            return null;
        }

        if(pidSet.has(pid))
        {
            alert(
            "Duplicate PID found."
            );

            return null;
        }

        if(arrival < 0)
        {
            alert(
            "Arrival Time cannot be negative."
            );

            return null;
        }

        if(burst <= 0)
        {
            alert(
            "Burst Time must be positive."
            );

            return null;
        }

        pidSet.add(pid);

        processes.push({

            pid,

            arrival,

            burst,

            critical,

            profile,

            remaining: burst,

            responseTime: null,

            completionTime: null,

            qosApplied: false,

            inQueue: false
        });
    }

    return processes;
}
addProcessRow({
    pid:"P1",
    arrival:0,
    burst:10,
    critical:false,
    profile:"Heavy"
});

addProcessRow({
    pid:"P2",
    arrival:1,
    burst:5,
    critical:true,
    profile:"Light"
});

addProcessRow({
    pid:"P3",
    arrival:2,
    burst:8,
    critical:false,
    profile:"Moderate"
});

updateQuantumPreview();