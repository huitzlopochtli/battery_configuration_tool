function generateCellCapacityFields() {
  const seriesCount = parseInt(document.getElementById('series').value);
  const parallelCount = parseInt(document.getElementById('parallel').value);
  const defaultCapacity = parseInt(document.getElementById('defaultCapacity').value);

  const fieldsContainer = document.getElementById('fields');
  fieldsContainer.innerHTML = '';

  for (let s = 0; s < seriesCount; s++) {
    for (let p = 0; p < parallelCount; p++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.placeholder = 'Enter cell capacity (mAh)';
      if (!isNaN(defaultCapacity)) {
        input.value = defaultCapacity;
      }
      const label = document.createElement('label');
      label.textContent = `Cell ${s * parallelCount + p + 1}: `;
      fieldsContainer.appendChild(label);
      fieldsContainer.appendChild(input);
      fieldsContainer.appendChild(document.createElement('br'));
    }
  }
}

function findBalancedConfig() {
  const seriesCount = parseInt(document.getElementById('series').value);
  const parallelCount = parseInt(document.getElementById('parallel').value);
  const voltage = document.getElementById('defaultVoltage').value;

  const capacities = [];
  const inputs = document.querySelectorAll('#fields input');

  // Collect the input values and cell numbers
  const cellData = [];
  inputs.forEach((input, index) => {
    const capacity = parseInt(input.value);
    if (!isNaN(capacity)) {
      capacities.push({ number: index + 1, capacity });
      cellData.push({ number: index + 1, capacity });
    }
  });

  // Check if enough capacities are provided
  if (capacities.length !== seriesCount * parallelCount) {
    alert('Please enter capacity for all cells.');
    return;
  }

  // Sort capacities in descending order
  capacities.sort((a, b) => b.capacity - a.capacity);

  // Initialize parallel groups with empty arrays
  const parallelGroups = new Array(parallelCount).fill().map(() => []);

  // Distribute cells to parallel groups
  for (let i = 0; i < capacities.length; i++) {
    const cell = capacities[i];
    const groupIndex = i % parallelCount;
    parallelGroups[groupIndex].push(cell);
  }

  // Calculate total capacity
  const totalCapacity = capacities.reduce((total, cell) => total + cell.capacity, 0);

  // Display total capacity
  const totalCapacityResult = document.getElementById('totalCapacityResult');
  totalCapacityResult.textContent = `Total Cell Capacity: ${totalCapacity / parallelCount / 1000} Ah`;

  // Display voltage result
  const voltageResult = document.getElementById('voltageResults');
  voltageResult.textContent = `Total Voltage: ${Math.round(voltage * parallelCount)}V`;

  // Display the balanced configuration with cell numbers and group capacities
  const resultContainer = document.getElementById('parallelGroupResults');
  resultContainer.innerHTML = ''; // Clear previous results

  parallelGroups.forEach((group, index) => {
    const groupInfo = group.map(cell => `#${cell.number} (${cell.capacity} mAh)`);
    const totalGroupCapacity = group.reduce((total, cell) => total + cell.capacity, 0);
    resultContainer.innerHTML += `<p>Parallel ${index + 1} - Total Capacity: ${totalGroupCapacity} mAh<br>Cell Configuration: <br>${groupInfo.join(', <br>')}</p>`;
  });
}

