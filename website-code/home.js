import {importJson} from './scripts/import-export.js';

window.addEventListener('DOMContentLoaded', () => {

  document.getElementById('uploadButton').addEventListener('click', (event) => importJson(event));

});