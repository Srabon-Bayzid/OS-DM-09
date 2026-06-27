
const processBody =
document.getElementById("processBody");

const addProcessBtn =
document.getElementById("addProcess");

const previewQuantum =
document.getElementById("previewQuantum");



let processCounter = 1;



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


const ENERGY_MAP = {

    Light: 2,

    Moderate: 5,

    Heavy: 8
};


function calculateAdaptiveQuantum(
processes
)
{
    const totalBurst =
    processes.reduce(
        (sum,p)=>
        sum + p.burst,
        0
    );

    const avgBurst =
    totalBurst /
    processes.length;

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

    return {

        quantum,

        avgBurst,

        factor
    };
}


function generateMetrics(
processes
)
{
    processes.forEach(p =>
    {
        p.turnaroundTime =

        p.completionTime
        -
        p.arrival;

        p.waitingTime =

        p.turnaroundTime
        -
        p.burst;
    });
}


function calculateAverages(
processes
)
{
    const avgWT =
    processes.reduce(
        (sum,p)=>
        sum+p.waitingTime,
        0
    ) /
    processes.length;

    const avgTAT =
    processes.reduce(
        (sum,p)=>
        sum+p.turnaroundTime,
        0
    ) /
    processes.length;

    const avgRT =
    processes.reduce(
        (sum,p)=>
        sum+p.responseTime,
        0
    ) /
    processes.length;

    return {

        avgWT:
        avgWT.toFixed(2),

        avgTAT:
        avgTAT.toFixed(2),

        avgRT:
        avgRT.toFixed(2)
    };
}


function calculateEnergyScore(
processes
)
{
    let total = 0;

    processes.forEach(p =>
    {
        total +=
        ENERGY_MAP[
            p.profile
        ];
    });

    return total;
}


function runEcoRR(
processes
)
{
    const quantumInfo =
    calculateAdaptiveQuantum(
        processes
    );

    const quantum =
    quantumInfo.quantum;

    const readyQueue = [];

    const gantt = [];

    const qosEvents = [];

    let completedCount = 0;

    let time = 0;

    let contextSwitches = 0;

    let previousPID = null;

    processes.forEach(p =>
    {
        p.remaining =
        p.burst;

        p.responseTime =
        null;

        p.completionTime =
        null;

        p.inQueue =
        false;

        p.qosApplied =
        false;
    });

    while(
        completedCount <
        processes.length
    )
    {
      

        processes.forEach(p =>
        {
            if(
                p.arrival <= time &&
                p.remaining > 0 &&
                !p.inQueue
            )
            {
                if(
                    p.critical &&
                    !p.qosApplied
                )
                {
                    readyQueue.unshift(
                        p
                    );

                    p.qosApplied =
                    true;

                    qosEvents.push(

                    `${p.pid}
                    received QoS boost`

                    );
                }
                else
                {
                    readyQueue.push(
                        p
                    );
                }

                p.inQueue =
                true;
            }
        });

        if(
            readyQueue.length===0
        )
        {
            time++;
            continue;
        }

        const current =
        readyQueue.shift();

        current.inQueue =
        false;

        if(
            current.responseTime
            === null
        )
        {
            current.responseTime =

            time
            -
            current.arrival;
        }

        if(
            previousPID &&
            previousPID !==
            current.pid
        )
        {
            contextSwitches++;
        }

        previousPID =
        current.pid;

        const runTime =
        Math.min(
            quantum,
            current.remaining
        );

        const startTime =
        time;

        time += runTime;

        current.remaining -=
        runTime;

        gantt.push({

            pid:
            current.pid,

            start:
            startTime,

            end:
            time
        });

        

        processes.forEach(p =>
        {
            if(
                p.arrival >
                startTime &&

                p.arrival <=
                time &&

                p.remaining > 0 &&

                !p.inQueue &&

                p !== current
            )
            {
                if(
                    p.critical &&
                    !p.qosApplied
                )
                {
                    readyQueue.unshift(
                        p
                    );

                    p.qosApplied =
                    true;

                    qosEvents.push(

                    `${p.pid}
                    received QoS boost`

                    );
                }
                else
                {
                    readyQueue.push(
                        p
                    );
                }

                p.inQueue =
                true;
            }
        });

        if(
            current.remaining <= 0
        )
        {
            current.completionTime =
            time;

            completedCount++;
        }
        else
        {
            readyQueue.push(
                current
            );

            current.inQueue =
            true;
        }
    }

    generateMetrics(
        processes
    );

    return {

        quantum,

        avgBurst:
        quantumInfo.avgBurst,

        factor:
        quantumInfo.factor,

        gantt,

        qosEvents,

        contextSwitches,

        completed:
        processes
    };
}


function runTraditionalRR(
processes
)
{
    const quantum = 4;

    const queue = [];

    let time = 0;

    let completedCount = 0;

    processes.forEach(p =>
    {
        p.remaining =
        p.burst;

        p.responseTime =
        null;

        p.completionTime =
        null;

        p.inQueue =
        false;
    });

    while(
        completedCount <
        processes.length
    )
    {
        processes.forEach(p =>
        {
            if(
                p.arrival <= time &&
                p.remaining > 0 &&
                !p.inQueue
            )
            {
                queue.push(p);

                p.inQueue =
                true;
            }
        });

        if(queue.length===0)
        {
            time++;
            continue;
        }

        const current =
        queue.shift();

        current.inQueue =
        false;

        if(
            current.responseTime
            === null
        )
        {
            current.responseTime =
            time -
            current.arrival;
        }

        const runTime =
        Math.min(
            quantum,
            current.remaining
        );

        time += runTime;

        current.remaining -=
        runTime;

        if(
            current.remaining <= 0
        )
        {
            current.completionTime =
            time;

            completedCount++;
        }
        else
        {
            queue.push(
                current
            );

            current.inQueue =
            true;
        }
    }

    generateMetrics(
        processes
    );

    return processes;
}


function renderGanttChart(
gantt
)
{
    const container =
    document.getElementById(
    "ganttChart"
    );

    container.innerHTML = "";

    gantt.forEach(block =>
    {
        const div =
        document.createElement(
        "div"
        );

        div.className =

        `
        bg-cyan-500
        text-black
        rounded-xl
        p-4
        min-w-[120px]
        text-center
        font-bold
        `;

        div.innerHTML =

        `
        ${block.pid}
        <br>

        ${block.start}
        →
        ${block.end}
        `;

        container.appendChild(
        div
        );
    });
}


function renderQoSLog(
events
)
{
    const log =
    document.getElementById(
    "qosLog"
    );

    if(events.length===0)
    {
        log.innerHTML =

        `
        <p class="text-slate-400">
        No QoS Events
        </p>
        `;

        return;
    }

    log.innerHTML = "";

    events.forEach(event =>
    {
        const item =
        document.createElement(
        "div"
        );

        item.className =

        `
        bg-slate-800
        p-3
        rounded-xl
        mb-2
        `;

        item.textContent =
        event;

        log.appendChild(item);
    });
}


function renderMetrics(
processes
)
{
    const body =
    document.getElementById(
    "metricsBody"
    );

    body.innerHTML = "";

    processes.forEach(p =>
    {
        body.innerHTML +=

        `
        <tr>

            <td class="p-3">
            ${p.pid}
            </td>

            <td class="p-3">
            ${p.waitingTime}
            </td>

            <td class="p-3">
            ${p.turnaroundTime}
            </td>

            <td class="p-3">
            ${p.responseTime}
            </td>

        </tr>
        `;
    });
}


function renderQuantumExplanation(
avgBurst,
factor,
quantum
)
{
    document
    .getElementById(
    "quantumExplanation"
    )
    .innerHTML =

    `
    <h3 class="text-xl font-bold mb-2">

    Adaptive Quantum Calculation

    </h3>

    <p>

    Average Burst:
    ${avgBurst.toFixed(2)}

    </p>

    <p>

    Mode Factor:
    ${factor}

    </p>

    <p>

    Final Quantum:
    ${quantum}

    </p>
    `;
}


function renderResourceAnalysis(
processes
)
{
    let light = 0;
    let moderate = 0;
    let heavy = 0;

    processes.forEach(p =>
    {
        if(
            p.profile==="Light"
        )
        light++;

        if(
            p.profile==="Moderate"
        )
        moderate++;

        if(
            p.profile==="Heavy"
        )
        heavy++;
    });

    document
    .getElementById(
    "resourceAnalysis"
    )
    .innerHTML =

    `
    <div class="grid md:grid-cols-3 gap-4">

        <div class="bg-slate-800 p-4 rounded-xl">

            Light Processes

            <h2 class="text-3xl font-bold">

            ${light}

            </h2>

        </div>

        <div class="bg-slate-800 p-4 rounded-xl">

            Moderate Processes

            <h2 class="text-3xl font-bold">

            ${moderate}

            </h2>

        </div>

        <div class="bg-slate-800 p-4 rounded-xl">

            Heavy Processes

            <h2 class="text-3xl font-bold">

            ${heavy}

            </h2>

        </div>

    </div>
    `;
}


function renderComparison(
rrAvg,
ecoAvg
)
{
    const body =
    document.getElementById(
    "comparisonBody"
    );

    body.innerHTML =

    `
    <tr>

        <td class="p-3">

        Avg Waiting

        </td>

        <td class="p-3">

        ${rrAvg.avgWT}

        </td>

        <td class="p-3">

        ${ecoAvg.avgWT}

        </td>

    </tr>

    <tr>

        <td class="p-3">

        Avg Turnaround

        </td>

        <td class="p-3">

        ${rrAvg.avgTAT}

        </td>

        <td class="p-3">

        ${ecoAvg.avgTAT}

        </td>

    </tr>

    <tr>

        <td class="p-3">

        Avg Response

        </td>

        <td class="p-3">

        ${rrAvg.avgRT}

        </td>

        <td class="p-3">

        ${ecoAvg.avgRT}

        </td>

    </tr>
    `;
}


function updateSummaryCards(
mode,
quantum,
contextSwitches,
energy
)
{
    document
    .getElementById(
    "modeCard"
    )
    .textContent =
    mode;

    document
    .getElementById(
    "quantumCard"
    )
    .textContent =
    quantum;

    document
    .getElementById(
    "contextCard"
    )
    .textContent =
    contextSwitches;

    document
    .getElementById(
    "energyCard"
    )
    .textContent =
    energy;
}
function cloneProcesses(
processes
)
{
    return JSON.parse(
    JSON.stringify(
    processes
    )
    );
}


document
.getElementById(
"runScheduler"
)
.addEventListener(
"click",
() =>
{
    const processes =
    getProcesses();

    if(
        !processes ||
        processes.length===0
    )
    {
        alert(
        "Please add process."
        );

        return;
    }

    const ecoData =
    runEcoRR(
        cloneProcesses(
            processes
        )
    );

    const rrProcesses =
    runTraditionalRR(
        cloneProcesses(
            processes
        )
    );

    const ecoAvg =
    calculateAverages(
        ecoData.completed
    );

    const rrAvg =
    calculateAverages(
        rrProcesses
    );

    const energy =
    calculateEnergyScore(
        processes
    );

    renderGanttChart(
        ecoData.gantt
    );

    renderQoSLog(
        ecoData.qosEvents
    );

    renderMetrics(
        ecoData.completed
    );

    renderQuantumExplanation(

        ecoData.avgBurst,

        ecoData.factor,

        ecoData.quantum
    );

    renderResourceAnalysis(
        processes
    );

    renderComparison(
        rrAvg,
        ecoAvg
    );

    updateSummaryCards(

        getSelectedMode(),

        ecoData.quantum,

        ecoData.contextSwitches,

        energy
    );
});
