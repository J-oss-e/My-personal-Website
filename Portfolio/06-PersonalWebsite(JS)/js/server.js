console.log("Running the script");
//couldn't make the flag work

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#Form form');
  if (!form) return;

  const scheduleTable = document.querySelector('#Schedule table');
  let tbody = scheduleTable && scheduleTable.querySelector('tbody');
  if (!tbody && scheduleTable) {
    tbody = document.createElement('tbody');
    const rows = Array.from(scheduleTable.querySelectorAll('tr'));
    if (rows.length > 0 && rows[0].querySelectorAll('th').length > 0) {
      rows.slice(1).forEach(r => tbody.appendChild(r));
      scheduleTable.appendChild(tbody);
    } else {
      rows.forEach(r => tbody.appendChild(r));
      scheduleTable.appendChild(tbody);
    }
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const date = document.getElementById('date')?.value || '';
    const start = document.getElementById('start')?.value || '';
    const end = document.getElementById('end')?.value || '';
    const activity = document.getElementById('activity')?.value || '';
    const place = document.getElementById('place')?.value || '';
    const type = document.getElementById('type')?.value || '';
    const notes = document.getElementById('notes')?.value || '';
    const busy = document.getElementById('status')?.checked;

    const tr = document.createElement('tr');
    const makeTd = (text) => { const td = document.createElement('td'); td.textContent = text; return td; };

    tr.appendChild(makeTd(date));
    tr.appendChild(makeTd(start));
    tr.appendChild(makeTd(end));
    tr.appendChild(makeTd(activity));
    tr.appendChild(makeTd(place));
    tr.appendChild(makeTd(type));
    tr.appendChild(makeTd(notes));

    const tdStatus = document.createElement('td');
    const img = document.createElement('img');
    img.width = 50; img.height = 50;
    img.alt = busy ? 'Busy' : 'Free';
    img.src = busy ? 'images/busy.png' : 'images/free.png';
    tdStatus.appendChild(img);
    tr.appendChild(tdStatus);

    if (!tbody) {
      scheduleTable.appendChild(tr);
    } else {
      tbody.appendChild(tr);
    }

    try {
      const list = JSON.parse(localStorage.getItem('schedules') || '[]');
      list.push({ date, start, end, activity, place, type, notes, busy: !!busy });
      localStorage.setItem('schedules', JSON.stringify(list));
    } catch (err) {
    }

    form.reset();
  });
});