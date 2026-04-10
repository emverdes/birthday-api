(function () {
  'use strict';

  const config = window.APP_CONFIG || {};
  const apiBase = (config.API_BASE_URL || '').replace(/\/$/, '');

  const apiBaseValue = document.getElementById('apiBaseValue');
  const apiStatus = document.getElementById('apiStatus');
  const healthOutput = document.getElementById('healthOutput');
  const peopleTableBody = document.getElementById('peopleTableBody');
  const personByIdOutput = document.getElementById('personByIdOutput');
  const birthdaysTodayOutput = document.getElementById('birthdaysTodayOutput');
  const birthdaysMonthOutput = document.getElementById('birthdaysMonthOutput');

  apiBaseValue.textContent = apiBase || 'No configurado';

  function setBadge(kind, text) {
    apiStatus.className = 'badge ' + kind;
    apiStatus.textContent = text;
  }

  async function apiGet(path) {
    const response = await fetch(apiBase + path, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    const contentType = response.headers.get('content-type') || '';
    let payload;
    if (contentType.includes('application/json')) {
      payload = await response.json();
    } else {
      payload = await response.text();
    }

    if (!response.ok) {
      throw new Error(typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2));
    }

    return payload;
  }

  function showJson(element, data) {
    element.textContent = JSON.stringify(data, null, 2);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function renderPeopleTable(rows) {
    if (!Array.isArray(rows) || rows.length === 0) {
      peopleTableBody.innerHTML = '<tr><td colspan="6">No hay registros.</td></tr>';
      return;
    }

    peopleTableBody.innerHTML = rows.map(row => `
      <tr>
        <td>${escapeHtml(row.id ?? '')}</td>
        <td>${escapeHtml(row.first_name ?? '')}</td>
        <td>${escapeHtml(row.last_name ?? '')}</td>
        <td>${escapeHtml(row.birth_date ?? '')}</td>
        <td>${escapeHtml(row.email ?? '')}</td>
        <td>${escapeHtml(row.city ?? '')}</td>
      </tr>
    `).join('');
  }

  async function checkHealth() {
    healthOutput.textContent = 'Consultando...';
    try {
      const data = await apiGet('/health');
      showJson(healthOutput, data);
      setBadge('ok', 'Operativa');
    } catch (error) {
      healthOutput.textContent = error.message;
      setBadge('error', 'Error');
    }
  }

  async function loadPeople() {
    try {
      const data = await apiGet('/api/people');
      renderPeopleTable(data);
    } catch (error) {
      peopleTableBody.innerHTML = `<tr><td colspan="6">Error: ${escapeHtml(error.message)}</td></tr>`;
    }
  }

  async function loadPersonById(personId) {
    personByIdOutput.textContent = 'Consultando...';
    try {
      const data = await apiGet(`/api/people/${personId}`);
      showJson(personByIdOutput, data);
    } catch (error) {
      personByIdOutput.textContent = error.message;
    }
  }

  async function loadBirthdaysToday() {
    birthdaysTodayOutput.textContent = 'Consultando...';
    try {
      const data = await apiGet('/api/birthdays/today');
      showJson(birthdaysTodayOutput, data);
    } catch (error) {
      birthdaysTodayOutput.textContent = error.message;
    }
  }

  async function loadBirthdaysByMonth(month) {
    birthdaysMonthOutput.textContent = 'Consultando...';
    try {
      const data = await apiGet(`/api/birthdays/month/${month}`);
      showJson(birthdaysMonthOutput, data);
    } catch (error) {
      birthdaysMonthOutput.textContent = error.message;
    }
  }

  document.getElementById('checkHealthBtn').addEventListener('click', checkHealth);
  document.getElementById('reloadConfigBtn').addEventListener('click', function () {
    window.location.reload();
  });
  document.getElementById('loadPeopleBtn').addEventListener('click', loadPeople);
  document.getElementById('birthdaysTodayBtn').addEventListener('click', loadBirthdaysToday);

  document.getElementById('personByIdForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const personId = document.getElementById('personId').value;
    loadPersonById(personId);
  });

  document.getElementById('monthForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const month = document.getElementById('month').value;
    loadBirthdaysByMonth(month);
  });
})();
